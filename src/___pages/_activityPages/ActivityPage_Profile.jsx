
import React, { useEffect, useState, useContext } from 'react';
import {Container, Message} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import AuthContext from "../../__appContexts/AuthContext";
import {ContentContainer} from "../components/Loader";
import { HandleGetActivities } from "../../__services/_Entity/activityServices";
import {DisplayActivity} from "../components/entityViews/ManageActivity";
import {ActivityHeader} from "../components/entityViews/ActivityViews";

const ActivityPage_Profile = ( props ) => {

    const {t} = useTranslation()
    const urlParams = props.match.params.id.split('_')
    const [ctx, setCtx] = useState("")
    const {email, isAuthenticated} = useContext(AuthContext);

    const checkCtx = () => {
        if(urlParams[0] === 'public' || urlParams[0] === 'owned' || urlParams[0] === 'followed' || urlParams[0] === 'private') {
            if (urlParams[0] !== "public" && !isAuthenticated) {
                //if ctx need auth && have no Auth, public context is forced
                props.history.replace('/login')
            } else return urlParams[0]
        }else return '';
    }

    const [activity, setActivity] = useState(undefined)
    const [error, setError] = useState("")

    const [isOwner, setIsOwner] = useState(undefined)

    const [loader, setLoader] = useState(false);

    const postTreatment = async ( activityResult ) => {
        let owner = activityResult[0] && activityResult[0].creator && email === activityResult[0].creator.email
        setIsOwner(owner)
        setActivity(activityResult[0])
    }

    useEffect(() => {
        async function fetchData () {
            let ctx = checkCtx()
            setCtx(ctx)

            //load the activity
            await HandleGetActivities(
                {access: ctx, activity:{id:urlParams[1]}},
                postTreatment,
                setLoader,
                setError,
                false,
                props.history
            )
        }
        fetchData()
        //dismiss unmounted warning
        return () => {
            setActivity({});
        };
    }, []);

    return (

        <ContentContainer
            loaderActive={loader}
            loaderMsg={ props.t('loading') +" : " + props.t('activity') }
        >

            {!loader &&
            <>
                {activity ?
                    <>
                        <ActivityHeader t={ t } activity={activity} setActivity={setActivity} />
                        <DisplayActivity
                            t={t}
                            ctx={ctx}
                            isOwner={isOwner}
                            activity={activity}
                            setActivity={setActivity}
                            loader={loader}
                            history={props.history}
                        />
                    </>
                    :
                    <Container textAlign='center'>
                        <Message size='mini' info>
                            {props.t("no_result")}
                        </Message>
                    </Container>
                }
            </>
            }
        </ContentContainer>
    );
};

export default withTranslation()(ActivityPage_Profile);