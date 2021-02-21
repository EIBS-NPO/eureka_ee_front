
import React, {useState, useEffect, useContext} from 'react';
import '../scss/components/cardOrg.scss';
import {useTranslation, withTranslation} from 'react-i18next';
import {Container, Divider, Grid, Icon, Image, Item, Label, Segment} from "semantic-ui-react";
import Picture from "./Picture";
import {NavLink} from "react-router-dom";
import userAPI from "../_services/userAPI";
import AuthContext from "../_contexts/AuthContext";
import LabelUser from "./LabelUser";
import LabelOrg from "./LabelOrg";

const Card = ({ obj, type, isLink=false, profile=false }) => {
//    console.log(obj)
    const isAuth = useContext(AuthContext).isAuthenticated;
    const {t,  i18n } = useTranslation()

  //  const [isOwner, setIsOwner] = useState(false)
    const [hrefLink, setHrefLink] = useState("")
    /*const [hrefLink2, setHrefLink2] = useState("")*/

    const [owner, setOwner] = useState({});

    useEffect(() => {
       /* let h2 = "/profile/public_" + type + "_" + obj.id;*/
        let objMail = ""
        if(obj.creator){
            objMail = obj.creator.email
            setOwner(obj.creator)
        }
        else if (obj.referent){
            objMail = obj.referent.email
            setOwner(obj.referent)
        }

        if(isLink){
            let h = "/" + type + "/public_" + obj.id;
            if(isAuth){
                if(userAPI.checkMail() === objMail) { h = "/" + type + "/creator_" + obj.id}
                /*if(userAPI.checkMail() === objMail) { h2 = "/profile/my_" + type + "_" + obj.id}*/
            }

            setHrefLink(h);
        }

        //console.log(h)
        /*setHrefLink2(h2);*/
    },[])

    return (
        <>
         {/*<Segment>*/}

            {obj && obj !== "DATA_NOT_FOUND" ?
            <Item>
                <Item.Content>
                    <Item.Header>
                        <Container textAlign='center'>
                            {type !== "user" && !profile &&
                                <>
                                <span><h3> { obj.title ? obj.title : obj.name } </h3></span>
                                    <span> { obj.type } </span>
                                    </>
                            }

                            { !obj.isPublic && ( type === "project" || type === "activity") &&
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

                            {type === "user" &&
                                <span><h3> { obj.firstname + ' ' + obj.lastname } </h3></span>
                            }

                        </Container>
                    </Item.Header>
                </Item.Content>

                <Item.Content>
                    <Item.Group link={isLink} href={ hrefLink }>
                        {/*<a href={ hrefLink2 }>vers pageProfile</a>*/}
                        <Item>
                            {/*<Item.Content>
                                <Item.Header as="h4">
                                    { t('description') }
                                </Item.Header>
                                    <Picture size="small" picture={obj.picture} isFloat="middle"/>
                                    <p>
                                        {obj.description && obj.description[i18n.language] ?
                                            obj.description[i18n.language]
                                            :
                                            t('no_description')
                                        }
                                    </p>
                            </Item.Content>*/}

                            <Container textAlign='center'>
                                <Picture size="small" picture={obj.picture} />
                            </Container>

                            { (type === "org" || type === "project") &&
                                <Container textAlign='center'>
                                    <Item.Content>
                                        <Item.Header as="h4">
                                            { t('description') }
                                        </Item.Header>
                                        <Item.Description>
                                            {obj.description && obj.description[i18n.language] ?
                                                obj.description[i18n.language]
                                                :
                                                t('no_description')
                                            }
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
                                        {obj.summary && obj.summary[i18n.language] ?
                                            obj.summary[i18n.language]
                                            :
                                            t('no_summary')
                                        }
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
                                        {type !== "user" &&
                                            <LabelUser user={ owner } type={type === "org" ? "referent" : "author"} />
                                          //  <Label icon='user' content={obj.referent.firstname + " " + obj.referent.lastname}/>
                                        }

                                        {obj.organization &&
                                            /*<>
                                                <Divider hidden/>
                                                <Label icon='link' content={obj.organization.name}/>
                                            </>*/
                                            <LabelOrg org={obj.organization } />
                                        }

                                        {(obj.email || obj.phone) &&
                                        <>
                                            {
                                                obj.email &&
                                                    <Label as="a" href={"mailto:" + obj.email} icon='mail'
                                                           content={obj.email}/>
                                            }

                                            {obj.mobile &&
                                                <>
                                                {/*<Divider hidden/>*/}
                                                <Label icon='mobile' content={obj.mobile}/>
                                                </>
                                            }

                                            {obj.phone &&
                                                <>
                                                {/*<Divider hidden/>*/}
                                                <Label icon='phone' content={obj.phone}/>
                                                </>
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

       {/*</Segment>*/}
        </>
    );
};

export default withTranslation()(Card);

