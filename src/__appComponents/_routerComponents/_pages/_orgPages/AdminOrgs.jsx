
import {useTranslation, withTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {
    Menu,
    Form,
    Segment,
    Grid,
    Radio,
    Dropdown,
    Message,
    Input,
    Container,
    Loader,
    Item,
    Label
} from "semantic-ui-react";
import orgAPI from '../../../../__services/_API/orgAPI';
import Modal from "../__CommonComponents/Modal";
import OrgForm from "./OrgForm";
import AddressForm2 from "../__CommonComponents/AddressForm2";
import addressAPI from "../../../../__services/_API/addressAPI";
import Picture from "../__CommonComponents/Picture";
import authAPI from "../../../../__services/_API/authAPI";

import MultiSelect from "../__CommonComponents/forms/MultiSelect";

const AdminOrgs = ( history ) => {
    const { t,  i18n } = useTranslation()

    const [orgs, setOrgs] = useState([])
    const [selectedOrg, setSelectedOrg] = useState(undefined)
    const [error, setError] = useState( "")
    const [loader, setLoader] = useState(false)

    useEffect( ( ) => {
        setLoader(true)
        orgAPI.getMy()
            .then(response => {
         //       console.log(response.data)
                setOrgs(response.data)
            })
            .catch(error => {
                setError(error.response.data[0])
            })
            .finally( () => setLoader(false))
    }, [])

    const lg = i18n.language.split('-')[0]

    function getTranslate(o, typeText) {
        if(o[typeText]){
            if(o[typeText][lg]) {
                return o[typeText][lg]
            }else if(o[typeText]['en']) {
                return o[typeText]['en']
            }else {
                return t('no_' + lg + "_" + typeText)
            }
        }else {
            return t('no_' + lg + "_" + typeText )
        }
    }

    const handChange = (event, {value}) => {
        //  let  value  = event.currentTarget;
        let org = orgs.find(o => o.id === value)
        setSelectedOrg(org);
    }

    const [search, setSearch] = useState("")
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
    }
    const filteredList = orgs.filter(e =>
        e.type.toLowerCase().includes(search.toLowerCase())
        || getTranslate(e, "description").toLowerCase().includes(search.toLowerCase())
        || e.name.toLowerCase().includes(search.toLowerCase())
        || e.email.toLowerCase().includes(search.toLowerCase())
        || (e.phone && e.phone.toLowerCase().includes(search.toLowerCase()))
    )

    const [loader2, setLoader2] = useState(false)
    const [actionSelected, setActionSelected] = useState(undefined)
    const [show, setShow] = useState(false)
    const handleAction = ( type, org ) => {
        setSelectedOrg(org)
        setActionSelected(type)
        setShow(true)
        //    setLoader2(true)
    }

    const cancelForm = (e) => {
        e.preventDefault()
        hideModal()
    }

    const hideModal = () => {
        setShow(false)
        setActionSelected(undefined)
        setSelectedOrg(undefined)
        setLoader2(false)
    }

    const handleEditOrg = (updatedOrg) => {
        let index = orgs.indexOf(orgs.find(o => o.id === updatedOrg.id))
        orgs.splice(index, 1, updatedOrg);
    //    console.log(orgs)
        hideModal()
    }

    const handleAddress = () => {
        if(!authAPI.isAdmin()){
            history.replace('/')
        }
        setLoader2(true)
        if(selectedOrg.address.id !== undefined){
            addressAPI.put(selectedOrg.address)
                .then(response => {
                    let o = orgs.find(o => o.id === selectedOrg.id)
                    o.address = response.data[0];
                    let index = orgs.indexOf(o)
                    orgs.splice(index, 1, o);
                    hideModal()
                })
                .catch(error => console.log(error))
                .finally(()=>setLoader2(false))
        }else {
            addressAPI.post("org", selectedOrg.id, selectedOrg.address)
                .then(response => {
       //             console.log(response)
                    let o = orgs.find(o => o.id === selectedOrg.id)
                    o.address = response.data[0];
                    let index = orgs.indexOf(o)
                    orgs.splice(index, 1, o);
                    hideModal()
                })
                .catch(error => console.log(error))
                .finally(()=>setLoader2(false))
        }
    }

    const handlePartner = (org) => {
        setLoader(true)
        if(org.partner !== undefined ){
            org.partner = false
        }else {
            org.partner = true
        }
        orgAPI.put(org)
            .then((response) => {
               // let upOrg = orgs.find(o => o.id === org.id)
      //          console.log(response)
                let index = orgs.indexOf(response.data[0])
                console.log(index)
                orgs.splice(index, 1, response.data[0]);
            })
            .catch(error => console.log(error))
            .finally( () => setLoader(false))
    }

    const [orgDropSelected, setOrgDropSelected] = useState([])
    return (
        <div className="card">
            <h1> {t("admin_orgs")}</h1>
            <Menu >
                <MultiSelect
                    optionsList={orgs}
                    textKeyList={["id", "name", "type" ]}
                    setSelected={setOrgDropSelected}
                    loader={loader}
                />

            </Menu>

            {!loader && orgDropSelected.length > 0 &&
                orgDropSelected.map(o => (
                    <Segment basic key={o.id}>
                        <Menu className="unmarged" >
                            <Menu.Item>
                                <Item.Header>{ o.name }</Item.Header>
                                {o.partner &&  <Label color="blue" >{t('partner')}</Label>}
                            </Menu.Item>
                            <Menu.Menu position="right">
                                <Dropdown item compact text='Action' loading={loader2} >
                                    <Dropdown.Menu>
                                        <>
                                            <Dropdown.Item onClick={() => handleAction("editOrganization", o)}>
                                                {t('edit') + " " + t('organization')}
                                            </Dropdown.Item>
                                            {/*<Dropdown.Item onClick={() => handleAction("editEmail", o)}>
                                            {t('edit') + " " + t('email')}
                                        </Dropdown.Item>*/}
                                            <Dropdown.Item onClick={() => handleAction("editAddress", o)}>
                                                {t('edit') + " " + t('address')}
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handlePartner(o)}>
                                                {!o.partner &&  <Label color="blue" >{ t('tag') + " " + t('partner')}</Label>}
                                                {o.partner &&  <Label color="pink" >{ t('untag') + " " + t('partner')}</Label>}
                                            </Dropdown.Item>
                                            {/*<Dropdown.Item>
                                                        {t('delete') + " " + t("picture")}
                                                    </Dropdown.Item>*/}
                                            {/*<Dropdown.Item>
                                                        {t("delete")}
                                                    </Dropdown.Item>*/}
                                        </>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Menu>
                        </Menu>
                        <Segment.Group horizontal className="unmarged" >
                            <Segment className="w-25" >
                                <Picture size="tiny" picture={o.picture} />
                            </Segment>
                            <Segment  className="w-50 break-Word">
                                <Item>
                                    <Item.Content>
                                        <p>{getTranslate(o, "description")}</p>
                                    </Item.Content>
                                </Item>
                            </Segment>
                            <Segment  className="w-25">
                                <Item>
                                    <Item.Content>
                                        { o.address &&
                                        <Item.Description>
                                            <p>{ o.address.address ? o.address.address : t('address') + " " + t('not_specified') }</p>
                                            <p>{ o.address.complement ? o.address.complement : t('complement') + " " + t('not_specified') }</p>
                                            <p>
                                                <span> { o.address.zipCode } </span>
                                                <span> { o.address.city } </span>
                                                <span> { o.address.country } </span>
                                            </p>
                                        </Item.Description>
                                        }
                                        {!o.address &&
                                        <Item.Description> { t('address') + " " + t('not_specified') }</Item.Description>
                                        }

                                    </Item.Content>
                                </Item>
                            </Segment>

                        </Segment.Group>
                    </Segment>
                ))
            }

                {/*<Form>
                    <Form.Field>
                        <Grid textAlign='center' columns={4} celled="internally" stackable>
                            <Grid.Row>
                                <Grid.Column width="4"> { t('organization') } </Grid.Column>
                                <Grid.Column width="4"> { t('contact') } </Grid.Column>
                                <Grid.Column width="4"> { t('address') } </Grid.Column>
                                <Grid.Column width="4"> { t('picture') } </Grid.Column>
                            </Grid.Row>

                            {orgDropSelected.map( o => (
                                <Grid.Row key={o.id}>

                                    <div>

                                    </div>

                                    <Grid.Column>
                                         // TODO ActionMenu
                                        <Item.Header>
                                            {o.partner && <Label color="blue" corner="left" content={t('partner')} />}
                                            { o.name }
                                        </Item.Header>
                                    </Grid.Column>

                                    <Grid.Column>
                                        <Item>
                                            <Item.Content verticalAlign="middle">
                                                <Item.Description>
                                                    <p>{o.email}</p>
                                                    <p>{o.phone ? o.phone : t("phone") + " " + t("not_specified")}</p>
                                                </Item.Description>
                                            </Item.Content>
                                        </Item>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Item>
                                            <Item.Content>
                                                { o.address &&
                                                <Item.Description>
                                                    <p>{ o.address.address }</p>
                                                    <p>{ o.address.complement ? o.address.complement : t("complement") + " " + t('not_specified') }</p>

                                                </Item.Description>
                                                }
                                                {!o.address &&
                                                <Item.Description> { t('address') + " " + t('not_specified') }</Item.Description>
                                                }

                                            </Item.Content>
                                        </Item>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Picture size="tiny" picture={o.picture} />
                                    </Grid.Column>
                                </Grid.Row>
                                )
                            )}
                        </Grid>
                    </Form.Field>
                </Form>*/}

            { /* <Form>
                <Form.Field>
                    <Grid textAlign='center' columns={6} celled="internally" stackable>
                        <Grid.Row>
                            <Grid.Column> {t("organization")} </Grid.Column>
                            <Grid.Column> {t("type")}</Grid.Column>
                            <Grid.Column> {t("contact")}</Grid.Column>
                            <Grid.Column> {t("address")} </Grid.Column>
                            <Grid.Column> {t("description")} </Grid.Column>
                            <Grid.Column> picture </Grid.Column>
                        </Grid.Row>

                    {filteredList.map(o => (
                        <Grid.Row key={o.id}>
                            <Grid.Column>
                                <Form.Radio
                                    name="selected"
                                    control={Radio}
                                    value={o.id}
                                    checked={!!(selectedOrg && selectedOrg.id === o.id)}
                                    onChange={handChange}
                                />
                                <div>{o.partner &&
                                    <Label color="blue">{t('partner')} </Label>
                                }
                                </div>
                                {o.name}
                            </Grid.Column>
                            <Grid.Column>
                                {o.type}
                            </Grid.Column>
                            <Grid.Column>
                                <Item>
                                    <Item.Content verticalAlign="middle">
                                        <Item.Description>
                                            <p>{o.email}</p>
                                            <p>{o.phone ? o.phone : t("phone") + " " + t("not_specified")}</p>
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            </Grid.Column>
                            <Grid.Column>
                                <Grid columns={2} stackable>
                                    <Grid.Column>
                                        <Item>
                                            <Item.Content>
                                                { o.address &&
                                                <Item.Description>
                                                    <p>{ o.address.address }</p>
                                                    <p>{ o.address.complement ? o.address.complement : t("complement") + " " + t('not_specified') }</p>

                                                </Item.Description>
                                                }
                                                {!o.address &&
                                                <Item.Description> { t('address') + " " + t('not_specified') }</Item.Description>
                                                }

                                            </Item.Content>
                                        </Item>
                                    </Grid.Column>

                                    <Grid.Column>
                                        <Item>
                                            {o.address &&
                                            <Item.Description>
                                                <p>{o.address.city}</p>
                                                <p>{o.address.zipCode}</p>
                                                <p>{o.address.country}</p>
                                            </Item.Description>
                                            }
                                            {!o.address &&
                                            <Item.Description> { t('address') + " " + t('not_specified') }</Item.Description>
                                            }
                                        </Item>
                                    </Grid.Column>

                                </Grid>

                            </Grid.Column>
                            <Grid.Column>
                                <p>{getTranslate(o, "description")}</p>
                            </Grid.Column>
                            <Grid.Column>
                                <Picture size="tiny" picture={o.picture} />
                            </Grid.Column>
                        </Grid.Row>
                    ))}
                    </Grid>
                </Form.Field>
            </Form>*/
            }

            {!loader && filteredList.length === 0 &&
            <Container textAlign="center">
                <Message info>
                    <Message.Header> { t('search') }</Message.Header>
                    <p>{ t('no_result') }</p>
                </Message>
            </Container>
            }

            {!loader && error &&
            <Message negative>
                <Message.Header> { t('errors') }</Message.Header>
                <p>{ error }</p>
            </Message>
            }

            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{ t('loading') +" : " +  t('organization') + "s" }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }

            <Modal show={show} handleClose={hideModal} title={ t(actionSelected) } >
                <div className="card">
                    {selectedOrg &&
                    <>
                        <div className="messageBox">
                            {actionSelected === "editOrganization" &&
                             <OrgForm
                                 org={selectedOrg}
                                 setter={setSelectedOrg}
                                 hideModal={hideModal}
                                 handleEditOrg={handleEditOrg}
                             />
                            }
                            {actionSelected === "editAddress" &&
                            <AddressForm2
                                handleSubmit={handleAddress}
                                obj={selectedOrg} setObj={setSelectedOrg}
                                errors={error} loader={loader2}
                                handleCancel={cancelForm}
                            />
                            }
                        </div>
                    </>
                    }

                    {!selectedOrg &&
                    <div> { t('errors')} </div>
                    }

                </div>
            </Modal>

        </div>
    )
}

export default withTranslation()(AdminOrgs)