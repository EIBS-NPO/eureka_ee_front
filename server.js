
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const app_mail = process.env.REACT_APP_MAIL;
const app_mail_pass = process.env.REACT_APP_MAIL_PASS;
const app_mail_host = process.env.REACT_APP_MAIL_HOST;
const nodemailer = require('nodemailer');
const path = require("path");

const transport = {
    host: app_mail_host, // e.g. smtp.gmail.com
    auth: {
        user: app_mail,
        pass: app_mail_pass
    }
};

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('All works fine, congratz!');
    }
});

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// create a GET route
app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

// send mail route
app.post('/send', (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const message = req.body.messageHtml
    const mailTo = req.body.to
    const subject = req.body.subject

    const mail = {
        from: name,
       // to: 'RECEIVING_EMAIL_ADDRESS_GOES_HERE',
        to: mailTo,
       // subject: 'Contact form request',
        subject: subject,

        html: message
    }

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                msg: 'fail'
            })
        } else {
            res.json({
                msg: 'success'
            })
        }
    })
})
