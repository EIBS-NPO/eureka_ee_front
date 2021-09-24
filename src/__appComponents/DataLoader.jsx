import React, {useContext, useEffect} from "react";
import LoaderContext from "../__appContexts/LoaderContext";


const DataLoader = (props) => {

    const {callAPI, setData, data} = useContext(LoaderContext)

//    const contentChildren = props.children;

 /*   props.addChild({data})*/
    useEffect(()=>{
        console.log(callAPI)
        if(callAPI !== undefined){
            let res = callAPI()
            console.log(res)
            setData(res)
          //  props.addChild({data})
        }
    },[callAPI])

    return (
        <>{props.children}</>
    )
}

export default DataLoader