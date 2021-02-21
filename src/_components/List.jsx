
import React, {useContext, useEffect, useState} from 'react';
import Card from "./Card";
import {Loader, Segment} from "semantic-ui-react";
import AuthContext from "../_contexts/AuthContext";
import orgAPI from "../_services/orgAPI";
import projectAPI from "../_services/projectAPI";

const List = ( props ) => {

    const [loader, setLoader] = useState()

    const isAuth = useContext(AuthContext).isAuthenticated;
    //const [ctx, setCtx] = useState(props.match.params.ctx)

    const urlParams = props.match.params.ctx

    const [owners, setOwners] = useState([])

    /*const ctx = () => {
        if (urlParams ==="my" && isAuth) {
            //if ctx need auth && have no Auth, public context is forced
            return 'my';
        }
        else {
            // console.log(urlParams)
            return 'public'
        }
    }*/
    const ctx = () => {
        if (urlParams !=="public" && isAuth === false) {
            //if ctx need auth && have no Auth, public context is forced
            console.log('public')
            return 'public';
        }
        else {
            console.log(urlParams)
            return urlParams
        }
    }


    const [objs, setObjs] = useState([])

    //todo charger les referent dans un tableau a part pour limiter les requetes doublons
    //donc les object seriliser org du back ne doivent reoutourner que l'id des ref
    useEffect(() => {
        setLoader(true)
        if (ctx() !== 'public') {
            projectAPI.get(ctx())
                .then(response => {
                    console.log(response)
                    setObjs(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        } else {
            projectAPI.getPublic()
                .then(response => {
                    console.log(response)
                    setObjs(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
    }, [urlParams]);

    return (
        <div className="card">
            { ctx() === 'my' && <h1>{ props.t('my_org') }</h1> }
            { ctx() !== 'my' && <h1>{ props.t('all_org') }</h1> }
            {!loader &&
            <>
                {orgs && orgs.length > 0 &&
                orgs.map(org => (
                    <Card key={org.id} obj={org} type="org" isLink={true} />

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
    )
}

export default List()