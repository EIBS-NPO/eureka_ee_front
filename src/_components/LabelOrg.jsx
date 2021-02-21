
import {Image, Label} from "semantic-ui-react";
import React from "react";
import {withTranslation} from "react-i18next";
import Picture from "./Picture";

const LabelOrg = ({ org, t} ) => {

    //   console.log(user)
    return (
        <Label as='a' basic image>
           {/* <Picture size="small" picture={org.picture} isFloat={"left"}/>*/}

            {org.name}

            <Label.Detail>{ org.type }</Label.Detail>

        </Label>
    )
}

export default withTranslation()(LabelOrg);