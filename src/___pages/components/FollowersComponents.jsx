
import React, {useContext, useEffect, useState} from "react";
import {
    Button,
    Container, Divider,
    Form, Header,
    Icon,
    Item,
    Loader,
    Menu,
    Message,
    Segment,
    Select,
    Table
} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import userAPI from "../../__services/_API/userAPI";
import authAPI from "../../__services/_API/authAPI";
import Card from "./Card";
import AuthContext from "../../__appContexts/AuthContext";
import {HandleGetUsers} from "../../__services/_Entity/userServices";
import {ConfirmActionForm} from "./forms/formsServices";
import {SearchUserForm} from "./entityForms/UserForms";
import {BtnRemove } from "./Buttons";
import {LoaderWithMsg} from "./Loader";
import {UserCard} from "./entityViews/UserViews";


//todo not use for the moment
export const FollowingFormInput = ({ obj, handleSubmit}) => {

    const [loader, setLoader] = useState(false)

    const handleForm = () => {
        setLoader(true)
        handleSubmit( {id: obj.id} )
    }

    return (
        <Form onSubmit={handleForm} loading={loader}>
            <Item>
                <Button basic>
                    {obj && obj.isFollowed ? <Icon name='star' color="yellow"/> : <Icon name='star outline' />}
                    BookMark
                </Button >
            </Item>
        </Form>
    )
}

//todo formsAdminFllowers

