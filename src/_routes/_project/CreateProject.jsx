import React, { useContext, useState } from "react";
import Field from '../../_components/forms/Field';
import { withTranslation } from 'react-i18next';
import ProjectAPI from "../../_services/projectAPI";
import AuthContext from "../../_contexts/AuthContext";
import {Button, Form} from "semantic-ui-react";
import AuthAPI from "../../_services/authAPI";

const CreateProject = ({ history, t }) => {
    AuthAPI.setup();
    const isAuthenticated = useContext(AuthContext);
    if (isAuthenticated === true) {
        history.replace('/');
    }

    const [project, setProject] = useState({
        title: "",
        description: "",
        startDate: {},
        endDate: {},
    });

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setProject({ ...project, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault()

        ProjectAPI.post(project)
            .then(response =>
                console.log(response.data)
            )
            .catch(error => {
                console.log(error.response.data.error)
                setErrors(error.response.data.error);
            })
    };

    const [errors, setErrors] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    return (
        <div className="card">
            <h1>Créer un nouveau projet</h1>
            <form onSubmit={handleSubmit}>
                <Form.Input
                    icon=''
                    iconPosition='left'

                    label="Title"
                    name="title"
                    type="text"
                    value={project.title}
                    onChange={handleChange}
                    placeholder="nom..."
                    error={errors.title ? errors.title : null}
                />
                <Form.Input
                    icon=''
                    iconPosition='left'

                    label="Description"
                    name="description"
                    type="textarea"
                    value={project.description}
                    onChange={handleChange}
                    placeholder="description..."
                    error={errors.description ? errors.description : null}
                />
                <Form.Input
                    icon=''
                    iconPosition='left'

                    label="Date de début"
                    name="startDate"
                    type="date"
                    value={project.startDate}
                    onChange={handleChange}
                    error={errors.startDate ? errors.startDate : null}
                />
                <Form.Input
                    icon=''
                    iconPosition='left'

                    label="Date de fin"
                    name="endDate"
                    type="date"
                    value={project.endDate}
                    onChange={handleChange}
                    error={errors.endDate ? errors.endDate : null}
                />
                <div className="inline-btn">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                </div>
            </form>
        </div>
    );
};

export default withTranslation()(CreateProject);

