require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'noreply@learnup.com',
    pass: process.env.EMAIL_PASS || 'demo-password',
  },
});

const sendEnrollmentEmail = async (userEmail, userName, course, tutor) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'LearnUp <noreply@learnup.com>',
    to: userEmail,
    subject: `Welcome to ${course.title} on LearnUp!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 20px; border-radius: 8px; color: white; text-align: center;">
          <h2 style="margin: 0;">Welcome to LearnUp!</h2>
        </div>
        
        <div style="padding: 20px; background: #f8fafc;">
          <p>Hi <strong>${userName}</strong>,</p>
          
          <p>Congratulations on enrolling in <strong>${course.title}</strong>! We're excited to have you on this learning journey.</p>
          
          <div style="background: white; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5;">
            <h3 style="margin-top: 0; color: #4f46e5;">Course Details</h3>
            <p><strong>Course:</strong> ${course.title}</p>
            <p><strong>Duration:</strong> ${course.duration}</p>
            <p><strong>Total Lessons:</strong> ${course.lessons}</p>
            <p><strong>Level:</strong> ${course.level}</p>
            <p><strong>Price:</strong> $${course.price}</p>
          </div>
          
          <div style="background: white; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
            <h3 style="margin-top: 0; color: #8b5cf6;">Your Instructor</h3>
            <p><strong>${tutor.name}</strong></p>
            <p>${tutor.bio}</p>
            <p><strong>Expertise:</strong> ${tutor.expertise}</p>
            <p><strong>Email:</strong> <a href="mailto:${tutor.email}" style="color: #4f46e5;">${tutor.email}</a></p>
          </div>
          
          <div style="background: white; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ec4899;">
            <h3 style="margin-top: 0; color: #ec4899;">Course Timeline</h3>
            <p><strong>Start Date:</strong> ${course.startDate}</p>
            <p><strong>Schedule:</strong> ${course.schedule}</p>
            <p><strong>First Class:</strong> ${course.firstClassTime}</p>
          </div>
          
          <div style="background: #eef2ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #4f46e5;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Log in to your LearnUp account</li>
              <li>Navigate to 'My Learning' to access the course</li>
              <li>Download course materials</li>
              <li>Join the student community forum</li>
            </ul>
          </div>
          
          <p>If you have any questions, feel free to reach out to your instructor or our support team.</p>
          
          <p style="color: #64748b; font-size: 12px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            Best regards,<br/>
            The LearnUp Team
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Enrollment email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendEnrollmentEmail };
