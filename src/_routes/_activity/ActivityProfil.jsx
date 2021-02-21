import React, { useEffect, useState, useContext } from 'react';
import activityAPI from '../../_services/activityAPI';
import {Input, Container, Button, Checkbox, Form, Grid, Header, Icon, Image, Item, Label, Loader, Menu, Segment } from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import AuthContext from "../../_contexts/AuthContext";
import PictureForm from "../../_components/forms/PictureForm";
import orgAPI from "../../_services/orgAPI";
import fileAPI from "../../_services/fileAPI";
import FileUpload from "../../_components/upload/FileUpload";
import userAPI from "../../_services/userAPI";
import Picture from "../../_components/Picture";
import OrgForm from "../_org/OrgForm";
import Organization from "../../_components/cards/organization";
import Card from "../../_components/Card";
import ProjectForm from "../_project/ProjectForm";
import ActivityForm from "./ActivityForm";
import utilities from "../../_services/utilities";

const ActivityProfil = (props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    const urlParams = props.match.params.id.split('_')

    const [activity, setActivity] = useState({})

    const ctx = () => {
        if (urlParams[0] !=="public" && isAuth === false) {
            //if ctx need auth && have no Auth, public context is forced
            return 'public';
        }
        else {
            return urlParams[0]
        }
    }


    const isOwner = () => {
        console.log(activity)
        return userAPI.checkMail() === activity.creator.email
    }

    //handle show for orgs selector
    const [toggleShow, setToggleShow] = useState(false)

    const [picture, setPicture] = useState()
    console.log(activity)

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
        if(ctx() !== 'public'){
       //     setactivityLoader(true)
            activityAPI.get(ctx(), urlParams[1])
                .then(response => {
                    console.log(response)
                    if(response.data[0] !== "DATA_NOT_FOUND"){
                        if(response.data[0].organization){
                            response.data[0].activityId = response.data[0].organization.id
                  //          setSelected(response.data[0].organization.id)
                   //         setToggleShow(true)
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

    const downloadFile = () => {
        fileAPI.urlDownload(activity.id)
            .then(response => {
                console.log(response)
            })
    }
    return (

        <div className="card">
            {!loader &&
            <>
                {activity && activity !== "DATA_NOT_FOUND" ?
                    <>
                        <Container textAlign={"center"}>
                            <h1>{ activity.title }</h1>
                        </Container>

                        {/*{ctx() === 'public' &&
                        activity.creator &&
                        <Label as='a' basic image>
                            {activity.creator.picture ?
                                <Image size="small" src={`data:image/jpeg;base64,${activity.creator.picture}`}
                                       floated='left'/>
                                :
                                <Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'
                                       floated='left'/>
                            }
                            {activity.creator.lastname + ' ' + activity.creator.firstname}
                            <Label.Detail>{props.t('author')}</Label.Detail>
                        </Label>
                        }*/}

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
                                {(ctx()=== 'creator' || ctx()=== 'assigned') &&
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

                                <Menu.Item
                                    name='team'
                                    active={activeItem === 'team'}
                                    onClick={handleItemClick}
                                >
                                    <Header >
                                        { props.t("team") }
                                    </Header>
                                </Menu.Item>
                                <Menu.Item
                                    name='followers'
                                    active={activeItem === 'followers'}
                                    onClick={handleItemClick}
                                >
                                    <Header >
                                        { props.t("followers") }
                                    </Header>
                                </Menu.Item>
                            </Menu>

                            {/* Presentation Tab */}
                            {activeItem === "presentation" &&
                            <Segment attached='bottom' >
                                <>
                                    {activityForm ?
                                        <ActivityForm activity={activity} setActivity={setActivity} setForm={handleForm}/>
                                        :
                                        <>
                                            <Segment.Group horizontal>
                                                <Segment>
                                                    <Card obj={activity} type="activity" profile={true} />
                                                </Segment>
                                                <Segment placeholder >
                                                    <Container textAlign='center'>
                                                        {!activity.fileType &&
                                                        <Header icon>
                                                            <Icon name='pdf file outline' />
                                                            { props.t('no_file') }
                                                        </Header>
                                                        }
                                                        {activity.fileType &&
                                                            <>
                                                        <Header icon>
                                                            <Icon name='file pdf' />
                                                            <p>{activity.filePath}</p>
                                                            <p>{utilities.octetsToKilos(activity.size) + "kB"}</p>
                                                        </Header>
                                                        {activity.isPublic ?
                                                       //     <a href={fileAPI.urlDownloadPublic(activity.id)} download />
                                                            <Input as={"a"} type="download" href={fileAPI.urlDownloadPublic(activity.id)} />
                                                        :
                                                            <a href={fileAPI.urlDownload(activity.id)} download />
                                                        }
                                                        <Button fluid animated onClick={downloadFile}>
                                                                <Button.Content visible>
                                                                    { props.t('download') }
                                                                </Button.Content>
                                                                <Button.Content hidden>
                                                                    <Icon name='download'/>
                                                                </Button.Content>
                                                            </Button>
                                                        </>
                                                        }
                                                    </Container>
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

                            {activeItem === "upload" && (ctx()==="creator" || ctx()==="asssigned") &&
                            <Segment attached='bottom'>
                                <>
                                    {/*todo dropzone*/}
                                    <Segment placeholder>
                                        <Container textAlign='center'>
                                            <FileUpload activity={ activity } setter={ setActivity }/>
                                        </Container>
                                    </Segment>
                                </>
                            </Segment>
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

export default withTranslation()(ActivityProfil);