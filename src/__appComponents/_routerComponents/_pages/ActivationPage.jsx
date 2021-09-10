
import React, {useContext, useEffect, useState} from "react";
import {Form, Input, Loader, Message, Segment} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import authAPI from "../../../__services/_API/authAPI";
import userAPI from "../../../__services/_API/userAPI";
import AuthContext from "../../../__appContexts/AuthContext";

//todo comme la page vient d'un link ecterne, il y a rafraichissement de toute la fenetre.
// une solu bricolage serait de faire un compteur de requete pour ne laisser partir que la premiere?
// ou trouver un moyen de ne pas tout rafraichir pour ce lien....


const ActivationPage = (props) => {
    const urlToken = props.match.params.token
    if(authAPI.isAuthenticated() || urlToken === ""){
        console.log("retour home")
        props.history.replace('/');
    }
    const {setNeedConfirm} = useContext(AuthContext)

    const [loader,setLoader] = useState(true)
    const [error, setError] = useState(undefined)

    // todo ok, on peut supprimer  kes callAjax démultiplié
    //  en sortant le call ajax si dessous du composant qui est lui meme démultiplié, ref=>footer
    //  il s'agit de contextualisé, la ou ca coince c'est que j'ai besoin de urlParams, et un peu partout
    //  donc possible qu'il faille les contextualisé aussi ... sortir les callAjax?
    //  maybe faire un compo qui gère les url, pour dispatcher les calll et context ?
    //  une sorte de dispatcher, qui gère les call ajax en amont des Media
    //  et les composant qui recoit des context. (faire des context pour chaque type de composant
    //  et donc un composant callAPP qui gère les contexts pour finalememt englober le maincontent
    //  (qui gère en premier les media)
    useEffect(async ()=>{

            let response = await userAPI.activation(urlToken)
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