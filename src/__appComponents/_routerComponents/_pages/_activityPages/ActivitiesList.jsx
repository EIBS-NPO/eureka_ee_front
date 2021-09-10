import React, { useEffect, useState } from 'react';
import {Container, Header, Input, Loader, Menu, Message, Segment} from 'semantic-ui-react'
import { withTranslation } from 'react-i18next';
import activityAPI from "../../../../__services/_API/activityAPI";
import Card from "../__CommonComponents/Card";
import authAPI from "../../../../__services/_API/authAPI";

const ActivitiesList = ( props ) => {
    const urlParams = props.match.params.ctx

    const checkCtx = () => {
        if(urlParams === 'public' || urlParams === 'owned' || urlParams === 'followed'){
            if (urlParams !=="public" && !authAPI.isAuthenticated()) {
                //if ctx need auth && have no Auth, public context is forced
                authAPI.logout()
            }else {return urlParams}
        }
        else return '';
    }

    const [activities, setActivities] = useState([])

    const [loader, setLoader] = useState();

    const [ctx, setCtx] = useState("public")
    useEffect(async() => {
        setLoader(true)
        setCtx(checkCtx())
        let ctx = checkCtx()

        if (ctx !== '') { //if valid ctx
            if(ctx === 'public'){//publicActivities
            let response = await activityAPI.getPublic()
                .catch(error => console.log(error.response))
                if (response && response.status === 200) {
                    setActivities(response.data)
                }
            } else { //owned or followed activities
                let response = await activityAPI.getActivity(ctx)
                    .catch(error => console.log(error.response))
                if (response && response.status === 200) {
                    setActivities(response.data)
                }
            }
        }
        setLoader(false)
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
                    {ctx === "owned" &&
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

                {ctx !== "owned" &&
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
                            <Card
                                history={props.history}
                                key={activity.id}
                                obj={activity}
                                type="activity"
                                isLink={true}/>
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

