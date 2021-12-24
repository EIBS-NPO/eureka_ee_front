
import React, { useEffect} from "react";
import {withTranslation} from "react-i18next";


const Page404 = (props) => {

    useEffect(()=>{

            props.history.replace('/');


    },[])

}

export default withTranslation()(Page404);