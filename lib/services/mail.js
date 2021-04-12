'use strict';

const {Service} = require('@hapipal/schmervice');
const mailer = require('nodemailer');

module.exports = class MailService extends Service {

    async generateTransporter() {
        // generated ethereal testing account
        const testAccount = await mailer.createTestAccount();

        return mailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }

    async sendMail(to, subject, text, html) {
        const transporter = await this.generateTransporter();
        const from = 'noreply@node.com';
        const mail = await transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html,
        });

        console.log('Message sent: %s', mail.messageId);
        console.log('Preview URL: %s', mailer.getTestMessageUrl(mail));
    }

    async createMailingList(mails) {
        return mails.map((mail) => mail.mail).join(', ');
    }

    async userAddTemplateMail(user) {
        const to = user.mail;
        const subject = 'Confirmation de création d\'un compte';
        const text = 'Félicitation ' + user.firstName + ' !\r\n Merci d\'avoir créé un compte sur notre site \r\n Vous pouvez désormais parcourir notre bibliothèque de films !';
        const html = '<p>Félicitation <b>' + user.firstName + '</b> !</p> Merci d\'avoir crée un compte sur notre site <p>Vous pouvez désormais parcourir notre bibliothèque de films !</p>';

        await this.sendMail(to, subject, text, html);
    }


    async movieAddTemplateMail(film, mails) {
        const to = await this.createMailingList(mails);
        const subject = 'Un nouveau film a été publié ';
        const text = 'Venez découvrir le nouveau film ' + film.title;
        const html = '<p>Venez découvrir le nouveau film <b>' + film.title + '</b></p>';

        await this.sendMail(to, subject, text, html);
    }


    async mailFilmUpdate(film, mails) {
        const to = await this.createMailingList(mails);
        const subject = 'Un film que vous avez en favori a été mis à jour';
        const text = 'Venez découvrir les nouveautés sur le film ' + film.title + ' !';
        const html = '<p>Venez découvrir les nouveautés sur le film <b>' + film.title + '</b> !';

        await this.sendMail(to, subject, text, html);
    }
};
