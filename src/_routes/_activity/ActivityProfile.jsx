import React, { useEffect, useState, useContext } from 'react';
import activityAPI from '../../_services/activityAPI';
import {Image, Label, Container, Button, Header, Icon, Item, Loader, Menu, Segment } from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import AuthContext from "../../_contexts/AuthContext";
import FileUpload from "../../_components/upload/FileUpload";
import userAPI from "../../_services/userAPI";
import Card from "../../_components/Card";
import ActivityForm from "./ActivityForm";
import authAPI from "../../_services/authAPI";
import FileDownload from "../../_components/upload/FileDownload";
import FileInfos from "../../_components/upload/FileInfos";
import FollowingActivityForm from "../../_components/FollowingForm";
import Picture from "../../_components/Picture";
import {NavLink} from "react-router-dom";

const ActivityProfile = ( props ) => {
    const urlParams = props.match.params.id.split('_')
    console.log(urlParams[0])
    const [ctx, setCtx] = useState("")

    const checkCtx = () => {
        if (urlParams[0] !=="public" && !authAPI.isAuthenticated()) {
            //if ctx need auth && have no Auth, public context is forced
            authAPI.logout()
        }else {

            return urlParams[0]
        }
    }

    const isAuth = useContext(AuthContext).isAuthenticated;

    const [activity, setActivity] = useState({})
    console.log(activity)

    const isOwner = () => {
        console.log(activity.creator)
        if(activity && activity.creator){
            return userAPI.checkMail() === activity.creator.email
        }
        return false
    }

    const [activityForm, setActivityForm] = useState(false)

    const handleForm = ( ) => {
        if(activityForm === true){
            setActivityForm(false)
        }
        else {
            setActivityForm(true)
        }
    }

    const [loader, setLoader] = useState(true);
    /*const [activityLoader, setactivityLoader] = useState(false)*/

    const [activeItem, setActiveItem] = useState('presentation')

    const handleItemClick = (e, { name }) => setActiveItem(name)

    useEffect(() => {
        setLoader(true)
        setCtx(checkCtx())
        console.log(ctx)
        //todo ca ca marche pas mal
        if ( !(urlParams[0] === "public") && !(authAPI.isAuthenticated()) ) {
            props.history.replace('/login')
        }

        console.log(urlParams[0] !== 'public')
        if(urlParams[0] !== 'public'){
            activityAPI.get(urlParams[0], urlParams[1])
                .then(response => {
                    console.log(response)
                    if(response.data[0] !== "DATA_NOT_FOUND"){
                        if(response.data[0].organization){
                            //todo ??
                            response.data[0].activityId = response.data[0].organization.id
                        }
                    }
                    setActivity(response.data[0])
                })
                .catch(response => console.log(response))
                .finally(()=>setLoader(false))

        }else {
            activityAPI.getPublic(urlParams[1])
                .then(response => {
                    setActivity(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(()=>setLoader(false))
        }
    }, []);

    return (

        <div className="card">
            {!loader &&
            <>
                {activity && activity !== "DATA_NOT_FOUND" ?
                    <>
                        <Segment basic>
                            <Header as="h2" floated='left'>
                                <Picture size="small" picture={activity.picture} />
                            </Header>
                            <Header floated='right'>
                                {isAuth &&
                                <FollowingActivityForm obj={activity} setter={setActivity} type="activity" />
                                }
                                <h1>{ activity.title }</h1>
                            </Header>
                        </Segment>

                       {/* <Picture size="small" picture={obj.picture} />
                        <Container textAlign={"center"}>
                            {isAuth &&
                                <FollowingActivityForm obj={activity} setter={setActivity} type="activity" />
                            }
                            <h1>{ activity.title }</h1>
                        </Container>*/}

                        <Segment vertical >
                            <Menu attached='top' tabular>
                                <Menu.Item
                                    name='presentation'
                                    active={activeItem === 'presentation'}
                                    onClick={handleItemClick}
                                >
                                    <Header >
                                        { props.t("presentation") }
                                    </Header>
                                </Menu.Item>

                                {/* show upload tab for creator or assigned member*/}
                                {(ctx=== 'creator' || ctx=== 'assigned') &&
                                    <Menu.Item
                                        name='upload'
                                        active={activeItem === 'upload'}
                                        onClick={handleItemClick}
                                    >
                                        <Header >
                                            { props.t("upload") }
                                        </Header>
                                    </Menu.Item>
                                }

                                {activity.project &&
                                    <Menu.Item
                                        name='project'
                                        active={activeItem === 'project'}
                                        onClick={handleItemClick}
                                    ><Image src ={`data:image/jpeg;base64,${ activity.project.picture }`}   avatar size="mini"/>
                                        <Header>
                                            { activity.project.title}
                                        <Header.Subheader>
                                            { props.t('project')}
                                        </Header.Subheader>
                                        </Header>
                                    </Menu.Item>
                                }

                                {activity.organization &&
                                <Menu.Item
                                    name='organization'
                                    active={activeItem === 'organization'}
                                    onClick={handleItemClick}
                                ><Image src ={`data:image/jpeg;base64,${ activity.organization.picture }`}   avatar size="mini"/>
                                    <Header>
                                        { activity.organization.name}
                                        <Header.Subheader>
                                            { props.t('organization')}
                                        </Header.Subheader>
                                    </Header>
                                </Menu.Item>
                                }

                            </Menu>

                            {/* Presentation Tab */}
                            {activeItem === "presentation" &&
                            <Segment attached='bottom' >
                                <>
                                    {activityForm ?
                                        <ActivityForm history={props.history} activity={activity} setActivity={setActivity} setForm={handleForm}/>
                                        :
                                        <>
                                            <Segment.Group horizontal>
                                                <Segment>
                                                    <Card obj={activity} type="activity" profile={true} withPicture={false} ctx={ctx}/>
                                                </Segment>
                                                <Segment placeholder >

                                                    <FileDownload file={activity} setter={setActivity}/>
                                                </Segment>

                                            </Segment.Group>

                                            {isAuth && isOwner() && !activityForm &&
                                            <Button onClick={handleForm} fluid animated>
                                                <Button.Content visible>
                                                    { props.t('edit') }
                                                </Button.Content>
                                                <Button.Content hidden>
                                                    <Icon name='edit'/>
                                                </Button.Content>
                                            </Button>
                                            }
                                        </>
                                    }
                                </>
                            </Segment>
                            }

                            {activeItem === "upload" && (ctx==="creator" || ctx==="asssigned") &&
                            <Segment attached='bottom'>
                                <>
                                    {/*todo dropzone*/}
                                    <Segment placeholder>
                                        <Container textAlign='center'>
                                            <FileInfos file={activity} />
                                            <FileUpload history={props.history} activity={ activity } setter={ setActivity }/>
                                        </Container>
                                    </Segment>
                                </>
                            </Segment>
                            }

                            {activeItem === "project" &&
                                <Card obj={activity.project} type="project" profile={false} ctx={ctx}/>
                            }

                            {activeItem === "organization" &&
                                <Card obj={activity.organization} type="org" profile={false} ctx={ctx}/>
                            }
                        </Segment>
                    </>
                    :
                    <Item>
                        <Item.Content>
                            { props.t("no_result") }
                        </Item.Content>
                    </Item>
                }
            </>
            }
            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{props.t('loading') +" : " + props.t('presentation') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }
        </div>
    );
};

export default withTranslation()(ActivityProfile);