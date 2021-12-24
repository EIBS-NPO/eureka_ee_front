import {Checkbox, Item, Label} from "semantic-ui-react";
import React from "react";
import { withTranslation } from "react-i18next";


export const PublicationFormInput = ({t, publication, setPublication}) => {

    return (
        <Item>
            {publication ?
                <Label color="green" size="small" horizontal>
                    {t("public")}
                </Label>
                :
                <Label size="small" horizontal>
                    {t("private")}
                </Label>
            }
            <Checkbox
                name='isPublic'
                defaultChecked={publication}
                onChange={ () => setPublication ( !publication ) }
                toggle
            />
        </Item>
    )
}

export default withTranslation()(
    PublicationFormInput
)