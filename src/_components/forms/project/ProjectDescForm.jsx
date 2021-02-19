
import React, {useContext, useState} from "react";
import { Button, Icon, TextArea, Form, Item, Label } from "semantic-ui-react";
import { StepFormContext } from "../../../_routes/_project/CreateProject";
import {withTranslation} from "react-i18next";

const ProjectDescForm = ({t, loader, errors, nextStep}) => {

    const { obj } = useContext(StepFormContext)

    const [p, setP]=useState({
        title: "",
        description: ""
    })

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setP({ ...p, [name]: value })
    };

    const handleSub = () => {
        obj.title = p.title
        obj.description = p.description
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
                                value={obj.title ? obj.title : p.title}
                                onChange={handleChange}
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
                                type="textarea"
                                disabled
                                loading
                            />
                            :
                            <TextArea
                                name="description"
                                type="textarea"
                                minLength="2"
                                maxLength="250"
                                value={obj.description ? obj.description : p.description}
                                onChange={handleChange}
                                placeholder="description..."
                                error={errors.description ? errors.description : null}
                                required
                            />
                        }
                    </Item>

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