
import React, {useEffect, useContext, useState} from "react";
import { withTranslation } from 'react-i18next';
import {Button, Form, Icon, Item, Label} from "semantic-ui-react";
import { StepFormContext } from "../../../_routes/_project/CreateProject";
import utilities from "../../../_services/utilities";
import Project from "../../cards/project";
import projectAPI from "../../../_services/projectAPI";

const ProjectFormResume = ( props ) => {

    const { obj } = useContext(StepFormContext)

    console.log(obj)

    const handleSubmit = (event) => {
      //  setLoader(true)
        event.preventDefault()

        projectAPI.post(obj)
            .then(response => {
                console.log(response.data[0].id)
                window.location.href='/project/creator_' + response.data[0].id
            })
            .catch(error => {
                console.log(error)
                console.log(error.response)
           //     setErrors(error.response.data.error);
            })
    };

    return (
        <>
            <Label attached="top">
                <h4>{ props.t("review") }</h4>
            </Label>
            <Form onSubmit={handleSubmit}>
            {/*
                <Item>
                    <Item.Content>
                        <Item.Header>{obj.name}</Item.Header>
                        <Item.Meta>
                            {obj.startDate !== "" &&
                                obj.startDate
                            }
                           {obj.endDate !== "" &&
                                obj.endDate
                            }

                        </Item.Meta>
                        <Item.Description>{obj.description}</Item.Description>
                    </Item.Content>
                </Item>
            */}

                <Project project={obj} context="create"/>

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