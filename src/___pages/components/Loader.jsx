import {Loader} from "semantic-ui-react";
import React from "react";

export const ContentContainer = ( props ) => {

 //   console.log(props.loaderActive)
    return(
        <div className="card">
            <LoaderWithMsg msg={props.loaderMsg} isActive={ props.loaderActive }/>
           { props.children }
        </div>
    )
}

export const LoaderWithMsg = ({ msg, isActive }) => {
    return (
        <Loader
            active={isActive}
            content={
                <p>{ msg }</p>
            }
        />
    )
}