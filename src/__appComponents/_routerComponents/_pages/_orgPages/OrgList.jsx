import React, {useContext, useEffect, useState} from 'react';
import { withTranslation } from 'react-i18next';
import orgAPI from "../../../../__services/_API/orgAPI";
import {Container, Header, Input, Loader, Menu, Message, Segment} from "semantic-ui-react";
import Card from "../__CommonComponents/Card";
import authAPI from "../../../../__services/_API/authAPI";
import AuthContext from "../../../../__appContexts/AuthContext";

const OrgList = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    const urlParams = props.match.params.ctx

    //forbiden if route for my org wwith no auth
    const checkCtx = () => {
        if (urlParams !=="public" && !authAPI.isAuthenticated()) {
            //if ctx need auth && have no Auth, public context is forced
            authAPI.logout()
        }else {return urlParams}
    }

    const [ctx, setCtx] = useState("")

    const getLinkContext = (org) => {
        let linkCtx = 'public'
        if(isAuth){
            if(org.referent.id === authAPI.getId()) { linkCtx = 'owned'}
            else if(org.membership && org.membership.find(m => m.id === authAPI.getId()) !== undefined){ linkCtx = 'assigned'}
        }
        return linkCtx
    }

    const [orgs, setOrgs] = useState([])
    const [myOrgs, setMyOrgs] = useState([])
    const [partnerOrgs, setPartnerOrgs] =useState([])

    const [loader, setLoader] = useState();

    useEffect(async() => {
        setLoader(true)
        setCtx( await checkCtx() )
        if(urlParams === 'public'){
            let response = await orgAPI.getPublic()
                .catch(error => console.log(error.response))
            if(response && response.status === 200){
                console.log(response.data)
                setOrgs(response.data)
            }
        }else {
            let response = await orgAPI.getOrg('owned')
                .catch(error => console.log(error.response))
            if(response && response.status === 200){
                console.log(response.data)
                setMyOrgs(response.data)
            }

            if(urlParams === 'owned'){
                let response = await orgAPI.getOrg('assigned')
                    .catch(error => console.log(error.response))
                if(response && response.status === 200){
                    setPartnerOrgs(response.data)
                }
            }
        }
        setLoader(false)
    }, [urlParams]);

    const [activeItem, setActiveItem] = useState('myOrgs')
    const handleItemClick = (e, { name }) => setActiveItem(name)

    const [search, setSearch] = useState("")
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
    }

    const filteredList = (list) => {
        return list.filter(o =>
            o.name.toLowerCase().includes(search.toLowerCase()) ||
            o.referent.firstname.toLowerCase().includes(search.toLowerCase()) ||
            o.referent.lastname.toLowerCase().includes(search.toLowerCase())
        )
    }

    return (
        <div className="card">
            { ctx === 'owned' && <h1>{ props.t('my_orgs') }</h1> }
            { ctx !== 'owned' && <h1>{ props.t('all_org') }</h1> }
                <>
                    {ctx === "owned" &&
                    <>
                        <Segment vertical>
                            <Menu attached='top' tabular>
                                <Menu.Item name='myOrgs' active={activeItem === 'myOrgs'} onClick={handleItemClick}>
                                    <Header>
                                        {props.t("my_plural") + " " + props.t("organization") + "s"}
                                    </Header>
                                </Menu.Item>
                                <Menu.Item name='myPartners' active={activeItem === 'myPartners'} onClick={handleItemClick}>
                                    <Header>
                                        {props.t("my_partners")}
                                    </Header>
                                </Menu.Item>
                            </Menu>
                        </Segment>
                        {!loader &&
                        <>
                            {activeItem === 'myOrgs' &&
                            <Segment attached='bottom'>
                                <Menu>
                                    <Menu.Item position="right">
                                        <Input name="search" value={ search ? search : ""}
                                               onChange={handleSearch}
                                               placeholder={  props.t('search') + "..."}    />
                                    </Menu.Item>
                                </Menu>
                                {myOrgs && filteredList(myOrgs).length > 0 ?
                                    filteredList(myOrgs).map(org => (
                                        <Segment key={org.id} raised>
                                            <Card history={props.history}
                                                  key={org.id}
                                                  obj={org}
                                                  type="org"
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

                            {activeItem === 'myPartners' &&
                            <Segment attached='bottom'>
                                <Menu>
                                    <Menu.Item position="right">
                                        <Input name="search" value={ search ? search : ""}
                                               onChange={handleSearch}
                                               placeholder={  props.t('search') + "..."}    />
                                    </Menu.Item>
                                </Menu>
                                {partnerOrgs && filteredList(partnerOrgs).length > 0 ?
                                    filteredList(partnerOrgs).map(org => (
                                        <Segment key={org.id} raised>
                                            <Card history={props.history} key={org.id} obj={org} type="org" isLink={true}
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
                        {orgs && filteredList(orgs).length > 0 ?
                            filteredList(orgs).map(org => (
                                <Segment key={org.id} raised>
                                    <Card history={props.history}
                                          key={org.id}
                                          obj={org}
                                          type="org"
                                          isLink={true}
                                          ctx={getLinkContext(org)}/>
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

            {loader &&
                <Segment>
                    <Loader
                        active
                        content={
                            <p>{props.t('loading') +" : " + props.t('organization') }</p>
                        }
                        inline="centered"
                    />
                </Segment>
            }

        </div>
    );
};

export default withTranslation()(OrgList);

