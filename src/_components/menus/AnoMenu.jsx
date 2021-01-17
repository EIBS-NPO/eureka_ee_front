import React from 'react';
import { NavLink } from "react-router-dom";

const AnoMenu = () => {
    return(
        <>
            <nav>
                <ul>
                    <li><NavLink to="/all_projects">Tous les projets</NavLink></li>
                    <li><NavLink to="/all_resources">Toutes les ressources</NavLink></li>
                    <li><NavLink to="/all_organizations">Toutes les organisations</NavLink></li>
                </ul>
            </nav>
        </>
    );
}

export default AnoMenu;