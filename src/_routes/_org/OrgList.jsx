import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import orgAPI from "../../_services/orgAPI";
import {Container, Header, Input, Loader, Menu, Message, Segment} from "semantic-ui-react";
import Card from "../../_components/Card";
import authAPI from "../../_services/authAPI";

const OrgList = ( props ) => {
 //   const isAuth = useContext(AuthContext).isAuthenticated;

    const urlParams = props.match.params.ctx

    //forbiden if route for my org wwith no auth
    const checkCtx = () => {
        if (urlParams !=="public" && !authAPI.isAuthenticated()) {
            //if ctx need auth && have no Auth, public context is forced
            authAPI.logout()
        }else {return urlParams}
    }

    const [ctx, setCtx] = useState("")

    const [orgs, setOrgs] = useState([])
    const [myOrgs, setMyOrgs] = useState([])
    const [partnerOrgs, setPartnerOrgs] =useState([])

    const [loader, setLoader] = useState();

    //todo charger les referent dans un tableau a part pour limiter les requetes doublons
    //donc les object seriliser org du back ne doivent reoutourner que l'id des ref
    useEffect(() => {
        setLoader(true)
        //todo inversion des call
        setCtx( checkCtx() )
        if(urlParams === 'my'){
            orgAPI.getMembered()
                .then(response => {
   //                 console.log(response)
                    setMyOrgs(response.data.filter(o => o.referent.id === authAPI.getId()))
                    setPartnerOrgs(response.data.filter(o => o.referent.id !== authAPI.getId()))
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }else {
            orgAPI.getPublic()
                .then(response => {
//                    console.log(response)
                    setOrgs(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
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
            { ctx === 'my' && <h1>{ props.t('my_orgs') }</h1> }
            { ctx !== 'my' && <h1>{ props.t('all_org') }</h1> }
                <>
                    {ctx === "my" &&
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

                    {ctx !== "my" &&
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
                                    <Card history={props.history} key={org.id} obj={org} type="org" isLink={true} ctx={ctx}/>
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

