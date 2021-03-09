import React, { useEffect, useState, useContext } from 'react';
import { withTranslation } from 'react-i18next';
import orgAPI from "../../_services/orgAPI";
import { Loader, Segment} from "semantic-ui-react";
import AuthContext from "../../_contexts/AuthContext";
import Card from "../../_components/Card";
import authAPI from "../../_services/authAPI";

const OrgList = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    const urlParams = props.match.params.ctx

    //forbiden if route for my org wwith no auth
    const checkCtx = () => {
        if (urlParams !=="public" && !authAPI.isAuthenticated()) {
            //if ctx need auth && have no Auth, public context is forced
            authAPI.logout()
        }else {return urlParams}
    }

    const [ctx, setCtx] = useState("")

    const [orgs, setOrgs] = useState([])

    const [loader, setLoader] = useState();

    //todo charger les referent dans un tableau a part pour limiter les requetes doublons
    //donc les object seriliser org du back ne doivent reoutourner que l'id des ref
    useEffect(() => {
        setLoader(true)
        //todo inversion des call
        setCtx( checkCtx() )
        if(urlParams === 'my'){
            orgAPI.getMy()
                .then(response => {
                    console.log(response)
                    setOrgs(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }else {
            orgAPI.get()
                .then(response => {
                    console.log(response)
                    setOrgs(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
    }, [urlParams]);

    return (
        <div className="card">
            { ctx === 'my' && <h1>{ props.t('my_org') }</h1> }
            { ctx !== 'my' && <h1>{ props.t('all_org') }</h1> }
            {!loader &&
                <>
                    {orgs && orgs.length > 0 &&
                        orgs.map(org => (
                            <Segment key={org.id} raised>
                                <Card history={props.history} key={org.id} obj={org} type="org" isLink={true} ctx={ctx}/>
                            </Segment>
                        ))
                    }
                </>
            }
            {loader &&
                <Segment>
                    <Loader
                        active
                        content={
                            <p>{props.t('loading') +" : " + props.t('organization') }</p>
                        }
                        inline="centered"
                    />
                </Segment>
            }

        </div>
    );
};

export default withTranslation()(OrgList);

