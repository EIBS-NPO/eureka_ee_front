
import React, {useState, useEffect, useContext} from 'react';
import '../../scss/components/cardOrg.scss';
import {useTranslation, withTranslation} from 'react-i18next';
import {Icon, Header, Segment, Container, Item, Label } from "semantic-ui-react";
import Picture from "./Picture";
import {NavLink} from "react-router-dom";
import authAPI from "../../__services/_API/authAPI";
import AuthContext from "../../__appContexts/AuthContext";
import {MailInput} from "./Buttons";
import {PhoneDisplay} from "./PhoneNumber";

const Card = ({ obj, type, profile=false, ctx=undefined, withPicture=true }) => {

    const {t,  i18n } = useTranslation()
    const lg = i18n.language

    const isAuth = useContext(AuthContext).isAuthenticated;
    const [owner, setOwner] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    function getTranslate(typeText) {
        if(obj[typeText]){
           if(obj[typeText][lg] && obj[typeText][lg] !== "") {
                return obj[typeText][lg]
            }else if(obj[typeText]['en-GB'] && obj[typeText]['en-GB'] !== "") {
               return obj[typeText]['en-GB']
           }else return t('no_' + typeText)
        }else return t('no_' + typeText)
    }

    const getLink = () => {
        if(isOwner ){ ctx = "owned"}
        else if(obj.isAssigned !== undefined && obj.isAssigned === true){ ctx = "assigned"}
        else if(obj.isFollowed !== undefined && obj.isFollowed === true){ ctx ="followed"}
        else if (type === "activity" && obj.isPublic === false && isAuth){ ctx = "private"}
        else { ctx = "public"}
       return  ("/" + type + "/" + ctx + "_" + obj.id);
    }

    useEffect(() => {
        if(type === "user"){
            setIsOwner(obj && obj.id === authAPI.getId())
            setOwner(obj)
        }else if(type === "org"){
            setIsOwner(obj && obj.referent && obj.referent.id === authAPI.getId())
            /*obj && obj.membership && obj.membership.forEach( m => {
                if(m.id ===  authAPI.getId()){ setIsAssign(true)}
            })*/
            setOwner(obj && obj.referent)
        }else if (type === "project"){
            setIsOwner(obj && obj.creator && obj.creator.id === authAPI.getId())

            setOwner(obj && obj.creator)
        }else if (type === "activity"){
            setIsOwner(obj && obj.creator && obj.creator.id === authAPI.getId())
            setOwner(obj && obj.creator)
        }
        //dismiss unmounted warning
        return () => {
            setIsOwner(false)
            setOwner({})
        };

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
                            <Item.Content>
                                <Segment className="unmarged"  padded='very' basic >
                                    <Item.Header as="h4">
                                        { (type === "org" || type === "project" ) && t('description') }
                                        { type === "activity" && t('summary') }
                                    </Item.Header>
                                    <Item.Description className="wordWrap">
                                        {withPicture && obj.picture &&
                                            <Picture size="small" picture={obj.picture} isFloat="left"/>
                                        }
                                        { (type === "org" || type === "project" ) && getTranslate("description") }
                                        { type === "activity" && getTranslate("summary") }
                                    </Item.Description>
                                </Segment>
                            </Item.Content>
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
                                        <Label as='a' href={"/user/public_"+owner.id} basic image>
                                            {owner && (owner.lastname + ' ' + owner.firstname)}

                                            {type === "referent" && <Label.Detail>{ t('referent') }</Label.Detail>}
                                            {type === "author" && <Label.Detail>{ t('author') }</Label.Detail>}

                                        </Label>
                                        }

                                        {obj.project &&
                                            <Label as='a' href={"/project/public_"+obj.project.id} basic image >
                                                { obj.project.title }
                                                <Label.Detail>{ t('project') }</Label.Detail>
                                            </Label>
                                        }
                                        {obj.organization &&
                                            <Label as='a' href={"/org/public_"+obj.organization.id} basic image >
                                                {obj.organization.name}
                                                <Label.Detail>{ t('organization') }</Label.Detail>
                                            </Label>
                                        }

                                        {(obj.email || obj.phone) &&
                                        <>
                                            {obj.email &&
                                            <MailInput t={t} email={obj.email} isConfirmed={obj.isConfirmed } isAdmin={ false }/>
                                            }

                                            {obj.mobile &&
                                                <PhoneDisplay phoneNumber={obj.mobile}/>
                                            }

                                            {obj.phone &&
                                                <PhoneDisplay phoneNumber={obj.phone}/>
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

