
import React, {useContext, useEffect, useState} from "react";
import {Loader, Message} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import userAPI from "../__services/_API/userAPI";
import AuthContext from "../__appContexts/AuthContext";

const ActivationPage = (props) => {
    const isAuthenticated = useContext(AuthContext).isAuthenticated;
    const urlParams = props.match.params.token.split(':')
    const userId = urlParams[0]
    const urlToken = urlParams[1]

    if(isAuthenticated || urlToken === undefined){
//        console.log("retour home")
        props.history.replace('/');
    }
    const {setNeedConfirm} = useContext(AuthContext)

    const [loader,setLoader] = useState(true)
    const [error, setError] = useState(undefined)

    //todo elert for async look console
    //todo alert for dependency useEffect
   // console.log(error)
    useEffect(async ()=>{
        setLoader(true)
       // await userAPI.get("id", null, userId)
        await userAPI.get("search", {id:userId})
            .then(async user => {
                if (user.data[0].gpAttributes["user.token.activation"].propertyValue[0] === urlToken) {
                    await userAPI.activation(urlToken)
                        .then(response => {
                      //      console.log(response)
                            setNeedConfirm(false)
                            setLoader(false)
                            setTimeout(() => {
                                props.history.replace('/login')
                            }, 3000);
                        })
                        .catch(err => {
                            //    setSuccess(false)
                       //     console.log(err)
                            setError(err)
                            setLoader(false)
                        })
                }
            })
            .catch(err => {
                //    setSuccess(false)
           //     console.log(err)
                setError(err)
                setLoader(false)
            })
    },[])

    return (
        <div className="card">
            {!loader && error !== undefined &&
                <Message warning>
                    <p>{props.t("error_encounter")}</p>
                </Message>
            }
            {!loader && error === undefined &&
                <Message success>
                    <p>{props.t("success_activation")}</p>
                </Message>
            }

            {loader &&
                <Loader active>{props.t('activation_of_your_account')}</Loader>
            }
        </div>

    )
}

export default withTranslation()(ActivationPage);