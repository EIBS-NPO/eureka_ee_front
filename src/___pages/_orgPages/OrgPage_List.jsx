
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation, withTranslation} from 'react-i18next';
import {Container, Header, Input, Menu, Message, Segment} from "semantic-ui-react";
import Card from "../components/entityViews/Card";
import authAPI from "../../__services/_API/authAPI";
import AuthContext from "../../__appContexts/AuthContext";
import {ContentContainer} from "../components/Loader";
import {HandleGetOrgs} from "../../__services/_Entity/organizationServices";
import SearchInput from "../components/menus/components/ListFilter";

const OrgPage_List = (props ) => {
    const { isAuthenticated } = useContext(AuthContext)
    const { i18n } = useTranslation()
    const urlParams = props.match.params.ctx

    const checkCtx = async () => {
        return urlParams
    }

    const [ctx, setCtx] = useState("")

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
            setOrgs([]);
            setPartnerOrgs([]);
        };
    }, [urlParams]);

    const [activeItem, setActiveItem] = useState('myOrgs')

    const [filteredOrgs, setFilteredOrgs] = useState([])
    const [filteredPartnersOrgs, setFilteredPartnersOrgs] = useState([])

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
                                <Menu.Item position="right">
                                    <SearchInput
                                        elementList={ orgs }
                                        setResultList={ setFilteredOrgs }
                                        researchFields={{
                                            main: ["name"],
                                            description:[ i18n.language ],
                                            referent: ["firstname", "lastname"]
                                        }}
                                        isDisabled ={ loader }
                                    />
                                </Menu.Item>
                                {orgs && filteredOrgs.length > 0 ?
                                    filteredOrgs.map(org => (
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
                                <Menu.Item position="right">
                                    <SearchInput
                                        elementList={ partnerOrgs }
                                        setResultList={ setFilteredPartnersOrgs }
                                        researchFields={{
                                            main: ["name"],
                                            description:[ i18n.language ],
                                            referent: ["firstname", "lastname"]
                                        }}
                                        isDisabled ={ loader }
                                    />
                                </Menu.Item>
                                {filteredPartnersOrgs && filteredPartnersOrgs.length > 0 ?
                                    filteredPartnersOrgs.map(org => (
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
                        <Menu.Item position="right">
                            <SearchInput
                                elementList={ orgs }
                                setResultList={ setFilteredOrgs }
                                researchFields={{
                                    main: ["name"],
                                    description:[ i18n.language ],
                                    referent: ["firstname", "lastname"]
                                }}
                                isDisabled ={ loader }
                            />
                        </Menu.Item>
                        {orgs && filteredOrgs.length > 0 ?
                            filteredOrgs.map(org => (
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
                    </>
                    }
                </>

        </ContentContainer>
    );
};

export default withTranslation()(OrgPage_List);

