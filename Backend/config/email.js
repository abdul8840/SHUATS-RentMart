import SibApiV3Sdk from '@sendinblue/client';

const createBrevoClient = () => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  return apiInstance;
};

export const sendEmail = async (options) => {
  try {
    const apiInstance = createBrevoClient();

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.sender = {
      name: process.env.BREVO_FROM_NAME || 'SHUATS RentMart',
      email: process.env.BREVO_FROM_EMAIL
    };
    
    sendSmtpEmail.to = [{ email: options.to }];
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.html;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Brevo email send error:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.text);
    }
    throw error;
  }
};

export default sendEmail;