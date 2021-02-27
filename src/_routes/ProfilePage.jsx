
import React, {useEffect, useState, useContext, createContext} from 'react';
import orgAPI from "../_services/orgAPI";
import {Icon, Image, Header, Label, Segment, Menu, Item, Loader, Button, Container} from "semantic-ui-react";
import Organization from "../_components/cards/organization";
import Membership from "./_org/Membership";
import {withTranslation} from "react-i18next";
import AuthContext from "../_contexts/AuthContext";
import userAPI from "../_services/userAPI";
import OrgForm from "./_org/OrgForm";
import projectAPI from "../_services/projectAPI";
import activityAPI from "../_services/activityAPI";

export const ProfileContext = createContext({
    obj:{ },
    errors: { },
})

//todo afficher un bouton si referent pour update
//todo si update clicquer afficher le compo orgForm sinon le compo organization
const ProfilOrg = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    const urlParams = props.match.params.id.split('_')

    const [ctx, setCtx] = useState("public")
    const [profileFor, setProfileFor] = useState()
    const [targetId, setTargetId] = useState()
    const [api, setApi] = useState()

    useEffect (()=> {
        setCtx(urlParams[0])
        setProfileFor(urlParams[1])
        setTargetId(urlParams[2])

        switch(profileFor){
            case "user":
                setApi({userAPI})
                break;
            case "org":
                setApi({orgAPI})
                break;
            case "project":
                setApi({projectAPI})
                break;
            case "activity":
                setApi({activityAPI})
                break;
        }
    },[])

    const isReferent = () => {
        return userAPI.checkMail() === org.referent.email
    }

    const [ obj, setObj ] = useState({})

    const  [ objForm, setObjForm ]  = useState(false)

    const handleForm = ( ) => {
        if(objForm === true){
            setObjForm(false)
        }
        else {
            setObjForm(true)
        }
    }

    const [loader, setLoader] = useState(true);

    const [activeItem, setActiveItem] = useState('presentation')

    const handleItemClick = (e, { name }) => setActiveItem(name)

    useEffect(() => {
        setLoader(true)
        console.log(ctx)
        if(ctx === 'my'){
            api.get(targetId)
                .then(response => {
                    console.log(response)
                    setObj(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }else {
            api.getPublic(targetId)
                .then(response => {
                    console.log(response)
                    setObj(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
    }, []);

    return (

        <div className="card">
            <ProfileContext.Provider
                value={{
                    obj,
                    setObj,
                    setObjForm
                }}
            >

                <h1>{ props.t('presentation') + ' : ' + props.t('organization') }</h1>
                {!loader &&
                <>
                    {obj && obj !== "DATA_NOT_FOUND" ?
                        <>
                            {/*{ctx() === 'public' &&
                            obj.referent &&
                            <Label as='a' basic image>
                                {obj.referent.picture ?
                                    <Image size="small" src={`data:image/jpeg;base64,${obj.referent.picture}`}
                                           floated='left'/>
                                    :
                                    <Image size="small" src='https://react.semantic-ui.com/images/wireframe/image.png'
                                           floated='left'/>
                                }
                                {obj.referent.lastname + ' ' + obj.referent.firstname}
                                <Label.Detail>{props.t('referent')}</Label.Detail>
                            </Label>
                            }*/}

                            <Segment vertical>

                                {profileFor !== "user" &&
                                    <>
                                        <span><h3> { obj.title ? obj.title : obj.name } </h3></span>
                                        <span> { obj.type } </span>
                                    </>
                                }

                                {profileFor === "user" &&
                                    <span><h3> { obj.firstname + ' ' + obj.lastname } </h3></span>
                                }


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
                                    <Menu.Item
                                        name='membership'
                                        active={activeItem === 'membership'}
                                        onClick={handleItemClick}
                                    >
                                        <Header >
                                            { props.t("membership") }
                                        </Header>
                                    </Menu.Item>
                                    <Menu.Item
                                        name='projects'
                                        active={activeItem === 'projects'}
                                        onClick={handleItemClick}
                                    >
                                        <Header >
                                            { props.t("projects") }
                                        </Header>
                                    </Menu.Item>
                                    <Menu.Item
                                        name='activities'
                                        active={activeItem === 'activities'}
                                        onClick={handleItemClick}
                                    >
                                        <Header >
                                            { props.t("activities") }
                                        </Header>
                                    </Menu.Item>
                                </Menu>



                                {activeItem === "presentation" &&
                                <Segment attached='bottom'>
                                    <>
                                        {objForm ?
                                            <OrgForm org={obj} setForm={handleForm} />
                                            :
                                            <>
                                                <Organization obj={obj} />
                                                {isAuth && isReferent() && !objForm &&
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

                                {/*todo faire en-GB sorte que les compo ne se charge qu'à la demande*/}
                                {activeItem === 'membership' &&
                                <Segment attached='bottom'>
                                    <Membership org={org} />
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

            </ProfileContext.Provider>
        </div>
    );
};

export default withTranslation()(ProfilOrg);
