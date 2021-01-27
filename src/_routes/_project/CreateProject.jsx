import React, { useContext, useState } from "react";
import Field from '../../_components/forms/Field';
import { withTranslation } from 'react-i18next';
import ProjectAPI from "../../_services/projectAPI";
import AuthContext from "../../_contexts/AuthContext";

const CreateProject = ({ history, t }) => {
    const isAuthenticated = useContext(AuthContext);
    if (isAuthenticated === true) {
        history.replace('/');
    }

    const [project, setProject] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        setProject({ ...project, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault()

        ProjectAPI.post(project)
            .then(response =>
                console.log(response.data)
            )
            .catch(error => {
                console.log(error.response)
                setError("Echec, veuillez vérifier vos informations");
            })
    };

    const [error, setError] = useState("");

    return (
        <div className="App">
            <h1>Créer un nouveau projet</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    label="Title"
                    name="title"
                    value={project.title}
                    onChange={handleChange}
                    placeholder="nom..."
                />
                <Field
                    label="Description"
                    name="description"
                    type="textarea"
                    value={project.description}
                    onChange={handleChange}
                    placeholder="description..."
                />
                <Field
                    label="Date de début"
                    name="startDate"
                    type="date"
                    value={project.startDate}
                    onChange={handleChange}
                />
                <Field
                    label="Date de fin"
                    name="endDate"
                    type="date"
                    value={project.endDate}
                    onChange={handleChange}
                />
                <div className="inline-btn">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                </div>
                <p>{error}</p>
            </form>
        </div>
    );
};

export default withTranslation()(CreateProject);

