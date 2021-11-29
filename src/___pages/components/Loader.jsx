import {Loader, Segment} from "semantic-ui-react";
import React from "react";

export const ContentContainer = ( props ) => {

    console.log(props.loaderActive)
    return(
        <Segment className="card">
            <LoaderWithMsg msg={props.loaderMsg} isActive={ props.loaderActive }/>
           { props.children }
        </Segment>
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