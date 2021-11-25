import {Button, Container, Dropdown, Message} from "semantic-ui-react";
import React, {useEffect, useRef, useState} from "react";
import {useTranslation, withTranslation} from "react-i18next";


export function RefreshOptionAndDroppedSelection(options, droppedSelection, initialObjectId, updatedObject) {

    let index = options.indexOf(options.find(a => a.id === initialObjectId))
    options.splice(index, 1, updatedObject);

    //force eventually DropSelected refresh
 //   let dropIsRefresh = false
    index = droppedSelection.indexOf(droppedSelection.find(a => a.id === initialObjectId))
    if (index !== -1) {
        droppedSelection.splice(index, 1, updatedObject);
     //   dropIsRefresh = true
    }

  //  return {options:options, dropIsRefresh:dropIsRefresh, droppedSelection:droppedSelection}
}

const MultiSelect = ({optionsList, textKeyList = [], setSelected, placeholder, loader} ) => {
    const dropRef = useRef("userDropSelect");

    //todo mult select fait iech pour la maj des options et selected,
    // faire passer option et selected en props.?
    const { t } = useTranslation()
    const [selectLoader, setSelectLoader] = useState(false)

    //clear select when a new optionsList is loaded
    useEffect(()=>{
        dropRef.current.clearValue()
    },[optionsList])

    const makeText = (subject) => {
        let text = ""
            textKeyList.map(textKey => {
                text += subject[textKey] + " "
            })
        return text
    }

    const getOptions = () => {
        let options = []
        optionsList.length > 0 && optionsList.map((opt, key) => {
            options.push({
                image: { avatar: true, src:
                                    opt.picture ? `data:image/jpeg;base64,${ opt.picture }`
                                :   'https://react.semantic-ui.com/images/wireframe/square-image.png'
                },
                key:opt.id?opt.id:key,
                value: opt.id,
                text:makeText(opt)
            })
        })

        return options
    }

    const onChange = async (event, data) => {
        setSelectLoader(true)
        let arr = []
        await data.value.map((vId) => {
            let selected = optionsList.find(u => u.id === vId)
            if (selected !== undefined) {
                arr.push(selected)
            }
        })
        setSelected(arr);
        setSelectLoader(false)
    };

    const selectAll = async () => {
        await dropRef.current.clearValue()
        await setSelected(optionsList)
    }

    return (
        <>
            <Container textAlign="center">
                <Message info size="mini">
                    {loader && <p>{t('loading')}</p>}
                    {!loader && optionsList.length === 0 && <p>{ t('no_result') }</p>}
                    {!loader && optionsList.length > 0 && <p>{optionsList.length +" results"}</p>}
                </Message>
            </Container>

            <Dropdown
                id="userDropSelect"
                ref={dropRef}
                clearable
                fluid
                multiple
                search
                selection
                closeOnChange
                options={getOptions()}
                onChange={onChange}
                placeholder={placeholder}
                loading={loader}
                disabled={optionsList.length <= 0}
            />
            <Button name="selectAll" content={t('all')}
                    onClick={()=>selectAll()}
                    color="blue"
                    disabled={optionsList.length <= 0}
                    basic
            />
        </>
    )
}

export default withTranslation()(MultiSelect);