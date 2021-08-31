import React, {useEffect, useState} from "react";
import projectAPI from "../../../__services/_API/projectAPI";
import {Checkbox, Dropdown, Item, Label } from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";

/**
 *
 * @param props
 * @obj, @setter (setobj)
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSelector = ( {obj, setter} ) => {

    const { t } = useTranslation()

    const handleSelect = (e, { value }) => {
         setter({ ... obj, "projectId": value })
        // set id org in the select
        setSelected(value)
        console.log(selected)
        console.log( obj)
    };
    const handleShow = () => {
        if(!toggleShow){
            setToggleShow(true)
        }else {
            setToggleShow(false)
            //todo j'aoute ca pour voir la gestion du null d'ici
            setSelected(null)
            setter({ ... obj, "projectId": null })
        }
    }
    const [toggleShow, setToggleShow] = useState()
    const [selected, setSelected] = useState("")
    const [creatorOptions, setCreatorOptions] = useState([])
    const [assignOptions, setAssignOptions] = useState([])
    const setProjectOptions = (projects, listTarget) => {
        let table=[]
        projects.map(p => (
            table.push({ key:p.id, value:p.id, text:p.title} )
        ))
        if(listTarget === "creator"){ setCreatorOptions(table) }
        else if(listTarget === "assign"){ setAssignOptions(table) }
        /*if( obj.project){
            setSelected( obj.project.id)
        }
        setToggleShow(!! obj.project)*/
    }

    const initSelect = () => {
        if( obj.project){
            setSelected( obj.project.id)
        }
        setToggleShow(!! obj.project)
    }

    console.log(assignOptions)
    console.log(creatorOptions)
/*
    const addOptions = (projects, listTarget) => {
        let table=[]
        projects.map(p => (
            table.push({ key:p.id, value:p.id, text:p.title} )
        ))
        setOptions(table)
        if( obj.project){
            setSelected( obj.project.id)
        }
        setToggleShow(!! obj.project)
    }*/

    //todo only if toggle and the firstime
    useEffect(() => {
        //load projects
        projectAPI.get("creator")
            .then(response => {
                console.log(response.data)
                setProjectOptions(response.data, "creator")
            })
            .catch(error => {
                console.log(error)
                //    setErrors(error.response)
            })
        projectAPI.getAssigned()
            .then(response => {
                console.log(response.data)
                setProjectOptions(response.data, "assign")
            })
            .catch(error => {
                console.log(error)
            //    setErrors(error.response)
            })
        initSelect()
    },[])

    return (
        <>
            <Item.Group>
                <Item>
                    {toggleShow ?
                        <Label color="green" size="small" horizontal>
                            { t("yes")}
                        </Label>
                        :
                        <Label size="small" horizontal>
                            { t("no")}
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
                        placeholder={ t('project_link')}
                        name="projectId"
                        value={selected !== "" ? selected : null}
                        options={ creatorOptions }
                        onChange={handleSelect}
                    />
                        {/*<Dropdown.Menu>
                            <Dropdown.Header icon='tags' content={ t('my_project')} />
                            {creatorOptions.length > 0 && creatorOptions.map(p => (
                                <Dropdown.Item key={p.id} value={p.id}> { p.title }</Dropdown.Item>
                            ))}
                            <Dropdown.Header icon='tags' content={ t('my_assignments')} />
                            {assignOptions.length > 0 && assignOptions.map(p => (
                                <Dropdown.Item key={p.id} value={p.id}> { p.title }</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>*/}
                </Item>
                }
            </Item.Group>
        </>
    )
}

export default withTranslation()(ProjectSelector)