import Axios from "axios";

const sendForgotPassordMail = (translator, user) => {
    let token = user.gpAttributes["user.token.resetPassword"].propertyValue[0]
    let password = user.gpAttributes["user.token.resetPassword"].propertyValue[1]
    return Axios.post("/send",{emailData : {
            email :user.email,
            subject: translator("forgot_password"),
            text: translator("forgot_password_message"),
            template : "email_resetPassword",
            context : {
                title : translator("forgot_password"),
                text : translator("forgot_password_message"),
                name : user.lastname + " " + user.firstname,
                link : {
                    href:  process.env.REACT_APP_URL_LOCAL + '/forgot_password/' + user.id + ":" + token,
                    text: translator("change_password")
                },
                resetCode: translator("reset_code") +" : "+ password,
                ignored : translator("email_may_be_ignored"),
                footer : translator("email_footer"),
            }
        }})
}

const sendConfirmMail = (translator, user) => {
    let token = user.gpAttributes["user.token.activation"].propertyValue[0]
   return Axios.post("/send",{emailData : {
            email : user.email,
            subject: translator("confirm_your_registration"),
            text: translator("confirm_registration_message"),
            template : "email_confirmLink",
            context : {
                title : translator("confirm_your_registration"),
                text : translator("confirm_registration_message"),
                name : user.lastname + " " + user.firstname,
                link : {
                    href:  process.env.REACT_APP_URL_LOCAL + '/activation/' + user.id + ":"+ token,
                    text: translator("confirm_your_registration")
                },
                footer : translator("email_footer"),
            }
        }})
}

export  default {
    sendForgotPassordMail,
    sendConfirmMail
}