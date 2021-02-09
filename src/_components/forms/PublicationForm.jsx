
import React, {useContext, useState} from "react";
/*import { withTranslation } from 'react-i18next';*/
import {Checkbox, Icon, Button, Item, Label, Form} from "semantic-ui-react";
import { StepFormContext } from "../../_routes/_project/CreateProject";

const PublicationForm = ({loader, errors}) => {

    const { obj, setObj, currentStep, setCurrentStep, stepList, setStepList } = useContext(StepFormContext)

    const [isPublicValue, setIsPublicValue] = useState(obj.isPublic)

    const handlePublication = (event) => {
        if(!isPublicValue){
            setIsPublicValue(true)
        }else {
            setIsPublicValue(false)
        }
        setObj({...obj, 'isPublic': isPublicValue})
    }
    console.log(obj)

    const handleSub = () => {
        currentStep.isValid = true
        currentStep.state = "completed"
        stepList.splice(currentStep.id, 1, currentStep)
        setCurrentStep(stepList[currentStep.id + 1])
        stepList[currentStep.id + 1].state = "active"
    }

    return (
        <Form onSubmit={handleSub}>
            <Item.Group>
                <Item.Group>
                    <Item>
                        <Item.Content>
                            <Label attached='top'>
                                <h4>Public or Private</h4>
                            </Label>
                        </Item.Content>
                    </Item>
                    <Item>
                        <Checkbox
                            name='isPublic'
                            label={{ children: 'isPublic ?' }}
                            onChange={handlePublication}
                            toggle
                        />
                    </Item>

                    {/*//todo double button ou juste en label? ca peut être sympa et plus simple ? ....*/}
                    <Button.Group>
                        <Button>Private</Button>
                        <Button.Or text='or' />
                        <Button positive>Public</Button>
                    </Button.Group>

                    <Button icon labelPosition='right'>
                        Next
                        <Icon name='right arrow' />
                    </Button>
                </Item.Group>
            </Item.Group>
        </Form>
    );
}


export default PublicationForm;