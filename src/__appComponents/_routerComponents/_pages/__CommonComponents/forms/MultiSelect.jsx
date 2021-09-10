import {Dropdown} from "semantic-ui-react";
import React from "react";


const MultiSelect = ({optionsList, textKeyList = [], setSelected, loader} ) => {

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
                //image: opt.picture ? { avatar: true, src: `data:image/jpeg;base64,${ opt.picture }` } : undefined,
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

    const onChange = (event, data) => {
        /*setSelected(
            optionsList.find( o => o.id.toString() === data.value)
        );*/
        //setSelected(data.value)
        let arr = []
        data.value.map(vId => arr.push(optionsList.find( u => u.id === vId)))
        setSelected(arr);
    };


    return (
        <Dropdown
            id="userDropSelect"
            clearable
            fluid
            multiple
            search
            selection
            closeOnChange
            options={getOptions()}
            onChange={onChange}
            placeholder='Select user'
            loading={loader}
        />
    )
}

export default MultiSelect;