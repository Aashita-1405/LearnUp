const { db } = require('./db');

const sampleCourses = [
  {
    title: 'React for Beginners',
    category: 'Development',
    level: 'Beginner',
    rating: 4.8,
    students: '18k',
    price: 49,
    duration: '6h 30m',
    lessons: 28,
    description: 'Build a real product with React, hooks, routing, and modern patterns for frontend work.',
    tutor_name: 'John Smith',
    tutor_email: 'john.smith@learnup.com',
    tutor_bio: 'Senior Frontend Engineer with 10+ years of React experience',
    tutor_expertise: 'React, JavaScript, Web Development',
    start_date: '2026-08-20',
    schedule: 'Mondays & Wednesdays, 7 PM - 8:30 PM (EST)',
    first_class_time: '2026-08-20 at 7:00 PM EST',
  },
  {
    title: 'JavaScript Mastery',
    category: 'Development',
    level: 'Intermediate',
    rating: 4.9,
    students: '32k',
    price: 69,
    duration: '9h 10m',
    lessons: 42,
    description: 'Master JavaScript from foundation to advanced APIs, async patterns, and browser architecture.',
    tutor_name: 'Sarah Johnson',
    tutor_email: 'sarah.johnson@learnup.com',
    tutor_bio: 'Full Stack Developer & JavaScript Trainer with 8+ years experience',
    tutor_expertise: 'JavaScript, Node.js, Web APIs, Testing',
    start_date: '2026-08-25',
    schedule: 'Tuesdays & Thursdays, 6 PM - 7:30 PM (EST)',
    first_class_time: '2026-08-25 at 6:00 PM EST',
  },
  {
    title: 'UI/UX Design Fundamentals',
    category: 'Design',
    level: 'Beginner',
    rating: 4.7,
    students: '14k',
    price: 39,
    duration: '5h 15m',
    lessons: 18,
    description: 'Design interfaces that convert by learning layouts, hierarchy, and user flow design.',
    tutor_name: 'Emily Chen',
    tutor_email: 'emily.chen@learnup.com',
    tutor_bio: 'UX/UI Designer with award-winning portfolio from top tech companies',
    tutor_expertise: 'UI Design, UX Research, Figma, Design Thinking',
    start_date: '2026-08-22',
    schedule: 'Saturdays, 10 AM - 12 PM (EST)',
    first_class_time: '2026-08-22 at 10:00 AM EST',
  },
  {
    title: 'Python for Data Science',
    category: 'Data Science',
    level: 'Intermediate',
    rating: 4.8,
    students: '21k',
    price: 59,
    duration: '8h 20m',
    lessons: 36,
    description: 'Analyze data, visualize insights, and automate workflows with Python and notebooks.',
    tutor_name: 'Dr. Michael Torres',
    tutor_email: 'michael.torres@learnup.com',
    tutor_bio: 'Data Scientist & PhD in Machine Learning from Stanford University',
    tutor_expertise: 'Python, Data Analysis, Machine Learning, Statistics',
    start_date: '2026-08-21',
    schedule: 'Wednesdays & Fridays, 8 PM - 9:30 PM (EST)',
    first_class_time: '2026-08-21 at 8:00 PM EST',
  },
  {
    title: 'Marketing Essentials',
    category: 'Marketing',
    level: 'Beginner',
    rating: 4.6,
    students: '12k',
    price: 35,
    duration: '4h 05m',
    lessons: 16,
    description: 'Build campaigns, understand audiences, and create a scalable digital marketing plan.',
    tutor_name: 'Lisa Anderson',
    tutor_email: 'lisa.anderson@learnup.com',
    tutor_bio: 'Marketing Director with 7+ years in digital marketing and brand growth',
    tutor_expertise: 'Digital Marketing, Social Media, SEO, Content Strategy',
    start_date: '2026-08-28',
    schedule: 'Mondays & Thursdays, 5 PM - 6:30 PM (EST)',
    first_class_time: '2026-08-28 at 5:00 PM EST',
  },
  {
    title: 'Business Strategy',
    category: 'Business',
    level: 'Advanced',
    rating: 4.9,
    students: '9k',
    price: 79,
    duration: '11h 00m',
    lessons: 48,
    description: 'Learn to model markets, define strategy, and drive decisions using practical frameworks.',
    tutor_name: 'Robert Williams',
    tutor_email: 'robert.williams@learnup.com',
    tutor_bio: 'MBA from Harvard Business School, Ex-CEO of Fortune 500 company',
    tutor_expertise: 'Strategy, Business Model, Finance, Leadership',
    start_date: '2026-08-27',
    schedule: 'Sundays, 2 PM - 5 PM (EST)',
    first_class_time: '2026-08-27 at 2:00 PM EST',
  },
];

