
import React, { useState, useEffect } from 'react'
import {Input, Menu, Label, Radio, Dropdown, Button, Item, Message, Container, Grid, Loader, Segment, Form} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import Picture from "../../_components/Picture";
import User from "../../_components/cards/user";
import Modal from "../../_components/Modal";
import AddressForm2 from "../../_components/AddressForm2";
import UserCoordForm from "../_user/UserCoordForm";
import addressAPI from "../../_services/addressAPI";
import authAPI from "../../_services/authAPI";
import userAPI from "../../_services/userAPI";
import ChangeEmailForm from "../../_components/forms/user/ChangeEmailForm";


const AdminUsers = () => {
    const { t } = useTranslation()

    const [users, setUsers] = useState([])
    const [error, setError] =useState("")
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        setLoader(true)
        userAPI.get("all")
            .then(response => {
                setUsers(response.data)
            })
            .catch(error => {
                setError(error.response.data[0])
            })
            .finally( () => setLoader(false))
    },[])

    console.log(users)
    const [search, setSearch] = useState("")
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
    }

    const filteredList = users.filter(u =>
        u.firstname.toLowerCase().includes(search.toLowerCase()) ||
        u.lastname.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.phone && u.phone.toLowerCase().includes(search.toLowerCase())) ||
        (u.mobile && u.mobile.toLowerCase().includes(search.toLowerCase())) ||
        (u.address && u.address.address.toLowerCase().includes(search.toLowerCase())) ||
        (u.address && u.address.complement.toLowerCase().includes(search.toLowerCase())) ||
        (u.address && u.address.city.toLowerCase().includes(search.toLowerCase())) ||
        (u.address && u.address.zipCode.toLowerCase().includes(search.toLowerCase())) ||
        (u.address && u.address.country.toLowerCase().includes(search.toLowerCase()))
    )

    const [loader2, setLoader2] = useState(false)
    const [actionSelected, setActionSelected] = useState(undefined)
    const handleAction = ( type ) => {
        setActionSelected(type)
        setShow(true)
    //    setLoader2(true)
    }

    const [selectedUser, setSelectedUser] = useState(undefined)
    const handChange = (event, {value}) => {
        //  let  value  = event.currentTarget;
        let user = users.find(u => u.id === value)
        setSelectedUser(user);
    }

    const [show, setShow] = useState(false)

    const cancelForm = (e) => {
        e.preventDefault()
        hideModal()
    }

    const hideModal = () => {
        setShow(false)
        setActionSelected(undefined)
        setSelectedUser(undefined)
        setLoader2(false)
    }

    const handleEnabling = () => {
        setLoader2(true)
        if(selectedUser.roles !== "ROLE_ADMIN"){
            userAPI.activ(selectedUser.id, selectedUser.roles !== "ROLE_USER")
                .then(response => {
                    console.log(response.data[0])
                    let u = users.find(u => u.id === selectedUser.id)
                    u.roles = response.data[0]
                    let index = users.indexOf(u)
                    users.splice(index, 1, u);
                    hideModal()
                })
                .catch(error => {
                    console.log(error.response.data)
                })
                .finally(()=>setLoader2(false))
        }
    }

    const handleProfile = () => {
        setLoader2(true)
        userAPI.put(selectedUser)
            .then(response => {
                console.log(response.data)
                let index = users.indexOf(users.find(u => u.id === selectedUser.id))
                users.splice(index, 1, response.data[0]);
                hideModal()
            })
            .catch(error => console.log(error))
            .finally(() => setLoader2(false))
    }

    const handleAddress = () => {
        setLoader2(true)
  //      console.log(selectedUser)
        addressAPI.put(selectedUser.address)
            .then(response => {
                console.log(response)
                let u = users.find(u => u.id === selectedUser.id)
                u.address = response.data[0];
                let index = users.indexOf(u)
                users.splice(index, 1, u);
                hideModal()
            })
            .catch(error => console.log(error))
            .finally(()=>setLoader2(false))
    }

    const handleEmail = () => {
        setLoader2(true)
        authAPI.resetEmail(selectedUser.email, selectedUser.id)
            .then(response => {
                if(selectedUser.id === authAPI.getId()){
                    authAPI.refresh(response.data.token)
                    console.log(response.data.token)
                }
                let index = users.indexOf(users.find(u => u.id === selectedUser.id))
                users.splice(index, 1, response.data[0]);
                hideModal()
            })
            .catch(error => console.log(error.response.data))
            .finally(()=>setLoader2(false))
    }

