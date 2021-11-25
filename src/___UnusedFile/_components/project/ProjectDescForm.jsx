
import React, {useContext, useState} from "react";
import {Container, Button, Icon, Form, Item, Label } from "semantic-ui-react";
import { StepFormContext } from "../../../__appComponents/_routerComponents/_pages/_projectPages/CreateProjectStepping";
import {withTranslation} from "react-i18next";
import TextAreaMultilang from "../../../__appComponents/_routerComponents/_pages/__CommonComponents/forms/TextAreaMultilang";

const ProjectDescForm = ({t, loader, errors, nextStep}) => {

    const { obj } = useContext(StepFormContext)

    const [title, setTitle]=useState("")
    const [desc, setDesc] = useState({
        en:"",
        fr:"",
        nl:""
    })

    const handleChange = (event) => {
        const {value}  = event.currentTarget;
        setTitle( value )
    };

    const handleSub = () => {
        obj.title = title
        obj.description = desc
   //     console.log(obj)
        nextStep()
    }

    return (
        <>
            <Label attached='top'>
                <h4>Description</h4>
            </Label>
            <Form onSubmit={handleSub}>
                <Item.Group divided >
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
                                minLength="2"
                                maxLength="50"
                                value={title}
                                onChange={handleChange}
                                placeholder="Titre..."
                                error={errors.title ? errors.title : null}
                                required
                            />
                        }
                    </Item>

                    <Container>
                        <TextAreaMultilang  tabText={desc} setter={setDesc} name="description" min={2} max={500}/>
                    </Container>

                    <Button fluid animated >
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


export default withTranslation()(ProjectDescForm);