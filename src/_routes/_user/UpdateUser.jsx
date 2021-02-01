
import React, { useContext, useEffect, useState } from "react";
import {Button, Form, Item} from "semantic-ui-react";
import AuthContext from "../../_contexts/AuthContext";
import UserAPI from "../../_services/userAPI";
import ImageUpload from "../../_components/Crop/ImageUpload";

/*//todo add optionalFields*/
const UpdateUser = ({ history, t }) => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    if (isAuthenticated === false) {
        history.replace('/');
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
        UserAPI.get()
            .then(response => {
                console.log(response.data[0])
                setUser(response.data[0])
                if(response.data[0].picture){
                    UserAPI.dowloadPic(response.data[0].picture)
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
    <>
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
    </>
    );
};

export default UpdateUser;
