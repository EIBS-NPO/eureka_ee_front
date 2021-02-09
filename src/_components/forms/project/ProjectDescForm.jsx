
import React, {useContext} from "react";
/*import { withTranslation } from 'react-i18next';*/
import { Button, Icon, TextArea, Form, Item, Label } from "semantic-ui-react";
import AuthContext from "../../../_contexts/AuthContext";
//import StepFormContext from "../../../_contexts/StepFormContext";
import { StepFormContext } from "../../../_routes/_project/CreateProject";

const ProjectDescForm = ({loader, errors}) => {

    const { obj, setObj, currentStep, setCurrentStep, stepList, setStepList } = useContext(StepFormContext)

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setObj({ ...obj, [name]: value })
    };

    const handleSub = () => {
        currentStep.isValid = true
        currentStep.state = "completed"
        stepList.splice(currentStep.id, 1, currentStep)
        setCurrentStep(stepList[currentStep.id + 1])
        stepList[currentStep.id + 1].state = "active"
        console.log(stepList)
    }

    return (
        <Form onSubmit={handleSub}>
            <Item.Group>
                <Item.Group divided>
                    <Item>
                        <Item.Content>
                            <Label attached='top'>
                                <h4>Créer un nouveau projet</h4>
                            </Label>
                        </Item.Content>
                    </Item>
                    <Item>
                        <Label size="small" ribbon>
                            Title
                        </Label>
                        {loader ?
                            <Form.Input
                                type="text"
                                disabled
                                loading
                            />
                            :
                            <Form.Input
                                name="title"
                                type="text"
                                value={obj.title}
                                onChange={handleChange}
                                min="4"
                                placeholder="Titre..."
                                error={errors.title ? errors.title : null}
                                required
                            />
                        }
                    </Item>
                    <Item>
                        <Label size="small" ribbon>
                            Description
                        </Label>
                        {loader ?
                            <TextArea
                                type="texterea"
                                disabled
                                loading
                            />
                            :
                            <TextArea
                                name="description"
                                type="textarea"
                                value={obj.description}
                                onChange={handleChange}
                                placeholder="description..."
                                error={errors.description ? errors.description : null}
                                required
                            />
                        }
                    </Item>

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


export default ProjectDescForm;