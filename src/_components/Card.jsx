
import React, {useState, useEffect, useContext} from 'react';
import '../scss/components/cardOrg.scss';
import {useTranslation, withTranslation} from 'react-i18next';
import {Icon, Header, Segment, Button, Container, Item, Label } from "semantic-ui-react";
import Picture from "./Picture";
import userAPI from "../_services/userAPI";
import AuthContext from "../_contexts/AuthContext";
import {NavLink} from "react-router-dom";

const Card = ({ obj, type, isLink=false, profile=false, ctx=undefined, withPicture=true }) => {

    const isAuth = useContext(AuthContext).isAuthenticated;
    const {t,  i18n } = useTranslation()
    const lg = i18n.language.split('-')[0]

    const [owner, setOwner] = useState({});

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
        let h = "/" + type + "/public_" + obj.id;
        if(isAuth){
            if(userAPI.checkMail() === owner.email) { h = "/" + type + "/creator_" + obj.id}
        }

       return h
    }

    useEffect(() => {
        if(type === "user"){ }
        switch(type){
            case "user":
                setOwner(obj)
                break
            case "org":
                setOwner(obj.referent)
                break
            case "project":
            case "activity":
                setOwner(obj.creator)
                break
        }
    },[])

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
                                    <Header as={NavLink} to={getLink()} floated='right'>
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
                                        <Item.Description>
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
                                    <Item.Description>
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
                                           /* <LabelUser user={ owner } type={type === "org" ? "referent" : "author"} />*/
                                        <Label as='a' basic image>
                                            {/* {user.picture &&*/}
                                            {/*  <Picture size="small" picture={user.picture} isFloat={"left"}/>*/}
                                            {/*  }*/}
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

                                        {/*//todo tout s affiche?*/}
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

