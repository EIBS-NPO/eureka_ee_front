import {Button, Form, Segment} from "semantic-ui-react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";

//todo check unused var
export const UserSearchMenu = ({handleSearch, forAdmin = false}) => {
    const { t } = useTranslation()
    const[loader, seLoader] = useState(false)
    const [user, setUser] = useState({})
    const [formErrors, setFormsErrors] = useState({
        email: "",
        lastname: "",
        firstname: "",
    })

    const [active, setActive] = useState("")

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (event, access, forAdmin, user = undefined) => {
        console.log(event.currentTarget.name)
        setActive(event.currentTarget.name)
        handleSearch(access, forAdmin, user)
    }

    return (
    <>
        <Segment attached='bottom' >
            <Form>
                <Form.Group className="center wrapped" widths="equals">
                    <Form.Input
                        icon='user'
                        iconPosition='left'
                        placeholder={t("firstname")}
                        name="firstname"
                        type="text"
                        value={user.firstname ? user.firstname : ""}
                        onChange={handleChange}
                        error={formErrors && formErrors.firstname ? formErrors.firstname : null}
                    />
                    <Form.Input
                        icon='user'
                        iconPosition='left'
                        placeholder={t("lastname")}
                        name="lastname"
                        type="text"
                        value={user.lastname ? user.lastname : ""}
                        onChange={handleChange}
                        error={formErrors && formErrors.lastname ? formErrors.lastname : null}
                    />
                    <Form.Input
                        icon='user'
                        iconPosition='left'
                        placeholder={t("email")}
                        name="email"
                        type="text"
                        value={user.email ? user.email : ""}
                        onChange={handleChange}
                        error={formErrors && formErrors.email ? formErrors.email : null}
                    />
                    {/*<Form.Button name="search" content={t('search')} basic color={active==="search"?"blue":"grey"}/>*/}
                    <Form.Field>
                        <Button name="search" content={t('search')}
                                onClick={(e)=>handleSubmit(e,"search", forAdmin, user)}
                                color={active==="search"?"blue":"grey"}
                                basic
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
            <Button name="all" content={t('all')}
                    onClick={(e)=>handleSubmit(e,"all", forAdmin)}
                    color={active==="all"?"blue":"grey"}
                    basic
            />

            <Button name="unConfirmed" content={t('unConfirmed')}
                    onClick={(e)=>handleSubmit(e,"unConfirmed", forAdmin)}
                    color={active==="unConfirmed"?"blue":"grey"}
                    basic
            />

            <Button name="disabled" content={t('disabled')}
                    onClick={(e)=>handleSubmit(e,"disabled", forAdmin)}
                    color={active==="disabled"?"blue":"grey"}
                    basic
            />
        </Segment>
    </>
    )
}