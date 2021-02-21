
import React, {useEffect, useState} from "react";
import {Checkbox, Dropdown, Item, Label } from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import orgAPI from "../../../_services/orgAPI";

/**
 *
 * @param props
 * @project, @setter (setProject)
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSelector = ( props ) => {

    const handleSelect = (e, { value }) => {
        props.setter({ ...props.org, "orgId": value })
        // set id org in the select
        setSelected(value)
        console.log(selected)
        console.log(props.org)
    };
    const handleShow = () => {
        if(!toggleShow){
            setToggleShow(true)
        }else {
            setToggleShow(false)
            //todo j'aoute ca pour voir la gestion du null d'ici
            setSelected(null)
        }
    }
    const [toggleShow, setToggleShow] = useState()
    const [selected, setSelected] = useState("")
    const [options, setOptions] = useState([])
    const setOrgsOptions = (orgs) => {
        let table=[]
        orgs.map(o => (
            table.push({ key:o.id, value:o.id, text:o.name} )
        ))
        setOptions(table)
        if(props.project.organization){
            setSelected(props.project.organization.id)
        }
        setToggleShow(!!props.project.organization)
    }

    useEffect(() => {
        //load projects
        orgAPI.getMy()
            .then(response => {
                //          console.log(response.data)
                setOrgsOptions(response.data)
            })
            .catch(error => {
                console.log(error)
                //    setErrors(error.response)
            })
    },[])

    return (
        <>
            <Item.Group>
                <Item>
                    {toggleShow ?
                        <Label color="green" size="small" horizontal>
                            {props.t("yes")}
                        </Label>
                        :
                        <Label size="small" horizontal>
                            {props.t("no")}
                        </Label>
                    }

                    <Checkbox
                        name="toggleShow"
                        checked={toggleShow}
                        onChange={handleShow}
                        toggle
                    />
                </Item>

                {toggleShow &&
                <Item>
                    <Dropdown
                        fluid
                        search
                        selection

                        placeholder={props.t('organization_link')}
                        name="orgId"
                        value={selected && selected !== "" ? selected : null}
                        options={options}
                        onChange={handleSelect}
                    />
                </Item>
                }
            </Item.Group>
        </>
    )
}

export default withTranslation()(ProjectSelector)