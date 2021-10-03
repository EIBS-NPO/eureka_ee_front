
import React, {useContext, useEffect, useState} from "react";
import {Form, Input, Loader, Message, Segment} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import authAPI from "../../../__services/_API/authAPI";
import userAPI from "../../../__services/_API/userAPI";
import AuthContext from "../../../__appContexts/AuthContext";

const ActivationPage = (props) => {
    const urlToken = props.match.params.token
    console.log(urlToken)
    if(authAPI.isAuthenticated() || urlToken === ""){
        console.log("retour home")
        props.history.replace('/');
    }
    const {setNeedConfirm} = useContext(AuthContext)

    const [loader,setLoader] = useState(true)
    const [error, setError] = useState(undefined)

    useEffect(async ()=>{

            let response = await userAPI.activation(urlToken)
                .then(response => console.log(response))
                .catch(error => {
                //    setSuccess(false)
                    console.log(error)
                    setLoader(false)
                    setError(error.data)
                })
            if(response && response.status === 200){
             //   setSuccess(true)
                setNeedConfirm(false)
                props.history.replace('/login')
            }
    },[])

    return (
        <div className="card">
            {!loader &&
                <Message warning>
                    <p>une erreur est survenue, veuillez contacter l'administeur.</p>
                </Message>
            }
            <Loader active>{props.t('activation_of_your_account')}</Loader>
        </div>

    )
}

export default withTranslation()(ActivationPage);