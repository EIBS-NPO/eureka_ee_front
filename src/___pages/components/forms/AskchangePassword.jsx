
import {Button, Form, Message, Segment} from "semantic-ui-react";
import userAPI from "../../../__services/_API/userAPI";
import mailerAPI from "../../../__services/_API/mailerAPI";
import {useContext, useState} from "react";
import {useTranslation, withTranslation} from "react-i18next";
import {handleChange} from "./formsServices";
import AuthContext from "../../../__appContexts/AuthContext";


const AskChangePasswordForm = ({cancelForm}) => {

    const { t } = useTranslation()

    const potentialEmail = useContext(AuthContext).email
    const [ credentials, setCredentials ] = useState({
        email: potentialEmail ? potentialEmail : ""
    })
    const [loader, setLoader] = useState(false)
    const [ error, setError] = useState("")
    const [isSent, setIsSent] = useState(false)

    const handleSendForgotPassMail = () => {
        setIsSent(false)
        if(credentials.email !== ""){
            setLoader(true)
            userAPI.askForgotPasswordToken(credentials.email)
                .then(user => {
                    setError("")
                    mailerAPI.sendForgotPasswordMail(t, user.data[0])
                        .then(res => {
                            setIsSent(true)
                            setCredentials({...credentials, email:""})
                        })
                        .catch(err => {
                            setError(t('error_encounter'))
                        })
                        .finally(()=>setLoader(false))
                })
                .catch(err => {
                    setLoader(false)
                    if(err.response.status === 400){
                        setIsSent(false)
                        setError( t('email') + " " + t('unknown') )
                    }
                })
        }
    }

    return (
        <Form onSubmit={handleSendForgotPassMail} loading={loader}>
            <Form.Input
                icon='user'
                iconPosition='left'
                name="email"
                type="email"
                value={credentials.email}
                label={t('email')}
                placeholder='Email'
                onChange={(e) => handleChange(e, credentials, setCredentials)}
                required
            />

            {!isSent && <Button className="ui primary basic button" content={t('send_me_mail')} /> }

            <Button className="ui secondary basic button" onClick={(e)=>cancelForm(e)}
                    content={ !isSent ? t('cancel') : t('finish') }
            />

            {!loader && error &&
                <Segment basic >
                    <Message negative compact>
                        <Message.Header content={t('Error')} />
                        <Message.Content>
                            <p>{error}</p>
                        </Message.Content>
                    </Message>
                </Segment>
            }

            {!loader && isSent &&
                <Segment basic >
                    <Message positive compact>
                        <Message.Content>
                            <p>{ t('mail_send_to_you') }</p>
                        </Message.Content>
                    </Message>
                </Segment>
            }

        </Form>
    )
}

export default withTranslation()(AskChangePasswordForm)