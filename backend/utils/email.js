const nodemailer= require('nodemailer');

const sendEmail = async options => {
    try {
        const transporter = nodemailer.createTransport({
            host:"sandbox.smtp.mailtrap.io",
            port: 2525, 
           
            
            auth: {
                user: "68194e5c69b8f2",
                pass: "94e9e22ca26f69"
            }
        });

        const mailOptions = {
            from: "ragul <ragul@gmail.com>",
            to: options.email,
            subject: options.subject,
            text: options.message
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (err) {
        // Log the detailed error information here
        console.error('Error details:', err);

        // Optionally, rethrow or handle the error as needed
        throw new Error('There was an error sending the email');
    }
};

module.exports = sendEmail;


module.exports=sendEmail