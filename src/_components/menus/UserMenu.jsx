import React from 'react';
import { NavLink } from "react-router-dom";

const UserMenu = () => {
    return(
        <>
            <nav>
                <ul>
                    <li><NavLink to="/my_activities">Mes activités</NavLink></li>
                    <li><NavLink to="/my_projects">Mes projets</NavLink></li>
                    <li><NavLink to="/my_resources">MesResources</NavLink></li>
                </ul>
            </nav>
        </>
    );
}

export default UserMenu;