
import React, {useContext, useState} from "react";
/*import { withTranslation } from 'react-i18next';*/
import {Checkbox, Icon, Button, Item, Label, Form, Loader} from "semantic-ui-react";
import { StepFormContext } from "../../../_routes/_project/CreateProject";
import ProjectAPI from "../../../_services/projectAPI";

const ProjectFormResume = ({loader, errors }) => {

    const { obj, setObj, currentStep, setCurrentStep, stepList, setStepList } = useContext(StepFormContext)

    const handleSubmit = (event) => {
       // setLoader(true)
        event.preventDefault()

        ProjectAPI.post(obj)
            .then(response =>
                console.log(response.data)
            )
            .catch(error => {
                console.log(error.response.data.error)
           //     setErrors(error.response.data.error);
            })
    //        .finally(()=>setLoader(false))
    };

    /*
    title: "",
        description: "",
        organization: {},
        startDate: {},
        endDate: {},
        isPublic:false
     */
    return (
            <Item.Group divided>
                        <Item>
                            <Label size="small" ribbon>
                                Title
                            </Label>
                            <Item.Content verticalAlign='middle'>
                                {obj.title}
                            </Item.Content>
                        </Item>

                        <Item>
                            <Label size="small" ribbon>
                                Description
                            </Label>
                            <Item.Content verticalAlign='middle'>
                                {obj.description}
                            </Item.Content>
                        </Item>

                        <Item>
                            <Label size="small" ribbon>
                                StartDate
                            </Label>
                            <Item.Content verticalAlign='middle'>
                                {obj.startDate ? obj.startDate : ""}
                            </Item.Content>
                        </Item>

                        <Item>
                            <Label size="small" ribbon>
                                EndDate
                            </Label>
                            <Item.Content verticalAlign='middle'>
                                {obj.endDate ? obj.endDate : ""}
                            </Item.Content>
                        </Item>

                        <Item>
                            <Label size="small" ribbon>
                                Organization
                            </Label>
                            <Item.Content verticalAlign='middle'>
                                {obj.organization ?
                                    obj.organization
                                    : "non renseigné"
                                }
                            </Item.Content>
                        </Item>

                        <Item>
                            <Label size="small" ribbon>
                                isPublic
                            </Label>
                            <Item.Content verticalAlign='middle'>
                                {obj.isPublic ?
                                    "yes"
                                    : "no"
                                }
                            </Item.Content>
                        </Item>
                <Form onSubmit={handleSubmit}>
                    <Item>
                        <div className="inline-btn">
                            <Button type="submit" className="btn btn-success" > Enregistrer </Button>
                        </div>
                    </Item>
                </Form>
            </Item.Group>
    );
}


export default ProjectFormResume;