import React, {useContext, useEffect, useState} from 'react';
import { NavLink } from "react-router-dom";
import AuthAPI from "../../_services/authAPI";
import AuthContext from "../../_contexts/AuthContext";
import '../../scss/components/leftMenu.scss';
import AdminMenu from "./AdminMenu";
import UserMenu from "./UserMenu";
import AnoMenu from "./AnoMenu";

const LeftMenu = ({history}) => {
    const isAuthenticated = useContext(AuthContext).isAuthenticated;

    const [isAdmin, setIsAdmin] = useState({})

    useEffect(() => {
        if(isAuthenticated){
            setIsAdmin(AuthAPI.isAdmin());
        }
    },[])

    return (
        <>
            <aside id="left_menu">
                {isAuthenticated && isAdmin && (
                    <AdminMenu />
                )}
                {isAuthenticated && (
                    <UserMenu />
                )}
                <AnoMenu />
            </aside>
        </>
    )
}

export default LeftMenu;