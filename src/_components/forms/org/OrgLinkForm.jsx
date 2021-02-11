
import React, {useContext, useEffect, useState} from "react";
import { withTranslation } from 'react-i18next';
import {Loader, Checkbox, Icon, Button, Form, Item, Label, Dropdown} from "semantic-ui-react";
import orgAPI from "../../../_services/orgAPI";
import { StepFormContext } from "../../../_routes/_project/CreateProject";

const OrgLinkForm = ({t, loader, errors, nextStep}) => {

    const { obj, setObj } = useContext(StepFormContext)

    const [selected, setSelected] = useState("")

    const handleChange = (e, { value }) => {
        console.log(value)
        setSelected(value)
    };

    const [toggleShow, setToggleShow] = useState(false)

    const handleShow = () => {
        if(!toggleShow){
            setToggleShow(true)
        }else {
            setToggleShow(false)
            setSelected("")
        }
    }


    const [orgs, setOrgs] = useState([])
    const [options, setOptions] = useState([])
    console.log(options)
    const setOrgsOptions = (orgs) => {
        console.log(orgs)
        setOrgs(orgs)
        let table=[];
        orgs.map(org => (
            table.push({ key:org.id, value:org.id, text:org.name} )
            )
        )
        setOptions(table)
    }

    const [orgLoader, setOrgLoader] = useState(false)

    const handleSub = () => {
        let value = orgs.find(o => o.id === selected)
        setObj({ ...obj, organization: value });
        nextStep()
    }

    {/*//todo rechercher les org en tant que referrent et en tant que membre!*/}
    useEffect(() => {
            setOrgLoader(true)
            orgAPI.getMy()
                .then(response => {
                    //console.log(response.data)
                    setOrgsOptions(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(()=>setOrgLoader(false))
    },[])

    return (
        <>
        <Label attached='top'>
            <h4>Lier à une Organisation</h4>
        </Label>
        <Form onSubmit={handleSub}>
                <Item.Group>
                    {orgLoader ?
                        <Loader active inline="centered" />
                        :
                        <>
                            <Item>
                                {toggleShow ?
                                    <Label color="green" size="small" horizontal>
                                        {t("yes")}
                                    </Label>
                                    :
                                    <Label size="small" horizontal>
                                        {t("no")}
                                    </Label>
                                }

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
                                    <Dropdown
                                        fluid
                                        search
                                        selection

                                        placeholder='Select the organization'
                                        name="organization"
                                        value={selected && selected !=="" ? selected : null  }
                                        options={options}
                                        onChange={handleChange}
                                    />
                                </Item>
                             }
                        </>
                    }

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


export default withTranslation()(OrgLinkForm);