
import React, { useContext, useState } from "react";
import AuthContext from "../../__appContexts/AuthContext";
import { Loader, Segment } from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import mailerAPI from "../../__services/_API/mailerAPI";
import { checkUserFormValidity, HandleUserPost} from "../../__services/_Entity/userServices";
import {CreateUserForm} from "../components/entityForms/UserForms";

const UserPage_Registration = ({ history }) => {
    const { isAuthenticated, setNeedConfirm } = useContext(AuthContext)

    if (isAuthenticated === true) {
        history.replace('/');
    }

    const { t } = useTranslation()

    const [user, setUser] = useState({
        picture: undefined,
        email: "",
        lastname: "",
        firstname: "",
        password: "",
        passwordConfirm: "",
    });

    const [errors, setErrors] = useState({});

    const [loader, setLoader] = useState(false)
    const [loaderMessage, setLoaderMessage] = useState("")

    const postTreatment = (newUser) => {
        setLoaderMessage(t('sending_confirm_email'))
        mailerAPI.sendConfirmMail(t, newUser)
            .then(() => {
                setNeedConfirm(true)
                history.replace('/login')
            })
            .catch(err => console.log(err))
    }

    const preSubmit = ( newUser ) => {
        if (checkUserFormValidity(newUser, setErrors)) {
            setLoaderMessage(t('create_your_account'))
            setLoader(true)

            HandleUserPost( newUser, postTreatment, setLoader, setErrors )
        }
    };

    return (
        <Segment basic className="card">
            <h1> {t('registration')} </h1>
            {loader &&
                 <Loader active>{loaderMessage}</Loader>
            }
            {!loader &&
                <CreateUserForm
                    user={user} setUser={setUser}
                    handleSubmit={preSubmit}
                    loader={loader}
                    errors={errors}
                />
            }
        </Segment>
    )
};

export default withTranslation()(UserPage_Registration);