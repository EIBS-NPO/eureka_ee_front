import React, {useContext, useState} from "react";
import {Button, Form, Icon, Item, Label} from "semantic-ui-react";
import utilities from "../../../_services/utilities";
import { StepFormContext } from "../../../_routes/_project/CreateProject";
import {withTranslation} from "react-i18next";

const ProjectDatingForm = ({t, loader, errors, nextStep}) => {

    const { obj, setObj } = useContext(StepFormContext)

    const [dates, setDates] = useState({
        start:"",
        end:""
    })

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setDates({ ...dates, [name]: value });
    };

    const minDateForStart = utilities.formatDate(new Date())

    const minDateForEnd = () => {
        if(dates.start) {
        //    console.log(utilities.addDaysToDate(dates.start, 1))
            return utilities.addDaysToDate(dates.start, 1)
        }
         else return null
    }

    const handleSub = () => {
        obj.startDate = dates.start
        obj.endDate = dates.end
        nextStep()
    }

 //   console.log(obj)
    return (
        <>
            <Label attached='top'>
                <h4>Dating</h4>
            </Label>
        <Form onSubmit={handleSub}>
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
                                name="start"
                                type="date"
                                value={ obj.startDate ? obj.startDate : dates.start }
                                onChange={handleChange}
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
                                name="end"
                                type="date"
                                value={ obj.endDate ? obj.endDate : dates.end}
                                onChange={handleChange}
                                min={minDateForEnd()}
                                error={errors.endDate ? errors.endDate : null}
                            />
                        }
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


export default withTranslation()(ProjectDatingForm);