const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { db, initDb } = require('./db');
const { validateSignupInput, createAuthToken, JWT_SECRET } = require('./auth');
const { sendEnrollmentEmail } = require('./emailService');
const { seedCourses } = require('./seeder');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  });
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/courses', (req, res) => {
  db.all('SELECT * FROM courses', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch courses' });
    }
    return res.json({ courses: rows || [] });
  });
});

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    validateSignupInput({ name, email, password });

    const existing = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [email.trim()], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name.trim(), email.trim(), hashedPassword],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    const user = { id: result, name: name.trim(), email: email.trim() };
    const token = createAuthToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ message: 'User created successfully', user: { ...user }, token });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to sign up' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email.trim()], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createAuthToken({ id: user.id, email: user.email, name: user.name });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Login failed' });
  }
});

app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Protected profile page', user: req.user });
});

app.post('/api/enroll', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Fetch course details
    const course = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM courses WHERE id = ?', [courseId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existing = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
        [userId, courseId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
        [userId, courseId],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    // Send welcome email with course details
    const tutor = {
      name: course.tutor_name,
      email: course.tutor_email,
      bio: course.tutor_bio || 'Expert instructor',
      expertise: course.tutor_expertise || 'Professional education',
    };

    const courseDetails = {
      title: course.title,
      duration: course.duration || 'Self-paced',
      lessons: course.lessons || 0,
      level: course.level || 'All levels',
      price: course.price || 0,
      startDate: course.start_date || 'Available now',
      schedule: course.schedule || 'On-demand',
      firstClassTime: course.first_class_time || 'To be announced',
    };

    await sendEnrollmentEmail(req.user.email, req.user.id, courseDetails, tutor);

    return res.status(200).json({
      message: 'Successfully enrolled! Confirmation sent to your email.',
      enrollment: { userId, courseId },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Enrollment failed' });
  }
});

app.get('/api/enrollments', authenticateToken, async (req, res) => {
  try {
    const enrollments = await new Promise((resolve, reject) => {
      db.all(
        `SELECT c.*, e.enrolled_at, e.progress FROM courses c
         JOIN enrollments e ON c.id = e.course_id
         WHERE e.user_id = ?`,
        [req.user.id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });

    return res.json({ enrollments });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch enrollments' });
  }
});

async function startServer() {
  await initDb();
  seedCourses();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

module.exports = { app, startServer, authenticateToken };
