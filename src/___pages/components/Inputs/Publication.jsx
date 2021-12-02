import {Checkbox, Item, Label} from "semantic-ui-react";
import React from "react";
import {useTranslation, withTranslation} from "react-i18next";


export const PublicationFormInput = ({t, publication, setPublication}) => {

    /*const handlePublication = () => {
        setPublication ( !publication )
        /!*if(!activity.isPublic){
            setActivity({ ...activity, "isPublic": true })
        }else {
            setActivity({ ...activity, "isPublic": false })
        }*!/
    }
*/
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

export const PublicationDisplay = ({activity}) => {

    //todo
    /*const { t } = useTranslation()
    return (
        <Item>
            {activity.isPublic ?
                <Label color="green" size="small" horizontal>
                    {t("public")}
                </Label>
                :
                <Label size="small" horizontal>
                    {t("private")}
                </Label>
            }
        </Item>
    )*/
}

export default withTranslation()(
    PublicationFormInput,
    PublicationDisplay
)