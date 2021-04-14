
import React, {useEffect, useState} from "react";
import {Checkbox, Dropdown, Item, Label, Message} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import orgAPI from "../../../_services/orgAPI";

/**
 *
 * @param* @project, @setter (setProject)
 * @returns {JSX.Element}
 * @constructor
 */
const OrgSelector = ({obj, setter} ) => {

    const { t } = useTranslation()
    const handleSelect = (e, { value }) => {
        setter({ ...obj, "orgId": value })
        // set id org in the select
        setSelected(value)
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
        if(obj.organization){
            setSelected(obj.organization.id)
        }
        setToggleShow(!!obj.organization)
    }

    //todo only if toggle and the firstime
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
                            { t("yes") }
                        </Label>
                        :
                        <Label size="small" horizontal>
                            { t("no") }
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
                    {options.length === 0 &&
                        <Message
                            info compact color="teal" size="mini"
                            icon='idea'
                            header={ t('informations') }
                            content={ t('about_orgLink') }
                        />
                    }
                    <Label>Choisissez une de vos organizations</Label>
                    <Dropdown
                        fluid
                        search
                        selection

                        placeholder={ t('organization_link') }
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

export default withTranslation()(OrgSelector)