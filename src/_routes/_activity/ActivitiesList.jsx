import React, { useEffect, useState } from 'react';
import {Container, Header, Input, Loader, Menu, Message, Segment} from 'semantic-ui-react'
import { withTranslation } from 'react-i18next';
import activityAPI from "../../_services/activityAPI";
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

    const [activities, setActivities] = useState([])

    const [loader, setLoader] = useState();

    const [ctx, setCtx] = useState("public")
    useEffect(() => {
        setLoader(true)
        setCtx( checkCtx() )
        let ctx = checkCtx()

        if(ctx === 'follower'){
            activityAPI.getFavorites(ctx)
                .then(response => {
        //            console.log(response)
                    setActivities(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
        else if (ctx !== 'public') {
         //   console.log("get_non_public creator ou my ?")
            activityAPI.get(ctx)
                .then(response => {
      //              console.log(response)
                    setActivities(response.data.filter(a => a.creator.id === authAPI.getId()))
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        } else {
            activityAPI.getPublic()
                .then(response => {
      //              console.log(response)
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

    const [activeItem, setActiveItem] = useState('myPublic')
    const handleItemClick = (e, { name }) => setActiveItem(name)

    const [search, setSearch] = useState("")
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
    }

    const filteredList = (list) => {
        return list.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.creator.firstname.toLowerCase().includes(search.toLowerCase()) ||
            p.creator.lastname.toLowerCase().includes(search.toLowerCase())
        )
    }

    return (
        <div className="card">
            <Title />
            {!loader &&
                <>
                    {ctx === "creator" &&
                    <>
                        <Segment vertical>
                            <Menu attached='top' tabular>
                                <Menu.Item name='myPublic' active={activeItem === 'myPublic'} onClick={handleItemClick}>
                                    <Header>
                                        {props.t("public")}
                                    </Header>
                                </Menu.Item>
                                <Menu.Item name='myPrivate' active={activeItem === 'myPrivate'}
                                           onClick={handleItemClick}>
                                    <Header>
                                        {props.t("private")}
                                    </Header>
                                </Menu.Item>
                            </Menu>
                        </Segment>

                        {activeItem === 'myPublic' &&
                        <Segment attached='bottom'>
                            <Menu>
                                <Menu.Item position="right">
                                    <Input name="search" value={search ? search : ""}
                                           onChange={handleSearch}
                                           placeholder={props.t('search') + "..."}/>
                                </Menu.Item>
                            </Menu>
                            {activities && filteredList(activities.filter(a => a.isPublic === true)).length > 0 ?
                                filteredList(activities.filter(a => a.isPublic === true)).map(activity => (
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
                                <Menu.Item position="right">
                                    <Input name="search" value={search ? search : ""}
                                           onChange={handleSearch}
                                           placeholder={props.t('search') + "..."}/>
                                </Menu.Item>
                            </Menu>
                            {activities && filteredList(activities.filter(a => a.isPublic === false)).length > 0 ?
                                filteredList(activities.filter(a => a.isPublic === false)).map(activity => (
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

                {ctx !== "creator" &&
                <>
                    <Menu>
                        <Menu.Item position="right">
                            <Input name="search" value={ search ? search : ""}
                                   onChange={handleSearch}
                                   placeholder={  props.t('search') + "..."}    />
                        </Menu.Item>
                    </Menu>
                    {activities && filteredList(activities).length > 0 ?
                    filteredList(activities).map(activity => (
                    <Segment key={activity.id} raised>
                        <Card history={props.history} key={activity.id} obj={activity} type="activity" isLink={true}/>
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

