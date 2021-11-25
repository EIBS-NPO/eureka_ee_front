
import React, {useContext, useEffect, useState} from 'react';
import { withTranslation } from 'react-i18next';
import {Container, Header, Input, Menu, Message, Segment} from "semantic-ui-react";
import Card from "../components/Card";
import authAPI from "../../__services/_API/authAPI";
import AuthContext from "../../__appContexts/AuthContext";
import {ContentContainer} from "../components/Loader";
import {HandleGetOrgs} from "../../__services/_Entity/organizationServices";

const OrgPage_List = (props ) => {
    const { isAuthenticated } = useContext(AuthContext)

    const urlParams = props.match.params.ctx

    const checkCtx = async () => {
        return urlParams
    }

    const [ctx, setCtx] = useState("")

    const getLinkContext = (org) => {
        let linkCtx = 'public'
        if(isAuthenticated){
            if(org.referent.id === authAPI.getId()) { linkCtx = 'owned'}
            else if(org.membership && org.membership.find(m => m.id === authAPI.getId()) !== undefined){ linkCtx = 'assigned'}
        }
        return linkCtx
    }

    const [orgs, setOrgs] = useState([])
    const [partnerOrgs, setPartnerOrgs] =useState([])

    const [loader, setLoader] = useState(false);

    //todo errors
    const [errors, setErrors] = useState("")

    useEffect(() => {

        async function fetchData(){
            checkCtx()
                .then(async (ctx) => {
                    setCtx(ctx)

                    await HandleGetOrgs(
                        {access:ctx},
                        setOrgs,
                        setLoader,
                        setErrors,
                        props.history
                    )

                    if(ctx === "owned"){ //if owned ctx get assigned too
                        await HandleGetOrgs(
                            {access:"assigned"},
                            setPartnerOrgs,
                            setLoader,
                            setErrors,
                            props.history
                        )
                    }

                })
        }

        fetchData()

        //dismiss unmounted warning
        return () => {
            setOrgs({});
            setPartnerOrgs({});
        };
    }, [urlParams]);

    const [activeItem, setActiveItem] = useState('myOrgs')

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
        <ContentContainer
            loaderActive={loader}
            loaderMsg={ props.t('loading') +" : " + props.t('organizations') }
        >
            { ctx === 'owned' && <h1>{ props.t('my_orgs') }</h1> }
            { ctx !== 'owned' && <h1>{ props.t('all_org') }</h1> }
                <>
                    {ctx === "owned" &&
                    <>
                        <Segment vertical>
                            <Menu attached='top' tabular>
                                <Menu.Item name='myOrgs' active={activeItem === 'myOrgs'}
                                           onClick={(e, { name }) => setActiveItem(name)}>
                                    <Header>
                                        {props.t("my_plural") + " " + props.t("organization") + "s"}
                                    </Header>
                                </Menu.Item>
                                <Menu.Item name='myPartners' active={activeItem === 'myPartners'}
                                           onClick={(e, { name }) => setActiveItem(name)}>
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
                                {orgs && filteredList(orgs).length > 0 ?
                                    filteredList(orgs).map(org => (
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

                    {ctx !== "owned" && !loader &&
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

        </ContentContainer>
    );
};

export default withTranslation()(OrgPage_List);

