
import React, { useContext, useState } from "react";
import { withTranslation } from 'react-i18next';
import {Button, Form, Icon, Label} from "semantic-ui-react";
import { StepFormContext } from "../../../__appComponents/_routerComponents/_pages/_projectPages/CreateProjectStepping";
import projectAPI from "../../../__services/_API/projectAPI";
import Card from "../../../__appComponents/_routerComponents/_pages/__CommonComponents/Card";


const ProjectFormResume = ( props  ) => {

    const { obj } = useContext(StepFormContext)

    const [loader, setLoader] = useState(false)

    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault()

        projectAPI.post(obj)
            .then(response => {
       //         console.log(response.data)
                props.history.replace("/project/creator_" + response.data[0].id)
            })
            .catch(error => {
                console.log(error)
           //     setErrors(error.response.data.error);
            })
            .finally(() => setLoader(false))
    };

    return (
        <>
            <Label attached="top">
                <h4>{ props.t("review") }</h4>
            </Label>
            <Form onSubmit={handleSubmit} loading={loader}>

                <Card obj={obj} type="project" profile={true} ctx="create"/>

                <Button animated >
                    <Button.Content visible>{ props.t("save") }</Button.Content>
                    <Button.Content hidden>
                        <Icon name='arrow right' />
                    </Button.Content>
                </Button>
            </Form>
        </>
    );
}


export default withTranslation()(ProjectFormResume);