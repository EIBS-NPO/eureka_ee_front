
import React, {useContext, useState} from "react";
import { withTranslation } from 'react-i18next';
import {Checkbox, Icon, Button, Item, Label, Form} from "semantic-ui-react";
import { StepFormContext } from "../../../../../___UnusedFile/_components/CreateProjectStepping";

const PublicationForm = ({t, nextStep}) => {

    const { obj, setObj} = useContext(StepFormContext)

    const [isPublicValue, setIsPublicValue] = useState(false)

    const handlePublication = (event) => {
        if(!isPublicValue){
            setIsPublicValue(true)
        }else {
            setIsPublicValue(false)
        }
    }


    const handleSub = () => {
        setObj({...obj, 'isPublic': isPublicValue})
        nextStep()
    }

    return (
        <>
            <Label attached='top'>
                <h4>Public or Private</h4>
            </Label>
        <Form onSubmit={handleSub}>
                <Item.Group>
                    <Item>
                        {isPublicValue?
                            <Label color="green" size="small" horizontal>
                                {t("public")}
                            </Label>
                            :
                            <Label size="small" horizontal>
                                {t("private")}
                            </Label>
                        }
                        <Checkbox
                            name='isPublic'
                            onChange={handlePublication}
                            toggle
                        />
                    </Item>

                    <Button animated >
                        <Button.Content visible>Next</Button.Content>
                        <Button.Content hidden>
                            <Icon name='arrow right' />
                        </Button.Content>
                    </Button>

                </Item.Group>
        </Form>
            </>
    );
}


export default withTranslation()(PublicationForm);