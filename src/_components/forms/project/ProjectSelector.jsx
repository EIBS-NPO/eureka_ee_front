import React, {useEffect, useState} from "react";
import projectAPI from "../../../_services/projectAPI";
import {Checkbox, Dropdown, Item, Label } from "semantic-ui-react";
import {withTranslation} from "react-i18next";

/**
 *
 * @param props
 * @activity, @setter (setActivity)
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSelector = ( props ) => {

    const handleSelect = (e, { value }) => {
        props.setter({ ...props.activity, "projectId": value })
        // set id org in the select
        setSelected(value)
        console.log(selected)
        console.log(props.activity)
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
    const setProjectOptions = (projects) => {
        let table=[]
        projects.map(p => (
            table.push({ key:p.id, value:p.id, text:p.title} )
        ))
        setOptions(table)
        if(props.activity.project){
            setSelected(props.activity.project.id)
        }
        setToggleShow(!!props.activity.project)
    }

    useEffect(() => {
        //load projects
        projectAPI.get()
            .then(response => {
                //          console.log(response.data)
                setProjectOptions(response.data)
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

                        placeholder={props.t('project_link')}
                        name="projectId"
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