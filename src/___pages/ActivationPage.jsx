
import React, {useContext, useState} from "react";
import {withTranslation} from "react-i18next";
import AuthContext from "../__appContexts/AuthContext";
import {DisplayConfirmAccountProcess} from "./components/entityForms/UserForms";

const ActivationPage = (props) => {
    const isAuthenticated = useContext(AuthContext).isAuthenticated;
    const urlToken = props.match.params.token.split(':')[1]
    if(isAuthenticated || urlToken === undefined){
        props.history.replace('/');
    }
    const {setNeedConfirm} = useContext(AuthContext)

    const [loader,setLoader] = useState(true)
    const [error, setError] = useState(undefined)

    const postTreatment = () => {
        setNeedConfirm(false)
        setLoader(false)
        setTimeout(() => {
            props.history.replace('/login')
        }, 3000);
    }

    return (
        <div className="card">
            <DisplayConfirmAccountProcess
                tokenActivation={urlToken}
                postTreatment={postTreatment}
                t={ props.t }
                loader={loader} setLoader={setLoader}
                error={error} setError={setError}

            />
        </div>

    )
}

export default withTranslation()(ActivationPage);