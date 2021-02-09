import React, {useContext} from "react";
import {Button, Form, Icon, Item, Label} from "semantic-ui-react";
import utilities from "../../../_services/utilities";
import orgAPI from "../../../_services/orgAPI";
import { StepFormContext } from "../../../_routes/_project/CreateProject";

const ProjectDatingForm = ({loader, errors}) => {

    const { obj, setObj, currentStep, setCurrentStep, stepList, setStepList } = useContext(StepFormContext)

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setObj({ ...obj, [name]: value });
        console.log(value)
    };

    const handleSub = () => {
        currentStep.isValid = true
        currentStep.state = "completed"
        stepList.splice(currentStep.id, 1, currentStep)
        setCurrentStep(stepList[currentStep.id + 1])
        stepList[currentStep.id + 1].state = "active"
        console.log(stepList)
    }

    const minDateForStart = utilities.formatDate(new Date())

    const minDateForEnd = () => {
        if(obj.startDate) {
            console.log(utilities.addDaysToDate(obj.startDate, 1))
            return utilities.addDaysToDate(obj.startDate, 1)
        }
         else return null
    }

    console.log(obj)
    /*//todo mettre controle date min sur date actuelle */
    return (
        <Form onSubmit={handleSub}>
            <Item.Group>
                <Item.Group divided>
                    <Item>
                        <Label size="small" ribbon>
                            Date de début
                        </Label>
                        {loader ?
                            <Form.Input
                                type="date"
                                disabled
                                loading
                            />
                            :
                            <Form.Input
                                name="startDate"
                                type="date"
                                value={obj.startDate ? obj.startDate : {} }
                                onChange={handleChange}
                             //   min={Utilities.formatDate(new Date())}
                                min={minDateForStart}
                                error={errors.startDate ? errors.startDate : null}
                            />
                        }
                    </Item>
                    <Item>
                        <Label size="small" ribbon>
                            Date de fin
                        </Label>
                        {loader ?
                            <Form.Input
                                type="date"
                                disabled
                                loading
                            />
                            :
                            <Form.Input
                                name="endDate"
                                type="date"
                                value={obj.endDate ? obj.endDate : {}}
                                onChange={handleChange}
                                min={minDateForEnd()}
                                error={errors.endDate ? errors.endDate : null}
                            />
                        }
                    </Item>
                    {/*<Button icon className="prevBtn" labelPosition='left'>
                        Previous
                        <Icon name='left arrow' />
                    </Button>
*/}
                    {loader ?
                        <Button icon labelPosition='right' disabled loading>
                            Next
                            <Icon name='right arrow'/>
                        </Button>
                        :
                        <Button icon labelPosition='right'>
                            Next
                            <Icon name='right arrow'/>
                        </Button>
                    }
                </Item.Group>
            </Item.Group>
        </Form>
    );
}


export default ProjectDatingForm;