
const nodemailer = require('nodemailer'),
    hbs = require('nodemailer-express-handlebars')
    transporter = nodemailer.createTransport({
        host: process.env.APP_MAIL_HOST,
        port: process.env.APP_MAIL_PORT,
        auth: {
            user: process.env.APP_MAIL,
            pass: process.env.APP_MAIL_PASS
        }
    })

const sendEmail = (emailData, cb) => {

    const mailOptions = {
        from: 'EUREKA_EMPOWERMENT_ENVIRONMENT@mail.fake', //todo replace by process.env.REACT_APP_MAIL,
        to : emailData.email,
        subject : emailData.subject,
        text : emailData.text,
        attachments:[
            {filename : "EEE_banner.png", path: "../src/_resources/logos/EEE-banner1280-378-max.png", cid:"EEE_image"}
        ],
        template: emailData.template,
        context: emailData.context
    };

    transporter.use('compile', hbs({
        viewEngine: 'express-handlebars',
        viewPath: './views/'
    }))

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
            cb(err, null);
        } else {
            console.log(info)
            cb(null, info)
        }
    })
}

module.exports = { sendEmail }
