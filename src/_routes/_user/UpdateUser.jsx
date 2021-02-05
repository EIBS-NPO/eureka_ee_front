
import React, { useContext, useEffect, useState } from "react";
import {Button, Form, Item} from "semantic-ui-react";
import AuthContext from "../../_contexts/AuthContext";
import UserAPI from "../../_services/userAPI";
import fileAPI from "../../_services/fileAPI";
import user from "../../_components/cards/user";
import ImageUpload from "../../_components/Crop/ImageUpload";

/*//todo add optionalFields*/
const UpdateUser = ( props ) => {
    //const userData =
    /*console.log(props.user)
    console.log(props.match.params.id)
    console.log(props.match.params.firstname)
    console.log(props.match.params.lastname)
    console.log(props.match.params.picture)
    console.log(props.match.params.email)*/

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    if (isAuthenticated === false) {
        props.history.replace('/');
    }

    const [userPicture, setUserPicture] =useState();

    const [user, setUser] = useState({
        email: "",
        lastname: "",
        firstname: "",
        picture:""
    });

    const [refreshUser, setRefreshUser] = useState([0])

    useEffect(() => {
        /*if(userData){
            setUser(userData)
        }
        else {*/
            UserAPI.get()
                .then(response => {
                    console.log(response.data[0])
                    setUser(response.data[0])
                    if(response.data[0].picture){
                        fileAPI.downloadPic("user", response.data[0].picture)
                            .then(response => {
                                console.log(response)
                                setUserPicture(response.data[0])
                                //   setLoading3(false)
                            })
                            .catch(error => {
                                console.log(error.response)
                                //todo handle error
                            })
                    }})
                .catch(error => console.log(error.response))
       /* }*/
    }, [refreshUser]);

    const [errors, setErrors] = useState({
        email: "",
        lastname: "",
        firstname: "",
        picture:""
    });

    //gestion des changements des inputs dans le formulaire
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        //création User
        UserAPI.put(user)
            .then(response => {
                //  setErrors({});
                //todo confirmation
            })
            .catch(error => {
                setErrors(error.response.data.error)
            })
    };

    return (
        <User user={user} context="update" />
    /*<>
        <div className="card">
            {user && (
                <>
            <Item.Group >
                <Item>
                    {userPicture != null &&
                        <Item.Image src={`data:image/jpeg;base64,${userPicture}`}/>
                    }
                </Item>
                <Item>
                    <ImageUpload
                        setRefresh={setRefreshUser}
                        refresh={refreshUser}
                        entity={"user"}
                    />
                </Item>
                <Item>
                    <Item.Content>
                        <Form onSubmit={handleSubmit}>
                            <Form.Input
                                icon='mail'
                                iconPosition='left'
                                name="email"
                                value={user.email}
                                label='Email'
                                placeholder='Email'
                                onChange={handleChange}
                                error={errors.email ? errors.email : null}
                            />
                            <Form.Input
                                icon='user'
                                iconPosition='left'

                                label="Firstname"
                                name="firstname"
                                type="text"
                                value={user.firstname}
                                onChange={handleChange}
                                error={errors.firstname ? errors.firstname : null}
                            />
                            <Form.Input
                                icon='user'
                                iconPosition='left'

                                label="Lastname"
                                name="lastname"
                                type="text"
                                value={user.lastname}
                                onChange={handleChange}
                                error={errors.lastname ? errors.lastname : null}
                            />
                            <Button content='Valider' primary />
                        </Form>
                    </Item.Content>
                </Item>
            </Item.Group>
                </>
            )}
        </div>
    </>*/
    );
};

export default UpdateUser;
