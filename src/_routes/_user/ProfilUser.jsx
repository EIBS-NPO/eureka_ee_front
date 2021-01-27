import React, { useEffect, useState } from 'react';
import userAPI from '../../_services/userAPI';
import {NavLink} from "react-router-dom";
//import AuthContext from '../_contexts/AuthContext';
//import MainMenu from "../_components/MainMenu";

const ProfilUser = ({ history }) => {

    const [user, setUser] = useState()

    useEffect(() => {
        userAPI.get()
            .then(response => {
                setUser(response.data[0])
            })
            .catch(error => console.log(error.response))
    }, []);
    return (

        <div>
            <h1>Profil</h1>
            {user &&
                (   <>
                    <p>{user.firstname}</p>
                    <p>{user.lastname}</p>
                    <p>{user.email}</p>
                    <NavLink to="/update_user">Update</NavLink>
                    </>
                )
            }
        </div>
    );
};

export default ProfilUser;