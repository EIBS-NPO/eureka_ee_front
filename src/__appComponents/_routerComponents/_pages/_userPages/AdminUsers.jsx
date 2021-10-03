
import React, {useState, useEffect, useContext} from 'react'
import {
    Menu,
    Label,
    Dropdown,
    Item,
    Message,
    Container,
    Loader,
    Segment,
    Header
} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import Picture from "../__CommonComponents/Picture";
import Modal from "../__CommonComponents/Modal";

import adminAPI from "../../../../__services/_API/adminAPI";

import AddressForm2 from "../__CommonComponents/AddressForm2";
import UserCoordForm from "./UserCoordForm";
import addressAPI from "../../../../__services/_API/addressAPI";
import authAPI from "../../../../__services/_API/authAPI";
import userAPI from "../../../../__services/_API/userAPI";
import ChangeEmailForm from "./_components/_ATTENTION/ChangeEmailForm";
import AuthContext from "../../../../__appContexts/AuthContext";
import MultiSelect from "../__CommonComponents/forms/MultiSelect";


const AdminUsers = ( history ) => {
  //  if ( !(authAPI.isAuthenticated()) ) {history.replace('/login')}
    const { t } = useTranslation()
    const {setFirstname, setLastname} = useContext(AuthContext);

    const [users, setUsers] = useState([])
    const [error, setError] =useState("")
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if(!authAPI.isAdmin()){
            history.replace('/')
        }
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

    /*const countryOptions = [
        { key: 'af', value: 'af', flag: 'af', text: 'Afghanistan' },
        { key: 'ax', value: 'ax', flag: 'ax', text: 'Aland Islands' }
    ]*/

    const optionsUsers = () => {
        let options = []
        /*users.filter(u => !userDropSelected.includes(u)).map((user, key) => {*/
        users.map((user, key) => {
            options.push({key:user.id, value:user.id, text:
                user.id + " "
                + user.email + " "
                + user.firstname + " "
                + user.lastname
            })
        })
        return options
    }

    const [search, setSearch] = useState("")
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
    }


    /*const filteredList = users.filter(u =>
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
    )*/

    const [loader2, setLoader2] = useState(false)
    const [actionSelected, setActionSelected] = useState(undefined)
    const [show, setShow] = useState(false)
    const handleAction = ( type, user ) => {
        setSelectedUser(user)
        setActionSelected(type, user)
        setShow(true)
    //    setLoader2(true)
    }

    const [selectedUser, setSelectedUser] = useState(undefined)
    /*const handChange = (event, {value}) => {
        //  let  value  = event.currentTarget;
        let user = users.find(u => u.id === value)
        setSelectedUser(user);
    }*/

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

    const handleEnabling = (user) => {
        setLoader2(true)
        if(user.roles !== "ROLE_ADMIN"){
            adminAPI.activ(user.id, user.roles !== "ROLE_USER")
                .then(response => {

                    let userUp = users.find(u => u.id === user.id)
                    userUp.roles = response.data[0]
                    let index = users.indexOf(userUp)
                    users.splice(index, 1, userUp);
                    index = userDropSelected.indexOf(userDropSelected.find(u => u.id === userUp.id))
                    userDropSelected.splice(index, 1, userUp);
                    hideModal()
                })
                .catch(error => {
                    console.log(error.data)
                })
                .finally(()=>setLoader2(false))
        }
    }

    const handleProfile = () => {
        setLoader2(true)
        adminAPI.putUser(selectedUser)
            .then(response => {
        //        console.log(response.data)
                let index = users.indexOf(users.find(u => u.id === selectedUser.id))
                users.splice(index, 1, response.data[0]);
                index = userDropSelected.indexOf(userDropSelected.find(u => u.id === selectedUser.id))
                userDropSelected.splice(index, 1, response.data[0]);
                if(authAPI.getUserMail() === response.data[0].email){
                    setFirstname(response.data[0].firstname)
                    setLastname(response.data[0].lastname)
                }
                console.log(userDropSelected)
                hideModal()
            })
            .catch(error => console.log(error))
            .finally(() => setLoader2(false))
    }

    const handleAddress = () => {
        setLoader2(true)
        if(selectedUser.address.id !== undefined){
            addressAPI.put(selectedUser.address)
                .then(response => {
           //         console.log(response)
                    let u = users.find(u => u.id === selectedUser.id)
                    u.address = response.data[0];
                    let index = users.indexOf(u)
                    users.splice(index, 1, u);
                    hideModal()
                })
                .catch(error => console.log(error))
                .finally(()=>setLoader2(false))
        }else {
            addressAPI.post("user", selectedUser.id, selectedUser.address)
                .then(response => {
          //      console.log(response)
                let u = users.find(u => u.id === selectedUser.id)
                u.address = response.data[0];
                let index = users.indexOf(u)
                users.splice(index, 1, u);
                hideModal()
            })
                .catch(error => console.log(error))
                .finally(()=>setLoader2(false))
        }

    }

    const handleEmail = () => {
        setLoader2(true)
        authAPI.resetEmail(selectedUser.email, selectedUser.id)
            .then(response => {
                if(selectedUser.id === authAPI.getId()){
                    authAPI.refresh(response.data.token)
         //           console.log(response.data.token)
                }
                let index = users.indexOf(users.find(u => u.id === selectedUser.id))
                users.splice(index, 1, response.data[0]);
                hideModal()
            })
            .catch(error => console.log(error.response.data))
            .finally(()=>setLoader2(false))
    }

