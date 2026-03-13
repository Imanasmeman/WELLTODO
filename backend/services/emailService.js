import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendDailySummaryEmail = async (userEmail, userName, summary) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email service not configured. Skipping email for user:', userEmail);
      return;
    }

    const htmlContent = `
      <h2>Daily Task Summary - ${summary.date}</h2>
      <p>Hello ${userName},</p>
      <p>Here's your daily task summary:</p>
      <ul>
        <li><strong>Total Tasks:</strong> ${summary.totalTasks}</li>
        <li><strong>Completed Tasks:</strong> ${summary.completedTasks}</li>
        <li><strong>Pending Tasks:</strong> ${summary.pendingTasks}</li>
        <li><strong>Completion Percentage:</strong> ${summary.completionPercentage}%</li>
      </ul>
      <p><strong>Generated at:</strong> ${summary.generatedAt}</p>
      <p>Keep up the great work!</p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Daily Task Summary - ${summary.date}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Daily summary email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};
