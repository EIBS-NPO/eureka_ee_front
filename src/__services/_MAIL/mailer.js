import Axios from "axios";
import { LOCAL_URL } from "../../config";
import InlineLink from "./MailsTemplate/ComfirmUser"
import {request} from "express";

/*
const name = req.body.name
    const email = req.body.email
    const message = req.body.messageHtml
    const mailTo = req.body.to
    const subject = req.body.subject
 */
const postMail = async (user) => {
    let dataMail = {
        name:"testname",
        mailto:user.email,
        subject:"Confirmer votre inscription",
        messageHtml: InlineLink
    }

    /*callBackendAPI = async () => {
        const response = await fetch('/express_backend');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };*/
    //Axios.
/*   const req= request;
   req.body.name = "testname"
    req.body.mailto = user.mail
    req.body.subject = "confirmer votre inscription"
    req.body.messageHtml = InlineLink
    const r = requestInit*/
   //  const response = fetch("/send", dataMail)
    return Axios.post("http://localhost:5000/send", dataMail)
}

export default {
    postMail
}