export const UpdateFollowersForm = ({ history, object, objectType, onClose= undefined }) => {

    const { t } = useTranslation()
    const handleCancel = (e) => {
        if(onClose !== undefined) onClose(e)
    }


    const [followers, setFollowers] = useState([])
    const [unfollowers, setUnfollowers] = useState([])

    const [selectedUser, setSelectedUser] = useState(undefined)

    const handleChange = (e, {value} ) => {setSelectedUser(value)}

    const [loader, setLoader] = useState(false)
    const [selectLoader, setSelectLoader] = useState(false)

    const getOptions = () => {
        let options = []
        unfollowers.map(u => options.push(
            { key: u.id,
                text: u.id + " " + u.firstname + " " + u.lastname + " " + u.email,
                value: u
            }
        ))
        return options
    }

    function addFollower(user) {
        followers.push(user)
        unfollowers.splice(unfollowers.findIndex(f => f.id === user.id),1)
        setSelectLoader(undefined)
    }

    function removeFollower(user) {
        unfollowers.push(user)
        followers.splice(followers.findIndex(f => f.id === user.id), 1)
    }

    //todo
    const submit = async (user, action) => {
        setLoader(true)
        if (await authAPI.isAuthenticated()) {
            if(objectType === "activity"){
                userAPI.put({id: user.id, followingActivityId: object.id}, {}, {admin: true})
                    .then(response => {
                        if(action === "remove") removeFollower(user)
                        else addFollower(user)
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(()=> setLoader(false))
            }
            else if (objectType === "project"){
                userAPI.put({id: user.id, followingProjectId: object.id }, {}, {admin: true})
                    .then(response => {
                        if(action === "remove") removeFollower(user)
                        else addFollower(user)
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(()=> setLoader(false))
            }

        } else {
            history.replace("/login")
        }
    }

    //todo
    useEffect(async () => {
        setLoader(true)
        setSelectLoader(true)
        if (await authAPI.isAuthenticated()) {

            let userSearchParams = {}
            if(objectType === "activity"){
                userSearchParams["followingActivityId"] = object.id
            }
            if(objectType === "project"){
                userSearchParams["followingProjectId"] = object.id
                userSearchParams["projectIsFollowing"] = true
            }

            userAPI.get("search", userSearchParams, true)
                .then(FollowersResponse => {
                    setFollowers(FollowersResponse.data)
                    userAPI.get("all", {}, true)
                        .then(response => {
                            setUnfollowers(response.data.filter(u => FollowersResponse.data.find(f => f.id === u.id) === undefined))
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .finally(() => setSelectLoader(false))
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => setLoader(false))
        } else {
            history.replace("/login")
        }
    },[])

    return (
        <Segment>

            <Table unstackable compact singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>id</Table.HeaderCell>
                        <Table.HeaderCell> { t('name')} </Table.HeaderCell>
                        <Table.HeaderCell> { t('email')}</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {!loader && followers.length > 0 &&
                        followers.map(follower => (
                            <Table.Row>
                                <Table.Cell>{follower.id}</Table.Cell>
                                <Table.Cell>{follower.firstname + " " + follower.lastname}</Table.Cell>
                                <Table.Cell>{follower.email}</Table.Cell>
                                <Table.Cell>
                                    <Button size="small" onClick={() => submit(follower, "remove")}> {t("remove")} </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }

                    {!loader && followers.length === 0 &&
                        <Table.Row>
                            <Table.Cell colspan="4">{ t('no_follower')}</Table.Cell>
                        </Table.Row>
                    }

                    {loader &&
                        <Table.HeaderCell colspan="4" rowspan="4">
                            <Loader
                                active
                                content={
                                    <p>{ t('loading') +" : " +  t('followers') }</p>
                                }
                                inline="centered"
                            />
                        </Table.HeaderCell>
                    }

                </Table.Body>

                <Table.Footer>
                    <Table.Row>
                        {!loader &&
                            <Table.HeaderCell colspan="4">
                                <Select
                                    fluid
                                    loading={selectLoader}
                                    search
                                    placeholder={ t('select_user') }
                                    options={getOptions()}
                                    onChange={handleChange}
                                />
                                <Button size="small" onClick={()=>submit(selectedUser, "add")} disabled={selectedUser === undefined}> { t("add") } </Button>
                            </Table.HeaderCell>
                        }
                    </Table.Row>
                </Table.Footer>
            </Table>

            <Button size="small" onClick={handleCancel}> { t("finish") } </Button>
        </Segment>
    )
}

export const UpdateAssignedForm = ({t, isOwner, object, objectType, onClose = undefined, history, forAdmin = false}) => {

    const { isAuthenticated, isAdmin } = useContext(AuthContext);
    //todo errors
    const [errors, setErrors] = useState("")

    function getOwner(){
        if(objectType === "org"){
            return object.referent
        }
        else if (objectType === "project"){
            return object.creator
        }
    }

    const [members, setMembers] = useState([])
    const [unMembers, setUnMembers] = useState([])

    const handleCancel = (e) => {
        if(onClose !== undefined) onClose(e)
    }

    //todo setting Referent Or creator
    useEffect(async () => {

        async function fetchData(){
            //todo check
            let userSearchParams = {}
            if(objectType === "org"){
                userSearchParams["orgMemberId"] = object.id
            }
            if(objectType === "project"){
                userSearchParams["followingProjectId"] = object.id
                userSearchParams["projectIsAssigning"] = true
            }

            HandleGetUsers(
                {access: isAuthenticated ? "search" : "public", user:userSearchParams},
                setMembers,
                setLoader,
                setErrors,
                history
            )
        }

        fetchData()

        //dismiss unmounted warning
        return () => {
            setMembers({});
        };
    },[object])

    //todo
    /*function postTreatment (user) {
        if (action === "remove") removeMember(user)
        else addMember(user)
    }*/
    function addMember(user) {
        members.push(user)
        unMembers.splice(unMembers.findIndex(f => f.id === user.id),1)
        setSelectLoader(undefined)
    }

    function removeMember(user) {
        unMembers.push(user)
        members.splice(members.findIndex(f => f.id === user.id), 1)
    }

    const [loader, setLoader] = useState(false)
    const [selectLoader, setSelectLoader] = useState(false)

    //todo
    const submit = async (user, action) => {
        setLoader(true)
        let userPutParams = {id: user.id}
        if(objectType === "project"){
            userPutParams["assigningProjectId"] = object.id
        }
        if(objectType === "org"){
            userPutParams["orgMemberId"] = object.id
        }

        if (await authAPI.isAuthenticated()) {
            userAPI.put(userPutParams, {}, {admin: true})
                .then(response => {
                    if (action === "remove") removeMember(user)
                    else addMember(user)
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => setLoader(false))

        } else {
            history.replace('/login')
        }
    }

    return (
        <Segment padded="very" basic>
            {loader &&
            <Segment padded="very" basic>
                <LoaderWithMsg
                    isActive={true}
                    msg={t('loading') + " : " + t('activities')}
                />
            </Segment>
            }

            {!loader &&
            <>

                {forAdmin && isAdmin ?
                    <MembersTableForAdmin
                        t={t}
                        owner={getOwner()}
                        members={members}
                        loader={loader}
                        handleAction={submit}
                        history={history}
                        isAdmin={ forAdmin && isAdmin }
                    />
                :
                    <MembersTable
                        t={t}
                        object={object}
                        owner={getOwner()}
                        isOwner={isOwner}
                        members={members}
                        handleSubmit={submit}
                        history={history}
                    />
                }

            </>
            }
        </Segment>
    )
}

export const MembersTableForAdmin = ({ t, owner, members, loader, handleAction, history, isAdmin }) => {

    const [selectedUser, setSelectedUser] = useState( undefined )
    const [selectLoader, setSelectLoader] = useState(false)
    const [error, setError] = useState("")

    const [unMembers, setUnMembers] = useState([])
    useEffect(()=> {
        async function fetchData (){
            await HandleGetUsers(
                {access:"all"},
                setUnMembers,
                setSelectLoader,
                setError,
                history,
                isAdmin
                )
        }
        fetchData()

        //dismiss unmounted warning
        return () => {
            setUnMembers({});
        };
    },[members])

    const getOptions = () => {
        let options = []
        unMembers.map(u => {
            if(u.id !== owner.id && members.find( m => m.id === u.id) === undefined){
                options.push(
                    { key: u.id,
                        text: u.id + " " + u.firstname + " " + u.lastname + " " + u.email,
                        value: u
                    }
                )
            }
        })
        return options
    }

    return (
        <Table unstackable compact singleLine>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>id</Table.HeaderCell>
                    <Table.HeaderCell> { t('name')} </Table.HeaderCell>
                    <Table.HeaderCell> { t('email')}</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>

            <Table.Header>
                <Table.Row >
                    <Table.HeaderCell colspan="4" > { t('referent') }</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>{owner.id}</Table.Cell>
                    <Table.Cell>{owner.firstname + " " + owner.lastname}</Table.Cell>
                    <Table.Cell>{owner.email}</Table.Cell>
                    <Table.Cell />
                </Table.Row>

                <Table.Header>
                    <Table.Row textAlign="center" >
                        <Table.HeaderCell colspan="4" > { t('team') }</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                {!loader && members.length > 0 &&
                members.map(member => (
                    member.id !== owner.id &&
                    <Table.Row key={member.id}>
                        <Table.Cell>{member.id}</Table.Cell>
                        <Table.Cell>{member.firstname + " " + member.lastname}</Table.Cell>
                        <Table.Cell>{member.email}</Table.Cell>
                        <Table.Cell>
                            <Button size="small" onClick={() => handleAction(member, "remove")}> {t("remove")} </Button>
                        </Table.Cell>
                    </Table.Row>
                ))
                }

                {!loader && members.length === 0 &&
                <Table.Row>
                    <Table.Cell colspan="4">{ t('no_member')}</Table.Cell>
                </Table.Row>
                }

                {loader &&
                <Table.HeaderCell colspan="4" rowspan="4">
                    <Loader
                        active
                        content={
                            <p>{ t('loading') +" : " +  t('followers') }</p>
                        }
                        inline="centered"
                    />
                </Table.HeaderCell>
                }

            </Table.Body>

            <Table.Footer>
                <Table.Row>
                    {!loader &&
                    <Table.HeaderCell colspan="4">
                        <Select
                            fluid
                            loading={selectLoader}
                            search
                            placeholder={ t('select_user') }
                            options={getOptions()}
                            onChange={(e, {value} ) => { setSelectedUser(value)} }
                        />
                        <Button size="small" onClick={()=>handleAction(selectedUser, "add")} disabled={selectedUser === undefined}> { t("add") } </Button>
                    </Table.HeaderCell>
                    }
                </Table.Row>
            </Table.Footer>
        </Table>
    )
}

//todo discrim with referent and creator org and project
export const MembersTable = ({ t, object, owner, isOwner, members, handleSubmit, history }) => {

    const { isAuthenticated } = useContext(AuthContext)

    const [userParams, setUserParams] = useState({})
    const [users, setUsers] = useState([])
    const [searchLoader, setSearchLoader] = useState(false)

    //todo errors
    const [errors, setErrors] = useState("")

    const [selectedUser, setSelectedUser] = useState(undefined)

    //todo check
    const handleSearch = async (e, access,  admin= false, searchParams= undefined) => {
        e.preventDefault()
        HandleGetUsers(
            {access:access, user:searchParams},
            setUsers, setSearchLoader, setErrors,
            history, false
        )
    }
    /**
     * Update member in a membership
     * @returns {Promise<void>}
     */
    const handle = async () => {
        handleSubmit(confirm.actionTarget, confirm.type)
        .finally( () => {
            setSelectedUser(undefined)
            setConfirm( {show:false, type:"", actionTarget:{}} )
        })
    }

    /**
     * confirm params object
     */
    const [confirm, setConfirm] = useState({
        show: false,
        type: "",
        actionTarget: {}
    })

    /**
     * get Options for SelectInput
     * @returns {*[]}
     */
    const getOptions = () => {
        let options = []
        users.map(u => {
            if(u.i !== owner.id){
                options.push(
                    { key: u.id,
                        text: u.id + " " + u.firstname + " " + u.lastname + " " + u.email,
                        value: u.id
                    }
                )
            }
        })
        return options
    }

    /**
     * display infos for selectedUser and check if he is already member or owner
     * @returns {JSX.Element}
     * @constructor
     */
    const SelectedUserOptions = () => {

        let isAlreadyMember = (members.find(m => m.id === selectedUser.id) !== undefined) || selectedUser.email === owner.email
        return (
            <>
                <UserCard user={ selectedUser }/>

                {!isAlreadyMember ?
                    <>
                        <Button size="small"
                                onClick={() => setConfirm({show: true, type: "add", actionTarget: selectedUser})}
                                content={t('add')}
                        />

                        {confirm.show && confirm.type === "add" &&
                        <ConfirmActionForm t={t}
                                           confirmMessage={t("add_share_in_message")}
                                           confirmAction={() => handle()}
                                           cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                        />
                        }
                    </>
                :
                    <Message negative >
                        <Message.Item> { t("already_member") } </Message.Item>
                    </Message>
                }
            </>
        )
    }

    const [addForm, setAddForm] = useState(false)

    return (
        <>
            { object &&
                <>
                    <Divider horizontal>
                        <Header as='h4'>
                            <Icon name='chess king' />
                            {t('org_referent')}
                        </Header>
                    </Divider>
                    <UserCard user={owner}/>

                    {isAuthenticated && isOwner &&
                        <Menu vertical fluid>
                            {!addForm &&
                            <Menu.Item>
                                <Button onClick={() => setAddForm(true)} content={t('add_members')}/>
                            </Menu.Item>
                            }
                            {addForm &&
                            <>
                                <SearchUserForm
                                    user={userParams}
                                    setUser={setUserParams}
                                    handleSubmit={handleSearch}
                                    setErrors={setErrors}
                                />

                                <Menu.Item disabled={users.length <= 0}>
                                    <Select
                                        fluid
                                        loading={searchLoader}
                                        search
                                        placeholder={ t('select_user') }
                                        options={getOptions()}
                                        onChange={(e, {value} ) => { setSelectedUser( users.find( u => u.id === value ))} }
                                    />
                                </Menu.Item>

                                <Menu.Item>
                                    {selectedUser &&
                                    <SelectedUserOptions />
                                    }
                                </Menu.Item>
                                <Menu.Item>
                                    <Button onClick={() => setAddForm(false)} content={t('close')}/>
                                </Menu.Item>
                            </>
                            }
                        </Menu>
                    }
                </>
            }


            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='group' />
                    {t('membership')}
                </Header>
            </Divider>
            {members && members.length > 0 &&
                members.map((member, key) => (
                    <Container key={key}>
                        <UserCard t={t} user={member} />
                        {isAuthenticated && isOwner &&
                        <>
                            {confirm.show && confirm.type === "remove" && confirm.actionTarget.id === member.id &&
                            <ConfirmActionForm t={t}
                                               confirmMessage={t("remove_share_in_message")}
                                               confirmAction={() => handle()}
                                               cancelAction={() => setConfirm({show: false, type: "", actionTarget: {}})}
                            />
                            }

                            <BtnRemove
                                t={t}
                                removeAction={ ()=>setConfirm({ show: true, type: "remove", actionTarget: member }) }
                                iconName={"remove user"}
                            />
                            <Divider section/>
                        </>
                        }
                    </Container>
            ))
            }

            {members && members.length === 0 &&
                <Container textAlign='center'>
                    <Message size='mini' info>
                        { t("no_member") }
                    </Message>
                </Container>
            }
        </>
    )
}