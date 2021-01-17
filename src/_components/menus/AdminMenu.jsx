import React from 'react';
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
    return(
        <>
            <nav>
                <ul>
                    <li><NavLink to="#">Admin_1</NavLink></li>
                    <li><NavLink to="#">Admin_2</NavLink></li>
                    <li><NavLink to="#">Admin_3</NavLink></li>
                </ul>
            </nav>
        </>
    );
}

export default AdminMenu;