import {Dropdown} from "semantic-ui-react";
import React, {useEffect, useRef} from "react";


const MultiSelect = ({optionsList, textKeyList = [], setSelected, loader} ) => {

    const dropRef = useRef("userDropSelect");

    //clear select when a new optionsList is loaded
    useEffect(()=>{
      //  console.log(dropRef.current);
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
        //months.splice(4, 1); pour suppr element 4
        console.log(data.value)
        let arr = []
        data.value.map((vId) => {
            let selected = optionsList.find(u => u.id === vId)
            if(selected !== undefined){arr.push(optionsList.find(u => u.id === vId))}
        })
        setSelected(arr);
    };

    return (
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
            placeholder='Select user'
            loading={loader}
        />
    /*<Dropdown
        fluid
        selection
        multiple={multiple}
        search={search}
        options={options}
        value={value}
        placeholder='Add Users'
        onChange={this.handleChange}
        onSearchChange={this.handleSearchChange}
        disabled={isFetching}
        loading={isFetching}
    />*/
    )
}

export default MultiSelect;