import React, { useEffect, useState, useContext } from 'react';
import utilities from "../../_services/utilities";
import { withTranslation } from 'react-i18next';
import AuthAPI from "../../_services/authAPI";
import orgAPI from "../../_services/orgAPI";
import fileAPI from "../../_services/fileAPI";
import Organization from "../../_components/cards/organization";
import {Divider, Icon, Image, Item, Label, Loader, Segment} from "semantic-ui-react";
import AuthContext from "../../_contexts/AuthContext";
import {NavLink} from "react-router-dom";
import Card from "../../_components/Card";

const OrgList = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;
    //const [ctx, setCtx] = useState(props.match.params.ctx)

    const urlParams = props.match.params.ctx

    const [owners, setOwners] = useState([])

    const ctx = () => {
        if (urlParams ==="my" && isAuth) {
            //if ctx need auth && have no Auth, public context is forced
            return 'my';
        }
        else {
            // console.log(urlParams)
            return 'public'
        }
    }

    const [orgs, setOrgs] = useState([])

    const [loader, setLoader] = useState();

    //todo charger les referent dans un tableau a part pour limiter les requetes doublons
    //donc les object seriliser org du back ne doivent reoutourner que l'id des ref
    useEffect(() => {
        setLoader(true)
        if(ctx() === 'my'){
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

    /*useEffect(() => {
        orgs.forEach(org => {
            if(owners.find( o => o.id === org.referent.id) === undefined){
                setOwners({...owners, org.referent})
            }
        })
    },[orgs])*/

    return (
        <div className="card">
            { ctx() === 'my' && <h1>{ props.t('my_org') }</h1> }
            { ctx() !== 'my' && <h1>{ props.t('all_org') }</h1> }
            {!loader &&
                <>
                    {orgs && orgs.length > 0 &&
                        orgs.map(org => (
                            <Segment raised>
                                <Card key={org.id} obj={org} type="org" isLink={true} />
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