const [userDropSelected, setUserDropSelected] = useState([])
    const onChangeUsersDrop = (event, data) => {
        /*if(event.target.textContent === 'Select All') {
            setUserDropSelected(data.options.map(d => d.value))
        } else {*/
        let arr = []
        data.value.map(vId => arr.push(users.find( u => u.id === vId)))
        setUserDropSelected(arr);
      /*  }*/
    };

 //   console.log(document.getElementById("userDropSelect"))
    /*const DisplaySelected = () => {
        let selected = document.getElementById("userDropSelect").valueOf()
        console.log(selected)
        /!*selected.map((u,key)=>{
            <p>{u}</p>
        })*!/
    }*/

    return (
        <div className="card">
            <h1> {t("admin_users")}</h1>
            <MultiSelect
                optionsList={users}
                textKeyList={["id", "email", "firstname", "lastname" ]}
                setSelected={setUserDropSelected}
                loader={loader}
            />
            {/*<Menu >
                <Dropdown
                    id="userDropSelect"
                    clearable
                    fluid
                    multiple
                    search
                    selection
                    closeOnChange
                    options={optionsUsers()}
                    onChange={onChangeUsersDrop}
                    placeholder='Select user'
                    loading={loader}
                />

            </Menu>*/}

            {!loader && userDropSelected.length > 0 &&
                userDropSelected.map( u => (
                    <Segment basic key={u.id}>
                        <Menu className="unmarged" >
                            <Menu.Item>
                                <Item.Header >{ u.firstname + " " + u.lastname }</Item.Header>
                            </Menu.Item>
                            <Menu.Item>
                                { u.roles === "" && <Header color='pink'> {t('disabled')} </Header>}
                                { u.roles === "ROLE_USER" && <Header color='green'> {t('user')} </Header>}
                                { u.roles === "ROLE_ADMIN" && <Header color='violet'> {t('administrator')} </Header>}
                            </Menu.Item>
                            <Menu.Menu position="right" >
                                <Dropdown item text={t('action')} loading={loader2} >
                                    <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleAction("editUser", u)}>
                                                {t('edit') + " " + t('user')}
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleAction("editEmail", u)}>
                                                {t('edit') + " " + t('email')}
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleAction("editAddress", u)}>
                                                {t('edit') + " " + t('address')}
                                            </Dropdown.Item>
                                            {/*<Dropdown.Item>
                                            {t('delete') + " " + t("picture")}
                                                </Dropdown.Item>*/}
                                            { u.roles !== "ROLE_ADMIN" &&
                                                <Dropdown.Item onClick={() => handleEnabling(u)}>
                                                    {/*<Button onClick={() => handleEnabling(u)}
                                                            color={ u.roles === "" ? "blue" : "pink"}
                                                    >{ u.roles === "" ? t('enable') : t('disable') }
                                                    </Button>*/}
                                                    { u.roles === "" ?
                                                        <Label color="blue">{t('enable')} </Label>
                                                        :
                                                        <Label color="pink">{t('disable') } </Label>
                                                    }
                                                </Dropdown.Item>
                                            }

                                            {/*<Dropdown.Item>
                                            {t("delete")}
                                                </Dropdown.Item>*/}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Menu>
                        </Menu>
                        <Segment.Group horizontal className="unmarged" >
                            <Segment>
                                <Picture size="tiny" picture={u.picture} />
                            </Segment>
                            <Segment>
                                <Item>

                                    <Item.Content verticalAlign='middle'>
                                        <Item.Description>
                                            <Label
                                                as={u.email === userAPI.checkMail() ? "a:disabled" : "a"}
                                                basic color={u.email === userAPI.checkMail()? '': 'teal'}
                                                href={"mailto:" + u.email} icon='mail' content={u.email}

                                            />
                                            <p>{ u.mobile ? u.mobile : t('not_specified') }</p>
                                            <p>{ u.phone ? u.phone : t('not_specified') }</p>
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            </Segment>
                            <Segment>
                                <Item>
                                    <Item.Content>
                                        { u.address &&
                                        <Item.Description>
                                            <p>{ u.address.address ? u.address.address : t('address') + " " + t('not_specified') }</p>
                                            <p>{ u.address.complement ? u.address.complement : t('complement') + " " + t('not_specified') }</p>
                                            <p>
                                                <span> { u.address.zipCode } </span>
                                                <span> { u.address.city } </span>
                                                <span> { u.address.country } </span>
                                            </p>
                                        </Item.Description>
                                        }
                                        {!u.address &&
                                        <Item.Description> { t('address') + " " + t('not_specified') }</Item.Description>
                                        }

                                    </Item.Content>
                                </Item>
                            </Segment>
                        </Segment.Group>
                    </Segment>
                ))

                /*<>
                    <Form>
                    <Form.Field>
                        <Grid textAlign='center' columns={4} celled="internally" stackable>
                            <Grid.Row>
                                <Grid.Column width="4"> { t('user') } </Grid.Column>
                                <Grid.Column width="4"> { t('contact') } </Grid.Column>
                                <Grid.Column width="4"> { t('address') } </Grid.Column>
                                <Grid.Column width="4"> { t('picture') } </Grid.Column>
                            </Grid.Row>

                            {userDropSelected.map( u => (
                                <Grid.Row key={u.id}>
                                    <Grid.Column>
                                        <Item>
                                            <Dropdown item text='Action' loading={loader2}>
                                                <Dropdown.Menu>
                                                    <>
                                                        <Dropdown.Item onClick={() => handleAction("editUser", u)}>
                                                            {t('edit') + " " + t('user')}
                                                        </Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleAction("editEmail", u)}>
                                                            {t('edit') + " " + t('email')}
                                                        </Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleAction("editAddress", u)}>
                                                            {t('edit') + " " + t('address')}
                                                        </Dropdown.Item>
                                                        {/!*<Dropdown.Item>
                                                            {t('delete') + " " + t("picture")}
                                                        </Dropdown.Item>*!/}
                                                        <Dropdown.Item onClick={() => handleEnabling(u)}>
                                                            {u.roles === "" ? t('enable') : t('disable') }
                                                        </Dropdown.Item>
                                                        {/!*<Dropdown.Item>
                                                            {t("delete")}
                                                        </Dropdown.Item>*!/}
                                                    </>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Item>


                                        { u.roles === "" ?
                                            <Label color="pink">{t('disabled')} </Label>
                                            :
                                            <Label color="blue">{t('enabled') } </Label>
                                        }
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
                                    </Grid.Column>
                                </Grid.Row>
                            ))}
                        </Grid>
                    </Form.Field>
                </Form>
                </>*/

            }

            {!loader && userDropSelected.length === 0 &&
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
                            <p>{ t('loading') +" : " +  t('user') }</p>
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
                    </>
                    }

                    {!selectedUser &&
                    <p> { t('errors')} </p>
                    }

                </div>
            </Modal>
        </div>
    )
}

export default withTranslation()(AdminUsers)