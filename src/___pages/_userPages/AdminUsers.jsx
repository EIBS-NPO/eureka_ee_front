
import React, {useState, useEffect, useContext} from 'react'
import {Menu, Label, Dropdown, Item, Message, Container, Loader, Segment, Header} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import Picture from "../components/Picture";
import Modal from "../components/Modal";

import AddressForm2 from "../components/forms/_ATTENTION/AddressForm3";
import addressAPI from "../../__services/_API/addressAPI";
import authAPI from "../../__services/_API/authAPI";
import userAPI from "../../__services/_API/userAPI";
import ChangeEmailForm from "../components/forms/_ATTENTION/ChangeEmailForm";
import AuthContext from "../../__appContexts/AuthContext";
import MultiSelect from "../components/menus/components/MultiSelect";

import SearchBar from "../components/menus/components/search/SearchBar";
import UserProfileForm from "./UserProfileForm";
import ManageUser from "../components/ManageUser";

const AdminUsers = () => {
    const { t } = useTranslation()
    const {setFirstname, setLastname} = useContext(AuthContext);

    const [users, setUsers] = useState([])
    const [error, setError] =useState("")
    const [loader, setLoader] = useState(false)

    //todo make FilterList
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
    const [actionSelected, setActionSelected] = useState("")
    const [show, setShow] = useState(false)
    const handleAction = ( type, user ) => {
        if(type === "handleEnabling"){
            handleEnabling(user)
        }else{
            setSelectedUser(user)
            setActionSelected(type, user)
            setShow(true)
        }

    //    setLoader2(true)
    }

    const [selectedUser, setSelectedUser] = useState(undefined)

    const cancelForm = (e) => {
        e.preventDefault()
        hideModal()
    }

    const hideModal = () => {
        setShow(false)
        setActionSelected("")
        setSelectedUser(undefined)
        setLoader2(false)
    }

    //todo actualise with response
    const handleEnabling = (user) => {
        setLoader2(true)
        if(user.roles !== "ROLE_ADMIN"){
         //   adminAPI.activ(user.id, user.roles !== "ROLE_USER")
            userAPI.put(user,null, {"roles":!(user.roles === "ROLE_USER")})
                .then(response => {
console.log(response)
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
        userAPI.put(selectedUser, null, {admin:true})
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

    return (
        <div className="card">
            <h1> {t("admin_users")}</h1>
            <Menu vertical fluid>
                    <SearchBar setData={setUsers} setDropedData={setUserDropSelected} searchFor="user" forAdmin={true}/>
                <Menu.Item disabled={users.length <= 0}>
                    <MultiSelect
                        optionsList={users}
                        textKeyList={["id", "email", "firstname", "lastname" ]}
                        setSelected={setUserDropSelected}
                        placeholder={t('ask_select_user')}
                        loader={loader}
                    />
                </Menu.Item>
            </Menu>


            {!loader && userDropSelected.length > 0 &&
                userDropSelected.map( u => (
                    <ManageUser user={u} handleAction={handleAction} loader={loader2}/>
                ))
            }

            {!loader && userDropSelected.length === 0 && users.length === 0 &&
                <Container textAlign="center">
                    <Message info>
                        <Message.Header> { t('search') }</Message.Header>
                        <p>{ t('no_result') }</p>
                    </Message>
                </Container>
            }

            {!loader && userDropSelected.length === 0 && users.length > 0 &&
            <Container textAlign="center">
                <Message info>
                    <p>{ t('ask_select_user') }</p>
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
                                /*<UserCoordForm handleSubmit={handleProfile} errors={error} loader={loader2} handleCancel={cancelForm} setUser={setSelectedUser} user={selectedUser}/>*/
                                /* //todo use UserForm into userProfile, need separate before*/
                                <UserProfileForm user={selectedUser} setterUser={setSelectedUser}/>
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