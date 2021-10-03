const express = require('express');
const app = express();
const env = require('dotenv').config()

const nodemailer = require('nodemailer');
const path = require('path');
const port = process.env.PORT || 5000;

const app_mail = process.env.REACT_APP_MAIL;
const app_mail_pass = process.env.REACT_APP_MAIL_PASS;
const app_mail_host = process.env.REACT_APP_MAIL_HOST;
const app_mail_port = process.env.REACT_APP_MAIL_PORT;
const app_local_url = process.env.REACT_APP_URL_LOCAL;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

//middleWarer
app.use(express.static(path.join(__dirname, 'build')));
// parse application/x-www-form-urlencoded
app.use(express.urlencoded())
// parse application/json
app.use(express.json())

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//mailtrap: smtp://smtp.mailtrap.io:2525
// send mail route
app.post('/send', (req, res) => {
  //  const name = req.body.name
  //  const email = req.body.email
  //  const message = req.body.messageHtml
 //   const mailTo = req.body.mailTo
 //   const token = req.body.token
  //  const subject = req.body.subject
//console.log(mailTo)
   // console.log(token)
       async function main() {
           console.log(app_mail_host)
           console.log(app_mail_port)
           console.log(app_mail)
           console.log(app_mail_pass)
           console.log(req.body)

           const transport = nodemailer.createTransport({
               host: app_mail_host,
               port: app_mail_port,
               auth: {
                   user: app_mail,
                   pass: app_mail_pass
               }
           });

               // Message object
               let message = {
                   from: 'Sender Name <sender@example.com>',
                   to:  req.body.mailTo,
                   subject: 'Nodemailer is unicode friendly ✔',
                   text: 'Hello to myself!',
                   html: '<p><b>Hello</b> to myself!</p>' +
                       '<p>' + app_local_url + '/activation?token=' + req.body.token + '</p>' +
                       ' <a href=' + app_local_url + '/activation/' + req.body.token + '>clic here to activate your account</a>'
               };

               await transport.sendMail(message, (err, info) => {
                   if (err) {
                       console.log('Error occurred. ' + err.message);
                       return process.exit(1);
                   } else {
                       res.json({
                           msg: 'success'
                       })
                   }

                   console.log('Message sent: %s', info.messageId);
               });
       //    });

       }
       main().catch(console.error);

   /* const name = req.body.name
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
    })*/
})

/*
app.get('/sendMail', (req, res ) => {

})*/
