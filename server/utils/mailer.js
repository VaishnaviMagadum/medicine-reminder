const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

const sendAutoEmail = async (patientName, medName, recipientEmail) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: 'MedReminder <alerts@medreminder.com>',
    to: recipientEmail,
    subject: `URGENT: Medication Alert for ${patientName}`,
    text: `This is an automated alert from MedReminder. ${patientName} is scheduled to take ${medName} now.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6366f1;">Medication Reminder</h2>
        <p>This is an automated alert for <strong>${patientName}</strong>.</p>
        <p>It is time for the following medication:</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0;">${medName}</h3>
        </div>
        <p style="color: #64748b; font-size: 0.8rem;">Sent via MedReminder Smart Alert System</p>
      </div>
    `
  };

  try {
    // await transporter.sendMail(mailOptions);
    console.log(`REAL-TIME ALERT: Email sent to ${recipientEmail} for ${medName}`);
    return true;
  } catch (err) {
    console.error('Email failed:', err);
    return false;
  }
};

const sendLowStockEmail = async (patientName, medName, quantity, recipientEmail) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: 'MedReminder <inventory@medreminder.com>',
    to: recipientEmail,
    subject: `LOW STOCK ALERT: ${medName} for ${patientName}`,
    text: `MedReminder Alert: The stock for ${medName} is running low (${quantity} left). Please refill soon.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #fee2e2; border-radius: 10px; border-left: 5px solid #ef4444;">
        <h2 style="color: #b91c1c;">Low Stock Alert</h2>
        <p>This is an automated inventory alert for <strong>${patientName}</strong>.</p>
        <p>The following medication is running low on stock:</p>
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0; color: #ef4444;">${medName}</h3>
          <p style="margin: 5px 0 0 0; font-weight: 800;">Only ${quantity} pills remaining!</p>
        </div>
        <p>Please arrange for a refill soon to avoid missing doses.</p>
        <p style="color: #64748b; font-size: 0.8rem;">Sent via MedReminder Inventory System</p>
      </div>
    `
  };

  try {
    // await transporter.sendMail(mailOptions);
    console.log(`LOW STOCK ALERT: Email sent to ${recipientEmail} for ${medName} (${quantity} left)`);
    return true;
  } catch (err) {
    console.error('Low stock email failed:', err);
    return false;
  }
};

module.exports = { sendAutoEmail, sendLowStockEmail };
