
import React, {useContext, useEffect, useState} from "react";
/*import { withTranslation } from 'react-i18next';*/
import {Checkbox, Icon, Button, Form, Item, Label, Dropdown} from "semantic-ui-react";
import orgAPI from "../../../_services/orgAPI";
import { StepFormContext } from "../../../_routes/_project/CreateProject";

const OrgLinkForm = ({loader, errors}) => {

    const { obj, setObj, currentStep, setCurrentStep, stepList, setStepList } = useContext(StepFormContext)

    const handleChange = ({e, value }) => {
        setObj({ ...obj, "organization": value });
        console.log(value)
        console.log(obj)
    };

        const [toggleShow, setToggleShow] = useState(false)

    const handleShow = () => {
        if(!toggleShow){
            setToggleShow(true)
        }else {
            setToggleShow(false)
            setObj({...obj, organization: null})
        }
    }

    const [options, setOptions] = useState([])
   // console.log(options)

    const setOrgsOptions = (orgs) => {
        let table=[];
        orgs.map(org => (
            table.push({ key:org.id, value:org.id, text:org.name} )
            )
        )
        setOptions(table)
    }

    const setDropValue = (obj) => {
        let  res = null
        if(obj.organization !== null){
            if(obj.organization.id){
                res = obj.organization.id
            }else {
                res = obj.organization
            }
        }
        console.log(res)
        return res
    }

    const handleSub = () => {
        currentStep.isValid = true
        currentStep.state = "completed"
        stepList.splice(currentStep.id, 1, currentStep)
        setCurrentStep(stepList[currentStep.id + 1])
        stepList[currentStep.id + 1].state = "active"
        console.log(stepList)
    }

    {/*//todo rechercher les org en tant que referrent et en tant que membre!*/}
    useEffect(() => {
        orgAPI.getMy()
            .then(response => {
                setOrgsOptions(response.data)
            })
            .catch(error => console.log(error.response))
    },[])

    return (
        <Form onSubmit={handleSub}>
            <Item.Group>
                <Item.Group>
                    <Item>
                        <Item.Content>
                            <Label attached='top'>
                                <h4>Lier à une Organisation</h4>
                            </Label>
                        </Item.Content>
                    </Item>
                    <Item>
                        <Checkbox
                            name="toggleShow"
                            onChange={handleShow}
                            toggle
                        />
                    </Item>
                    {toggleShow &&
                        <Item>
                            <Label size="small" ribbon>
                                Organisations
                            </Label>
                            {loader ?
                                <Form.Input
                                    type="text"
                                    disabled
                                    loading
                                />
                                :
                                <Dropdown
                                    fluid
                                    search
                                    selection

                                    placeholder='Select the organization'
                                    name="organization"
                                    value={setDropValue}
                                    options={options}
                                    onChange={handleChange}
                                />
                            }
                        </Item>
                    }

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


export default OrgLinkForm;