const express = require('express');
const app = express();

//todo change env / env.local
require('dotenv').config({path:__dirname+'/./../.env.local'})

const path = require('path');
const { sendEmail } = require("./mailer")
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

//middleWarer for ReactRouter
//app.use(express.static(path.join(__dirname, 'build')));

//parsing request Data
// application/x-www-form-urlencoded
app.use(express.urlencoded())
// application/json
app.use(express.json())

//for ReactRouter
app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// send mail route
app.post('/send', (req, res) => {
    console.log(req.body)
    sendEmail(req.body.emailData, function(err, info) {
        if (err) {
            console.log('Error occurred. ' + err.message);
            res.json({ message: "Internal Error."})
        } else {
            res.json({
                message: 'Email sent.'
            })
        }
    });
})