const sampleLessons = {
  'React for Beginners': [
    { title: 'Introduction to React', description: 'Get started with React basics and JSX', duration: 12, order: 1, video_url: 'https://example.com/react-intro' },
    { title: 'Components and Props', description: 'Learn how to build reusable components with props', duration: 15, order: 2, video_url: 'https://example.com/react-components' },
    { title: 'State and Hooks', description: 'Master useState and useEffect hooks', duration: 18, order: 3, video_url: 'https://example.com/react-hooks' },
    { title: 'Conditional Rendering', description: 'Render components conditionally based on state', duration: 10, order: 4, video_url: 'https://example.com/react-conditional' },
    { title: 'Lists and Keys', description: 'Render lists efficiently with React keys', duration: 14, order: 5, video_url: 'https://example.com/react-lists' },
    { title: 'Forms in React', description: 'Handle form inputs and validation', duration: 16, order: 6, video_url: 'https://example.com/react-forms' },
  ],
  'JavaScript Mastery': [
    { title: 'Variables and Data Types', description: 'Understanding var, let, const and primitive types', duration: 20, order: 1, video_url: 'https://example.com/js-variables' },
    { title: 'Functions and Scope', description: 'Function declarations, arrow functions, and scope chain', duration: 22, order: 2, video_url: 'https://example.com/js-functions' },
    { title: 'Callbacks and Promises', description: 'Handle asynchronous operations with callbacks and promises', duration: 25, order: 3, video_url: 'https://example.com/js-callbacks' },
    { title: 'Async/Await', description: 'Modern async syntax for cleaner code', duration: 18, order: 4, video_url: 'https://example.com/js-async' },
    { title: 'DOM Manipulation', description: 'Interact with the DOM using JavaScript', duration: 20, order: 5, video_url: 'https://example.com/js-dom' },
  ],
  'UI/UX Design Fundamentals': [
    { title: 'Design Principles', description: 'Core principles of visual design and hierarchy', duration: 18, order: 1, video_url: 'https://example.com/design-principles' },
    { title: 'Color Theory', description: 'Understanding colors and their psychology', duration: 15, order: 2, video_url: 'https://example.com/design-color' },
    { title: 'Typography', description: 'Choosing and combining fonts effectively', duration: 12, order: 3, video_url: 'https://example.com/design-typography' },
    { title: 'Wireframing', description: 'Create effective wireframes for interfaces', duration: 20, order: 4, video_url: 'https://example.com/design-wireframing' },
  ],
  'Python for Data Science': [
    { title: 'Python Basics', description: 'Python syntax, variables, and data structures', duration: 25, order: 1, video_url: 'https://example.com/python-basics' },
    { title: 'NumPy Essentials', description: 'Working with NumPy arrays and operations', duration: 22, order: 2, video_url: 'https://example.com/numpy-essentials' },
    { title: 'Pandas for Data', description: 'Manipulate data with Pandas DataFrames', duration: 24, order: 3, video_url: 'https://example.com/pandas-data' },
    { title: 'Data Visualization', description: 'Create beautiful visualizations with Matplotlib', duration: 20, order: 4, video_url: 'https://example.com/matplotlib' },
  ],
  'Marketing Essentials': [
    { title: 'Digital Marketing Basics', description: 'Overview of digital marketing channels', duration: 18, order: 1, video_url: 'https://example.com/marketing-basics' },
    { title: 'Social Media Strategy', description: 'Build effective social media campaigns', duration: 16, order: 2, video_url: 'https://example.com/social-strategy' },
    { title: 'SEO Fundamentals', description: 'Optimize content for search engines', duration: 14, order: 3, video_url: 'https://example.com/seo-fundamentals' },
  ],
  'Business Strategy': [
    { title: 'Strategic Planning', description: 'Create effective business strategies', duration: 30, order: 1, video_url: 'https://example.com/strategy-planning' },
    { title: 'Market Analysis', description: 'Analyze markets and competition', duration: 28, order: 2, video_url: 'https://example.com/market-analysis' },
    { title: 'Business Models', description: 'Understand and design business models', duration: 32, order: 3, video_url: 'https://example.com/business-models' },
  ],
};

function seedCourses() {
  sampleCourses.forEach((course) => {
    db.run(
      `INSERT OR IGNORE INTO courses (
        title, category, level, rating, students, price, duration, lessons, description,
        tutor_name, tutor_email, tutor_bio, tutor_expertise, start_date, schedule, first_class_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course.title,
        course.category,
        course.level,
        course.rating,
        course.students,
        course.price,
        course.duration,
        course.lessons,
        course.description,
        course.tutor_name,
        course.tutor_email,
        course.tutor_bio,
        course.tutor_expertise,
        course.start_date,
        course.schedule,
        course.first_class_time,
      ],
      (err) => {
        if (err) {
          console.error('Error seeding course:', course.title, err);
        } else {
          console.log('Seeded course:', course.title);
        }
      }
    );
  });
}

function seedLessons() {
  sampleCourses.forEach((course) => {
    const lessons = sampleLessons[course.title] || [];
    
    db.get('SELECT id FROM courses WHERE title = ?', [course.title], (err, courseRow) => {
      if (err || !courseRow) return;
      
      lessons.forEach((lesson) => {
        db.run(
          `INSERT OR IGNORE INTO lessons (course_id, title, description, duration, order_index, content_type, video_url)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            courseRow.id,
            lesson.title,
            lesson.description,
            lesson.duration,
            lesson.order,
            'video',
            lesson.video_url,
          ],
          (err) => {
            if (err) {
              console.error('Error seeding lesson:', lesson.title, err);
            } else {
              console.log('Seeded lesson:', lesson.title, 'for course:', course.title);
            }
          }
        );
      });
    });
  });
}

module.exports = { seedCourses, seedLessons };
