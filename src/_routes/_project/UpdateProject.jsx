
import React, {useContext, useEffect, useState} from "react";

import Field from '../../_components/forms/Field';
import { withTranslation } from 'react-i18next';
import projectAPI from "../../_services/projectAPI";
import AuthAPI from "../../_services/authAPI";
import AuthContext from "../../_contexts/AuthContext";
import {Button, Form, Item} from "semantic-ui-react";

const UpdateProject = (props) => {
    AuthAPI.setup();
    const isAuthenticated = useContext(AuthContext);
    if (isAuthenticated === true) {
        props.history.replace('/');
    }

    const id = props.match.params.id
 //   console.log(id)

    const [project, setProject] = useState({
        title: "",
        description: "",
        startDate: {},
        endDate: {},
    });

    const [errors, setErrors] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        projectAPI.getMy(id)
            .then(response => {
                console.log(response)
                setProject(response.data[0])
            })
            .catch(error => console.log(error.response))
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setProject({ ...project, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault()

        projectAPI.put(project)
            .then(response =>
                //confirmation
                console.log(response.data[0])
            )
            .catch(error => {
                console.log(error.response)
                setErrors(error.response.data.error);
            })
    };

  //  const [error, setError] = useState("");

    return (
        <div className="card">
            {project && (
                <>
                    <Item.Group >
                        <Item>
                            <Item.Content>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Input
                                        icon=''
                                        iconPosition='left'

                                        label="Title"
                                        name="title"
                                        value={project.title}
                                        onChange={handleChange}
                                        placeholder="nom..."
                                        error={errors.name ? errors.name : null}
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
                                        error={errors.name ? errors.name : null}
                                    />
                                    <Form.Input
                                        icon=''
                                        iconPosition='left'

                                        label="Date de début"
                                        name="startDate"
                                        type="date"
                                        value={project.startDate}
                                        onChange={handleChange}
                                        error={errors.name ? errors.name : null}
                                    />
                                    <Form.Input
                                        icon=''
                                        iconPosition='left'

                                        label="Date de fin"
                                        name="endDate"
                                        type="date"
                                        value={project.endDate}
                                        onChange={handleChange}
                                        error={errors.name ? errors.name : null}
                                    />
                                    <Button content='Valider' primary />
                                </Form>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </>
            )}
        </div>
    );
};

export default withTranslation()(UpdateProject);

