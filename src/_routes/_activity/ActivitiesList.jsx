import React, { useEffect, useState, useContext } from 'react';
import { Loader, Segment } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next';
import activityAPI from "../../_services/activityAPI";
import activity from "../../_components/cards/activity";
import AuthContext from "../../_contexts/AuthContext";
import Card from "../../_components/Card";
import authAPI from "../../_services/authAPI";

const ActivitiesList = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    const urlParams = props.match.params.ctx
    //if anonymous user is on no anonymous context
    if ( urlParams[0] !=="public" ) {
        authAPI.setup();
    }

    const ctx = () => {
        if (urlParams !=="public" && isAuth === false) {
            //if ctx need auth && have no Auth, public context is forced
            return 'public';
        }else {return urlParams}
    }

    const [activities, setActivities] = useState({})

    const [loader, setLoader] = useState();

    useEffect(() => {
        setLoader(true)
        if (ctx() !== 'public') {
            activityAPI.get(ctx())
                .then(response => {
                    console.log(response)
                    setActivities(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        } else {
            activityAPI.getPublic()
                .then(response => {
                    console.log(response)
                    setActivities(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
    }, [urlParams]);

    return (
        <div className="card">
            {ctx() === "creator" ?
                <h1>{ props.t('my_activities') }</h1>
                :
                <h1>{ props.t('public_activities') }</h1>
            }

            {!loader && activities && activities.length > 0 &&
                activities.map( activity => (
                    <Segment key={activity.id} raised>
                        <Card key={activity.id} obj={activity} type="activity" isLink={true} />
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

