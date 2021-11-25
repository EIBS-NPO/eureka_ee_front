
import {Form, Icon, Item, Label} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import utilities from "../../__services/utilities";
import handleChange from "./forms/formsServices";
import React from "react";

export const StartDateFormInput = ({object, setObject, loader, errors}) => {

    const { t } = useTranslation()
    return (
        <Item>
            <Item.Content>
                <Item.Header>{ t("startDate") }</Item.Header>
                {loader ?
                    <Form.Input
                        type="date"
                        disabled
                        loading
                    />
                    :
                    <>
                        <Form.Input
                            name="startDate"
                            type="date"
                            iconPosition="left"
                            icon={ <Icon name="calendar alternate outline" color="blue"/> }
                            value={object.startDate}
                            onChange={(e)=>handleChange(e, object, setObject)}
                            max={object.endDate ? utilities.removeDaysToDate(object.endDate, 1): null}
                            error={errors && errors.startDate ? errors.startDate : null}
                        />
                    </>
                }
            </Item.Content>
        </Item>
    )
}

export const EndDateFormInput = ({object, setObject, loader, errors}) => {

    const { t } = useTranslation()
    return (
        <Item>
            <Item.Content>
                <Item.Header>{ t('endDate') }</Item.Header>

                {loader ?
                    <Form.Input
                        type="date"
                        disabled
                        loading
                    />
                    :
                    <Form.Input
                        name="endDate"
                        type="date"
                        iconPosition="left"
                        icon={ <Icon name="calendar alternate outline" color="blue"/> }
                        value={object.endDate}
                        onChange={(e)=>handleChange(e, object, setObject)}
                        min={object.startDate ? utilities.addDaysToDate(object.startDate, 1) : null }
                        error={errors && errors.endDate ? errors.endDate : null}
                    />
                }
            </Item.Content>
        </Item>
    )
}

export const DateDisplay = ({stringDate, dateName}) => {

    return (
        <Label className="column wrapped" basic>
            {dateName}
            <Label.Detail>{stringDate}</Label.Detail>
        </Label>
    )
}