//    console.log(selectedUser)

    return (
        <Segment classname="card">
            <h1>Administration des utilisateurs</h1>
            <Menu >
                <Dropdown item text='Action' loading={loader2}>
                    <Dropdown.Menu>
                        {selectedUser &&
                        <>
                            <Dropdown.Item onClick={() => handleAction("editUser")}>
                                {t('edit') + " " + t('user')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editEmail")}>
                                {t('edit') + " " + t('email')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editAddress")}>
                                {t('edit') + " " + t('address')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={handleEnabling}>
                                {selectedUser.roles === "ROLE_DISABLE" ? t('enable') : t('disable') }
                            </Dropdown.Item>
                        </>
                        }
                        {!selectedUser &&
                        <Dropdown.Item>
                            <Message size='mini' info>
                                Veuillez selectionner un utilisateur
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
            {!loader && users.length > 0 &&
        <Form>
            <Form.Field>
                <Grid textAlign='center' columns={4} celled="internally" stackable>
                    <Grid.Row>
                        <Grid.Column width="4"> { t('user') } </Grid.Column>
                        <Grid.Column width="4"> { t('contact') } </Grid.Column>
                        <Grid.Column width="4"> { t('address') } </Grid.Column>
                        <Grid.Column width="4"> { t('action') } </Grid.Column>
                    </Grid.Row>
                    {filteredList.map( u => (
                        <Grid.Row key={u.id}>
                            <Grid.Column>
                                <Form.Radio
                                    name="selected"
                                    control={Radio}
                                    value={u.id}
                                    checked={!!(selectedUser && selectedUser.id === u.id)}
                                    onChange={handChange}
                                />
                                <p>{ u.roles === "ROLE_DISABLE" ?
                                    <Label color="pink">{t('disabled')} </Label>
                                    :
                                    <Label color="blue">{t('enabled') } </Label>
                                }
                                </p>
                                <Item.Header >{ u.firstname + " " + u.lastname }</Item.Header>
                            </Grid.Column>
                            <Grid.Column>
                                <Item>

                                    <Item.Content verticalAlign='middle'>
                                        <Item.Description>
                                            <p>{ u.email }</p>
                                            <p>{ u.mobile ? u.mobile : t('not_specified') }</p>
                                            <p>{ u.phone ? u.phone : t('not_specified') }</p>
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            </Grid.Column>
                            <Grid.Column>
                                <Grid columns={2} stackable>
                                    <Grid.Column>
                                        <Item>
                                            <Item.Content>
                                                { u.address &&
                                                <Item.Description>
                                                    <p>{ u.address.address }</p>
                                                    <p>{ u.address.complement ? u.address.complement : t('not_specified') }</p>

                                                </Item.Description>
                                                }
                                                {!u.address &&
                                                <Item.Description> { t('address') + " " + t('not_specified') }</Item.Description>
                                                }

                                            </Item.Content>
                                        </Item>
                                    </Grid.Column>

                                    <Grid.Column>
                                        <Item>
                                            {u.address &&
                                            <Item.Description>
                                                <p>{u.address.city}</p>
                                                <p>{u.address.zipCode}</p>
                                                <p>{u.address.country}</p>
                                            </Item.Description>
                                            }
                                            {!u.address &&
                                            <Item.Description> { t('address') + " " + t('not_specified') }</Item.Description>
                                            }
                                        </Item>
                                    </Grid.Column>

                                </Grid>

                            </Grid.Column>
                            <Grid.Column>
                                <Picture size="tiny" picture={u.picture} />

                            {/*    <DropdownAction user={u} />*/}


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
                            <p>{ t('loading') +" : " +  t('project') }</p>
                        }
                        inline="centered"
                    />
                </Segment>
            }

            <Modal show={show} handleClose={hideModal} title={ t(actionSelected) } >
                <div className={"card"}>
                    {selectedUser &&
                    <>
                        <div className="messageBox">
                            {actionSelected === "editUser" &&
                                <UserCoordForm handleSubmit={handleProfile} errors={error} loader={loader2} handleCancel={cancelForm} setUser={setSelectedUser} user={selectedUser}/>
                                /*handler, user, setUser, error, loader, handleCancel */
                            }
                            {actionSelected === "editEmail" &&
                                <ChangeEmailForm handleSubmit={handleEmail} errors={error} loader={loader2} handleCancel={cancelForm} setUser={setSelectedUser} user={selectedUser} />
                            }
                            {actionSelected === "editAddress" &&
                          /*  handler, user, setUser, errors, loader, handleCancel*/
                                <AddressForm2
                                    handleSubmit={handleAddress}
                                    obj={selectedUser} setObj={setSelectedUser}
                                    errors={error} loader={loader2}
                                    handleCancel={cancelForm}
                                />
                            }
                        </div>
                        <div className="btnBox">
                          {/*  <button type="button" className="btn btn-primary" onClick={() => hideModal()}>
                                { t('close')}
                            </button>*/}
{/*
                            {actionSelected === "enable" &&
                                <button type="button" className="btn btn-secondary" onClick={ handleEnabling}>{ t('confirm')}</button>
                            }
                            {actionSelected === "editUser" &&
                                <button type="button" className="btn btn-secondary" onClick={handleProfile}>{ t('save')}</button>
                            }
                            {actionSelected === "editAddress" &&
                                <button type="button" className="btn btn-secondary" onClick={ handleAddress}>{ t('save')}</button>
                            }*/}
                        </div>
                    </>
                    }

                    {!selectedUser &&
                    <p> { t('errors')} </p>
                    }

                </div>
            </Modal>
        </Segment>
    )
}

export default withTranslation()(AdminUsers)

/*
<Item>
      <Item.Image size='tiny' src='https://react.semantic-ui.com/images/wireframe/image.png' />

      <Item.Content>
        <Item.Header as='a'>Header</Item.Header>
        <Item.Meta>Description</Item.Meta>
        <Item.Description>
          <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
        </Item.Description>
        <Item.Extra>Additional Details</Item.Extra>
      </Item.Content>
    </Item>
 */