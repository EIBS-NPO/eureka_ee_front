import React, {useContext, useEffect, useState} from 'react';
import {Container, Header, Input, Menu, Message, Segment} from 'semantic-ui-react'
import { withTranslation } from 'react-i18next';
import Card from "../components/Card";
import {HandleGetActivities} from "../../__services/_Entity/activityServices";
import {ContentContainer} from "../components/Loader";
import AuthContext from "../../__appContexts/AuthContext";
import SearchInput from "../components/menus/components/ListFilter";

const ActivityPage_List = (props ) => {
    const urlParams = props.match.params.ctx

    const email  = useContext(AuthContext).email

    const [ctx, setCtx] = useState("public")
    const checkCtx = async () => {
        if(urlParams === 'public' || urlParams === 'owned' || urlParams === 'followed'){
                return urlParams
        }
        else return "public";
    }

    const [activities, setActivities] = useState([])

    const [loader, setLoader] = useState(false);

    //todo error
    const [errors, setErrors] = useState("")


    useEffect(() => {

        async function fetchData(){
            setLoader(true)
            checkCtx()
                .then(async (ctx) => {
                    console.log(ctx)
                    setCtx(ctx)
                    if (ctx !== '') { //if valid ctx
                        //public or private access
                        let ctxAccess
                        let activityParams = {}
                        switch(ctx){
                            case "owned":
                                ctxAccess = "search"
                                activityParams = {creator:{email:email} }
                                break
                            case "followed":
                                ctxAccess = "followed"
                                break
                            default: ctxAccess = "public"
                        }
                            await HandleGetActivities(
                                {access: ctxAccess, activity: activityParams},
                                setActivities,
                                setLoader,
                                setErrors,
                                props.history
                            )
                     //   }
                    }
                })
        }

        fetchData()

        //dismiss unmounted warning
        return () => {
            setActivities([]);
        };
    }, [urlParams]);

    const Title = () => {
        let title = ""
        switch(ctx){
            case "owned":
                title = <h1>{ props.t('my_activities') }</h1>
                break;
            case "followed":
                title = <h1>{ props.t('my_favorites') }</h1>
                break;
            default:
                title = <h1>{ props.t('public_activities') }</h1>
        }
        return title;
    }

    const [activeItem, setActiveItem] = useState('myPublic')

    const [publicActivitiesFiltered, setPublicActivitiesFiltered] = useState([])
    const [privateActivitiesFiltered, setPrivateActivitiesFiltered] = useState([])

    return (
        <ContentContainer
            loaderActive={loader}
            loaderMsg={ props.t('loading') +" : " + props.t('activities') }
        >

            {!loader &&
            <>
                <Title />
                {ctx === "owned" &&
                <>
                    <Segment vertical>
                        <Menu attached='top' tabular>
                            <Menu.Item name='myPublic' active={activeItem === 'myPublic'}
                                       onClick={(e, { name }) => setActiveItem(name)}>
                                <Header>
                                    {props.t("public")}
                                </Header>
                            </Menu.Item>
                            <Menu.Item name='myPrivate' active={activeItem === 'myPrivate'}
                                       onClick={(e, { name }) => setActiveItem(name)}>
                                <Header>
                                    {props.t("private")}
                                </Header>
                            </Menu.Item>
                        </Menu>
                    </Segment>

                    {activeItem === 'myPublic' &&
                    <Segment attached='bottom'>
                        <Menu>
                            <SearchInput
                                elementList={ activities.filter(a => a.isPublic === true) }
                                setResultList={ setPublicActivitiesFiltered }
                                researchFields={{
                                    main: ["title"],
                                    summary:[ props.i18n.language ],
                                    creator: ["firstname", "lastname"]
                                }}
                                isDisabled ={ loader }
                            />
                        </Menu>
                        {activities && publicActivitiesFiltered.length > 0 ?
                            publicActivitiesFiltered.map(activity => (
                                <Segment key={activity.id} raised>
                                    <Card history={props.history} key={activity.id} obj={activity} type="activity"
                                          isLink={true}
                                          ctx={ctx}/>
                                </Segment>
                            ))
                            :
                            <Container textAlign='center'>
                                <Message size='mini' info>
                                    {props.t("no_result")}
                                </Message>
                            </Container>
                        }
                    </Segment>
                    }

                    {activeItem === 'myPrivate' &&
                    <Segment attached='bottom'>
                        <Menu>
                            <SearchInput
                                elementList={ activities.filter(a => a.isPublic === false) }
                                setResultList={ setPrivateActivitiesFiltered }
                                researchFields={{
                                    main: ["title"],
                                    summary:[ props.i18n.language ],
                                    creator: ["firstname", "lastname"]
                                }}
                                isDisabled ={ loader }
                            />
                        </Menu>
                        {activities && privateActivitiesFiltered.length > 0 ?
                            privateActivitiesFiltered.map(activity => (
                                <Segment key={activity.id} raised>
                                    <Card history={props.history} key={activity.id} obj={activity} type="activity"
                                          isLink={true}
                                          ctx={ctx}/>
                                </Segment>
                            ))
                            :
                            <Container textAlign='center'>
                                <Message size='mini' info>
                                    {props.t("no_result")}
                                </Message>
                            </Container>
                        }
                    </Segment>
                    }
                </>
                }

                {ctx !== "owned" &&
                <>
                    <Menu>
                        <SearchInput
                            elementList={ activities.filter(a => a.isPublic === true) }
                            setResultList={ setPublicActivitiesFiltered }
                            researchFields={{
                                main: ["title"],
                                summary:[ props.i18n.language ],
                                creator: ["firstname", "lastname"]
                            }}
                            isDisabled ={ loader }
                        />
                    </Menu>
                    {activities && publicActivitiesFiltered.length > 0 ?
                        publicActivitiesFiltered.map(activity => (
                            <Segment key={activity.id} raised>
                                <Card history={props.history} key={activity.id} obj={activity} type="activity"
                                      isLink={true}
                                      ctx={ctx}/>
                            </Segment>
                        ))
                        :
                        <Container textAlign='center'>
                            <Message size='mini' info>
                                {props.t("no_result")}
                            </Message>
                        </Container>
                    }
                </>
                }
            </>
            }

        </ContentContainer>
    );
}

export default withTranslation()(ActivityPage_List);

