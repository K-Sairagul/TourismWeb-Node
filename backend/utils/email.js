const nodemailer = require('nodemailer');
const pug = require('pug');
const {convert} = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `ragul <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // In production, use a real email service like SendGrid
            return 1;
        }

        // Development email transport using Mailtrap
        return nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "68194e5c69b8f2",
                pass: "94e9e22ca26f69"
            }
        });
    }

    async send(template, subject) {
        // 1) Render HTML based on the pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, { // Corrected comma
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html) // Converts HTML to plain text
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() { // Marked async
        await this.send('welcome', 'Welcome to Sai family!');
    }

    async sendPasswordReset(){
        await this.send('passwordReset','Your password reset token(valid for only 10 mins)')
    }

};
