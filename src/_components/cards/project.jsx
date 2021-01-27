import React from 'react';
import '../../scss/components/cardOrg.scss';

// the hoc
import { withTranslation } from 'react-i18next';
import {NavLink} from "react-router-dom";

const Project = ({ t, project, context }) => {


    return (
        <div className="card">
            <p>{project.title}</p>
            <p>{project.description}</p>
            {project.startDate && (
                <p>{project.startDate}</p>
            )}
            {project.endDate && (
                <p>{project.endDate}</p>
            )}
            {context === "creator" && (
                <NavLink to={"/update_project/" + project.id }>Update</NavLink>
            )}
        </div>
    );
};

export default withTranslation()(Project);

