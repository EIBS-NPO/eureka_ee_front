
import React, {useState, useEffect, useContext} from 'react';
import '../../../../scss/components/cardOrg.scss';
import {useTranslation, withTranslation} from 'react-i18next';
import {Icon, Header, Segment, Container, Item, Label } from "semantic-ui-react";
import Picture from "./Picture";
import AuthContext from "../../../../__appContexts/AuthContext";
import {NavLink} from "react-router-dom";
import projectAPI from "../../../../__services/_API/projectAPI";
import authAPI from "../../../../__services/_API/authAPI";

const Card = ({ obj, type, profile=false, ctx=undefined, withPicture=true }) => {

    const isAuth = useContext(AuthContext).isAuthenticated;
    const {t,  i18n } = useTranslation()
    const lg = i18n.language

    const [owner, setOwner] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isAssign, setIsAssign] = useState(undefined)
    const [isPublic, setIsPublic] = useState(undefined)

    function getTranslate(typeText) {
        if(obj[typeText]){
           if(obj[typeText][lg]) {
                return obj[typeText][lg]
            }else if(obj[typeText]['en']) {
               return obj[typeText]['en']
           }
        }else {
            return t('no_' + typeText)
        }
    }

    const getLink = () => {
        if(isOwner ){ ctx = "owned"}
        else if(isAssign){ ctx = "assigned"}
        else { ctx = "public"}
       return  ("/" + type + "/" + ctx + "_" + obj.id);
    }

    useEffect(() => {
        if(type === "user"){
            setIsOwner(obj && obj.id === authAPI.getId())
            setOwner(obj)
        }else if(type === "org"){
            setIsOwner(obj && obj.referent && obj.referent.id === authAPI.getId())
            obj && obj.membership && obj.membership.forEach( m => {
                if(m.id ===  authAPI.getId()){ setIsAssign(true)}
            })
            setOwner(obj && obj.referent)
        }else if (type === "project"){
            setIsOwner(obj && obj.creator && obj.creator.id === authAPI.getId())

            if(isAuth && obj.id){
                projectAPI.isFollowing(obj.id, "assign")
                    .then(response => { setIsAssign(response.data[0])})
                    .catch(error => {console.log(error)})
            }

            setOwner(obj && obj.creator)
        }else if (type === "activity"){
            setIsOwner(obj && obj.creator && obj.creator.id === authAPI.getId())
            setIsPublic(obj && obj.isPublic)
            setOwner(obj && obj.creator)
        }
    },[obj])

    return (
        <>
            {obj && obj !== "DATA_NOT_FOUND" ?
            <Item>
                <Item.Content>
                    <Item.Header>
                        <Container textAlign='center'>

                            <Segment basic>
                                <Header as="h2" floated='left'>
                                    {type !== "user" &&
                                    <>
                                        {obj.title ? obj.title : obj.name}
                                        <Header.Subheader> {obj.type}</Header.Subheader>
                                    </>
                                    }
                                    {type === "user" &&
                                        obj.firstname + ' ' + obj.lastname
                                    }
                                </Header>
                                {!profile &&
                                <Header as={NavLink} to={getLink()} floated='left' >
                                    <Icon name='chevron circle right' color="purple"/>
                                    <Header.Content>
                                        { t('details')}
                                    </Header.Content>
                                </Header>
                                }
                            </Segment>


                            { ctx !== 'public' && type === "activity" &&
                                <Label basic >
                                    { t('publishing')}
                                    <Label.Detail>
                                        {obj.isPublic ?
                                             t('public')
                                            :
                                             t('private')
                                        }
                                    </Label.Detail>
                                </Label>
                            }

                        </Container>
                    </Item.Header>
                </Item.Content>

                <Item.Content>
                    <Item.Group>
                        <Item>

                            {withPicture &&
                                <Container textAlign='center'>
                                    <Picture size="small" picture={obj.picture} />
                                </Container>
                            }


                            { (type === "org" || type === "project" ) &&
                                <Container textAlign='center'>
                                    <Item.Content>
                                        <Item.Header as="h4">
                                            { t('description') }
                                        </Item.Header>
                                        <Item.Description className="wordWrap">
                                            { getTranslate("description") }
                                        </Item.Description>
                                    </Item.Content>
                                </Container>
                            }

                            { type === "activity" &&
                            <Container textAlign='center'>
                                <Item.Content>
                                    <Item.Header as="h4">
                                        { t('summary') }
                                    </Item.Header>
                                    <Item.Description className="wordWrap">
                                        { getTranslate("summary") }
                                    </Item.Description>
                                </Item.Content>
                            </Container>
                            }
                        </Item>
                    </Item.Group>


                    <Item.Group>
                        <Item>
                            <Container textAlign='center'>

                                <Item.Content>
                                    <Item.Header as="h4">
                                        { t('contact') }
                                    </Item.Header>
                                    <Item.Extra>
                                        {type !== "user" && ctx !=="create" &&
                                        <Label as='a' basic image>
                                            {owner && (owner.lastname + ' ' + owner.firstname)}

                                            {type === "referent" && <Label.Detail>{ t('referent') }</Label.Detail>}
                                            {type === "author" && <Label.Detail>{ t('author') }</Label.Detail>}

                                        </Label>
                                        }

                                        {obj.project &&
                                            <Label as='a' href={"/project/"+obj.project.id} basic image >
                                                { obj.project.title }
                                                <Label.Detail>{ t('project') }</Label.Detail>
                                            </Label>
                                        }
                                        {obj.organization &&
                                            <Label as='a' href={"/org/"+obj.organization.id} basic image >
                                                {obj.organization.name}
                                                <Label.Detail>{ t('organization') }</Label.Detail>
                                            </Label>
                                        }

                                        {(obj.email || obj.phone) &&
                                        <>
                                            {
                                                obj.email &&
                                                    <Label as="a" href={"mailto:" + obj.email} icon='mail'
                                                           content={obj.email}/>
                                            }

                                            {obj.mobile &&
                                                <Label icon='mobile' content={obj.mobile}/>
                                            }

                                            {obj.phone &&
                                                <Label icon='phone' content={obj.phone}/>
                                            }
                                        </>
                                        }
                                    </Item.Extra>
                                </Item.Content>
                            </Container>

                        </Item>
                    </Item.Group>

                    {( obj.startDate || obj.endDate ) &&
                        <Item.Group>
                            <Item.Meta>
                                {obj.startDate &&
                                <Label basic>
                                    {t('startDate')}
                                    <Label.Detail>{obj.startDate}</Label.Detail>
                                </Label>
                                }

                                {obj.endDate &&
                                <Label basic >
                                    {t('endDate')}
                                    <Label.Detail>{obj.endDate}</Label.Detail>
                                </Label>
                                }
                            </Item.Meta>
                        </Item.Group>
                    }

                </Item.Content>
            </Item>

            :
                <Item>
                    <Item.Content>
                        { t("no_result") }
                    </Item.Content>
                </Item>
            }
        </>
    );
};

export default withTranslation()(Card);
