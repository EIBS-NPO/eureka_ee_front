import React, { useEffect, useState, useContext } from 'react';
import { Loader, Segment } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next';
import activityAPI from "../../_services/activityAPI";
import activity from "../../_components/cards/activity";
import AuthContext from "../../_contexts/AuthContext";
import Card from "../../_components/Card";
import authAPI from "../../_services/authAPI";

const ActivitiesList = ( props ) => {
    const urlParams = props.match.params.ctx

    const checkCtx = () => {
        if (urlParams !=="public" && !authAPI.isAuthenticated()) {
            //if ctx need auth && have no Auth, public context is forced
            authAPI.logout()
        }else {return urlParams}
    }

    const [activities, setActivities] = useState({})

    const [loader, setLoader] = useState();

    const [ctx, setCtx] = useState("public")
    useEffect(() => {
        setLoader(true)
        setCtx( checkCtx() )
        let ctx = checkCtx()
        console.log(ctx)

        if(ctx === 'follower'){
            console.log("get_follower")
            activityAPI.getFavorites(ctx)
                .then(response => {
                    console.log(response)
                    setActivities(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
        else if (ctx !== 'public') {
            console.log("get_non_public creator ou my ?")
            activityAPI.get(ctx)
                .then(response => {
                    console.log(response)
                    setActivities(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        } else {console.log("public")
            activityAPI.getPublic()
                .then(response => {
                    console.log(response)
                    setActivities(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
    }, [urlParams]);

    const Title = () => {
        let title = ""
        switch(ctx){
            case "creator":
                title = <h1>{ props.t('my_activities') }</h1>
                break;
            case "follower":
                title = <h1>{ props.t('my_favorites') }</h1>
                break;
            default:
                title = <h1>{ props.t('public_activities') }</h1>
        }
        return title;
    }

    return (
        <div className="card">
            <Title />

            {!loader && activities && activities.length > 0 &&
                activities.map( activity => (
                    <Segment key={activity.id} raised>
                        <Card history={props.history} key={activity.id} obj={activity} type="activity" isLink={true} />
                    </Segment>
                ))
            }

            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{props.t('loading') +" : " + props.t('activity') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }
        </div>
    );
}

export default withTranslation()(ActivitiesList);

