
import React, {useContext, useEffect, useState} from "react";
import MediaContext from "../../../../__appContexts/MediaContext";
import AuthContext from "../../../../__appContexts/AuthContext";
import {Button, Container, Header, Image, Item, Menu, Segment} from "semantic-ui-react";
import Picture from "../__CommonComponents/Picture";
import {withTranslation} from "react-i18next";
import orgAPI from "../../../../__services/_API/orgAPI";
import i18n from "i18next";
import userAPI from "../../../../__services/_API/userAPI";
import OrgForm from "./OrgForm";
import authAPI from "../../../../__services/_API/authAPI";

const OrgProfil2 = (props) => {

    // ****** CONTEXT ****** //
    const Media = useContext(MediaContext).Media
    const isAuth = useContext(AuthContext).isAuthenticated;
    const lg = i18n.language

    // ****** URL PARAMS ****** //
    const urlParams = props.match.params.id.split('_')
    const checkCtx = () => {
        if (urlParams[0] !=="public" && isAuth === false) {
            //if ctx need auth && have no Auth, public context is forced
            return 'public';
        } else {return urlParams[0]}
    }
    const [ctx, setCtx] = useState()

    // ****** Local Constant ****** //
    const [org, setOrg] = useState({})
    const [isOwner, setIsOwner] = useState(false)
        // ****** Form ****** //
    const [isForm, setIsForm] = useState(false)
    const handleForm = ( ) => {
        isForm === true ? setIsForm(false) : setIsForm(true)
        console.log(isForm)
    }

    // ****** DATA LOAD ****** //
    const [loader, setLoader] = useState(false);
    const setData = (data) => {
        console.log(data)
        setOrg(data)
        setIsOwner(userAPI.checkMail() === data.referent.email)
     //   setActivities(data.activities ? data.activities : [])
     //   setProjects(data.projects ? data.projects : [])
        //manage access
     //   setIsReferent(authAPI.getId() === data.referent.id)
        /*data.membership && data.membership.forEach( m => {
            if(m.id ===  authAPI.getId()){ setIsAssigned(true)}
        })*/
    }

    useEffect(async() => {
        setLoader(true)
        await setCtx(checkCtx())
        console.log(urlParams[0])
        console.log(ctx)

        //todo contextError
       /* if(urlParams[2]){
            setMessage(urlParams[2])
        }*/

        if(ctx !== 'public' && await (authAPI.isAuthenticated())){//for user's org or assign members
            let response = await orgAPI.getOrg(urlParams[0],urlParams[1])
                .catch(error => console.log(error.response))
            if(response && response.status === 200){
                await setData(response.data[0])
            }
        }else {//for anonymous
            let response = await orgAPI.getPublic(urlParams[1])
                .catch(error => console.log(error.response))
            if(response && response.status === 200 ){
                await setData(response.data[0])
            }
        }
        setLoader(false)
    }, []);


    const ProfilMenu = () => {
        return (
            <Menu className="profil-header-menu bg-transparent unmarged" borderless fluid>
                {isAuth && isOwner && <Button
                    className="black-white"
                    icon='edit' size='medium'
                    content={props.t('edit')} onClick={handleForm}/>}
            </Menu>
        )
    }

    // ****** SUB-COMPONENTS ****** //
    /**
     *
     * @returns {JSX.Element}
     * @constructor
     */
    const ProfilHeader = () => {

        return (
            <>
                <Segment className="profil-header unpadded" basic>
                    <Segment className="profil-header-content near-backdrop unpadded" vertical>

                        <ProfilMenu/>

                        <Segment className="profil-header-title unpadded unmarged" basic>
                            {org.picture &&
                            <Segment className="unpadded " basic>
                                <Image
                                    circular
                                    size="small"
                                    src={`data:image/jpeg;base64,${org.picture}`}
                                    floated="left"
                                />
                                <h2 className="autoContrast">
                                    {org.name}
                                    <p>{org.type}</p>
                                </h2>
                               <Description/>
                            </Segment>
                            }

                        </Segment>
                    </Segment>


                    <Container className="backdrop">
                        <Segment basic className="bg-circle"/>
                    </Container>
                </Segment>
                {/*<Segment attached="bottom">*/}
                {/*    /!*  <Menu className="menubar spaced-menu absPos " borderless vertical>*!/*/}
                {/*    <Menu borderless vertical>*/}
                {/*        {isAuth && isOwner &&*/}
                {/*        <Button basic icon='edit' size='big' content={props.t('edit')} onClick={handleForm}/>*/}
                {/*        }*/}
                {/*    </Menu>*/}
                {/*</Segment>*/}
            </>

        )
    }

    /**
     *
     * @returns {JSX.Element}
     * @constructor
     */
    const Description = () => {

        function getTranslate(typeText) {
            if(org[typeText]){
                if(org[typeText][lg]) {
                    return org[typeText][lg]
                }else if(org[typeText]['en']) {
                    return org[typeText]['en']
                }
            }else {
                return props.t('no_' + typeText)
            }
        }

        return (
            <Item.Content>
                {/*<Item.Header as="h4">
                    { t('description') }
                </Item.Header>*/}
                <Item.Description className="wordWrap autoContrast">
                    { getTranslate("description") }
                </Item.Description>
            </Item.Content>
          /*  <Segment className="content-description bg-transparent" textAlign='center' basic>*/

           /* </Segment>*/
        )
    }

    /**
     *
     * @param referent
     * @returns {JSX.Element}
     * @constructor
     */
    const ContactBox = () => {

        const address = org && org.address

        return (
            <Segment basic>
                <Segment  basic>
                    <p>{org && org.phone}</p>
                    <p>{org && org.email}</p>
                </Segment>
                <Segment basic>
                    <p>{address && address.address}</p>
                    <p>{address && address.complement}</p>
                    <p>{address && address.zipCode + " " + address.city}</p>
                    <p>{address && address.country}</p>
                </Segment>
            </Segment>
            /*<Segment vertical float="right" basic>
                <h3>{props.t("contacts")}</h3>
                    <Segment className="profil-header" basic>
                {/!*{referent.picture &&*!/}
                        <Segment basic>
                            <Image
                            circular
                            size="small"
                            //   src={`data:image/jpeg;base64,${referent.picture}`}
                            src='https://react.semantic-ui.com/images/wireframe/image.png'
                            />
                        </Segment>
                {/!*}*!/}
                        <h3>
                    {org && org.referent && org.referent.firstname + " " + org.referent.lastname}
                        </h3>
                    </Segment>

                    <Segment basic>
                        <h4>Contact</h4>
                        <p>{org && org.referent && org.referent.email}</p>
                        <p>{org && org.referent && org.referent.phone}</p>
                    </Segment>


            </Segment>*/

        )
    }

    const ProfilContent = () => {
        return (
            <Segment.Group horizontal className="borderless unpadded" >
                <ProfilHeader/>
                <Description/>
            </Segment.Group>
        )
    }

    return (
        <Segment className="card" basic loading={loader}>
            {org &&
                //<OrgForm org={org} setForm={handleForm} setter={setOrg}/>
                isForm === true ? <OrgForm org={org} setForm={handleForm} setter={setOrg}/> :

                    <>
                        {/*isAuth && isOwner &&
                        <Segment basic textAlign="center">
                            <Button basic icon='edit' size='big' content={props.t('edit')} onClick={handleForm}/>
                        </Segment>*/}



                        <ProfilHeader/>
                       {/* <Description/>
                        <ProfilContent/>*/}

                        <ContactBox />
                    </>

            }
            {!org && <p>error, no org</p> }
        </Segment>


    )
}

export default withTranslation()(OrgProfil2);