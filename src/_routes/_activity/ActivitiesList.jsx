import React, { useEffect, useState, useContext } from 'react';
import { Loader, Segment } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next';
import activityAPI from "../../_services/activityAPI";
import activity from "../../_components/cards/activity";
import AuthContext from "../../_contexts/AuthContext";
import Activity from "../../_components/cards/activity";

const ActivitiesList = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    const urlParams = props.match.params.ctx

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

    const [activities, setActivities] = useState()

    const [loader, setLoader] = useState();

    useEffect(() => {
        setLoader(true)
        console.log(ctx())
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

            {!loader &&
            <>
                {activities && activities.length > 0 &&
                activities.map((p, key) => (
                    <Segment key={key}>
                        <Activity activity={p} context={ctx()} />
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

