
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
import orgAPI from '../../_services/orgAPI';
import Modal from "../../_components/Modal";
import OrgForm from "../_org/OrgForm";
import AddressForm2 from "../../_components/AddressForm2";
import addressAPI from "../../_services/addressAPI";
import Picture from "../../_components/Picture";
import authAPI from "../../_services/authAPI";

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
            }
        }else {
            return t('no_' + typeText)
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
    const filteredList = orgs.filter(u =>
        u.type.toLowerCase().includes(search.toLowerCase()) ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.phone && u.phone.toLowerCase().includes(search.toLowerCase()))
    )

    const [loader2, setLoader2] = useState(false)
    const [actionSelected, setActionSelected] = useState(undefined)
    const [show, setShow] = useState(false)
    const handleAction = ( type ) => {
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

    const handlePartner = () => {
        setLoader(true)
        if(selectedOrg.partner !== undefined ){
            selectedOrg.partner = false
        }else {
            selectedOrg.partner = true
        }
        orgAPI.put(selectedOrg)
            .then(() => {
            //    let o = orgs.find(o => o.id === selectedOrg.id)
      //          console.log(response)
                /*let index = orgs.indexOf(response.data[0])
                console.log(index)
                orgs.splice(index, 1, response.data[0]);*/
            })
            .catch(error => console.log(error))
            .finally( () => setLoader(false))
    }

    return (
        <Segment classname="card">
            <h1> {t("admin_orgs")}</h1>
            <Menu>
                <Dropdown item text='Action' loading={loader2}>
                    <Dropdown.Menu>
                        {selectedOrg &&
                        <>
                            <Dropdown.Item onClick={() => handleAction("editOrganization")}>
                                {t('edit') + " " + t('organization')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editAddress")}>
                                {t('edit') + " " + t('address')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={handlePartner}>
                                {!selectedOrg.partner && t('tag')}
                                {selectedOrg.partner && t('untag') }
                                {" " + t('partner')}
                            </Dropdown.Item>
                        </>
                        }
                        {!selectedOrg &&
                        <Dropdown.Item>
                            <Message size='mini' info>
                                {t("ask_select_org")}
                            </Message>
                        </Dropdown.Item>
                        }
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item position="right">
                    <Input
                        name="search"
                        value={ search ? search : ""}
                        onChange={handleSearch}
                        placeholder={ t('search') + "..."}
                    />

                </Menu.Item>
            </Menu>

            {!loader && orgs.length > 0 &&
            <Form>
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
            </Form>
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

        </Segment>
    )
}

export default withTranslation()(AdminOrgs)