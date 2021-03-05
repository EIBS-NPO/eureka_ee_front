import React, { useEffect, useState, useContext } from 'react';
import activityAPI from '../../_services/activityAPI';
import { Container, Button, Header, Icon, Item, Loader, Menu, Segment } from "semantic-ui-react";
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
import FollowersList from "../_user/FollowersList";

const ActivityProfile = ( props ) => {
    const urlParams = props.match.params.id.split('_')
    //if anonymous user is on no anonymous context

    if ( urlParams[0] !=="public" ) {
        authAPI.setup();
    }

    const isAuth = useContext(AuthContext).isAuthenticated;

    const [activity, setActivity] = useState({})
    console.log(activity)

    const ctx = () => {
        if (urlParams[0] !=="public" && isAuth === false) {
            //if ctx need auth && have no Auth, public context is forced
            //non, if the activity asked is private it's cheap
            return 'public';
        }
        else {
            return urlParams[0]
        }
    }


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
        /*if ( urlParams[0] !=="public" ) {
            return authAPI.setup();
        }*/
        //todo ca ca marche pas mal
        if ( !(urlParams[0] === "public") && !(authAPI.isAuthenticated()) ) {
            props.history.replace('/login')
        }

        if(ctx() !== 'public'){
       //     setactivityLoader(true)
            activityAPI.get(ctx(), urlParams[1])
                .then(response => {
                    console.log(response)
                    if(response.data[0] !== "DATA_NOT_FOUND"){
                        if(response.data[0].organization){
                            //todo ??
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

    return (

        <div className="card">
            {!loader &&
            <>
                {activity && activity !== "DATA_NOT_FOUND" ?
                    <>
                        <Container textAlign={"center"}>
                            {isAuth &&
                                <FollowingActivityForm obj={activity} setter={setActivity} type="activity" />
                            }
                            <h1>{ activity.title }</h1>
                        </Container>

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
                                        <ActivityForm history={props.history} activity={activity} setActivity={setActivity} setForm={handleForm}/>
                                        :
                                        <>
                                            <Segment.Group horizontal>
                                                <Segment>
                                                    <Card obj={activity} type="activity" profile={true} ctx={ctx()}/>
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

                            {activeItem === "upload" && (ctx()==="creator" || ctx()==="asssigned") &&
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

                            {activeItem === "followers" &&
                                <Segment attached='bottom'>
                                    <FollowersList obj={activity} listFor="activity" />
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

export default withTranslation()(ActivityProfile);

                                        /*
                                        <script>
                                        function Upload(element) {
                                        var reader = new FileReader();
                                        let file = element.files[0];
                                        reader.onload = function () {
                                        var arrayBuffer = this.result;
                                        Download(arrayBuffer, file.type);
                                        }
                                        reader.readAsArrayBuffer(file);
                                        }

                                        function Download(arrayBuffer, type) {
                                        var blob = new Blob([arrayBuffer], { type: type });
                                        var url = URL.createObjectURL(blob);
                                        window.open(url);
                                        }

                                        </script>
                                        */