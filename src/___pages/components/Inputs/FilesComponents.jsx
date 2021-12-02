
import React, {useContext, useState} from "react";
import {Button, Container, Form, Header, Icon, Item, Message, Segment} from "semantic-ui-react";
import MediaContext from "../../../__appContexts/MediaContext";
import { useTranslation } from "react-i18next";
import activityAPI from "../../../__services/_API/activityAPI";
import {HandleUpdateActivity} from "../../../__services/_Entity/activityServices";
import AuthContext from "../../../__appContexts/AuthContext";
import {ConfirmActionForm } from "../forms/formsServices";
import {BtnDelete } from "./Buttons";
import utilities from "../../../__services/utilities";

/**
 *
 * @param file
 * @returns {JSX.Element}
 * @constructor
 * @author Thierry Fauconnier <th.fauconnier@outlook.fr>
 */
export const FileInfos = ( { activity } ) => {

    const { t } = useTranslation()

    const isFromDB = activity && activity.filename && activity.file === undefined

    const fileSize =
        (activity && activity.file && activity.file.size) ? activity.file.size
            : activity && activity.size ? activity.size : undefined

    const filename =
        activity && activity.file && activity.file.name ?
            activity.file.name
            : activity && activity.filename ? activity.filename : undefined

    const isValid = isFromDB ? true : activity && activity.isValid

    return (
        <Item>

            {!fileSize &&
            <Header icon>
                <Icon name='pdf file outline'/>
                {t('no_file')}
            </Header>
            }

            {fileSize && isValid !== undefined &&
            <Header icon color = { isFromDB ? "blue" : isValid ? "teal" : "red" }>
                <Icon name='file pdf' />
                <p>{ filename }</p>
                <p>{utilities.octetsToKilos(fileSize) + "kB"}</p>
            </Header>
            }
        </Item>
    )
}

export const FileUploadFormInput = ({activity, setActivity}) => {

    const { t } = useTranslation()
    const allowedMimes = useContext(MediaContext).allowedMimes

    const [isValid, setIsValid] = useState(undefined)

    const onInputChange = async (e) => {

        if (e.target.files[0]) {
            new FileReader().readAsDataURL(e.target.files[0])

          let isV = allowedMimes.includes(e.target.files[0].type)
            setIsValid(isV)
            setActivity( {
                ...activity,
                file: e.target.files[0],
                isValid: isV
            } )

            e.target.value = null
        }
    }

    return (
        <Item>
            <label htmlFor="inputUploadFile" className="ui basic button mini">
                <Icon name='pdf file outline' color={ isValid === undefined ? "blue" : isValid ? "teal" : "red" } />
                { t('select') }
                <input
                    lang="en"
                    type='file'
                    accept={allowedMimes.join(',')}
                    onChange={onInputChange}
                    id="inputUploadFile"
                    hidden
                />
            </label>

            { activity.file && isValid !== undefined &&
                <Message
                    negative = { isValid === false }
                    info = { isValid === true }
                >
                    { isValid ?
                        <Header> { t('file_ready') } </Header>
                    :
                        <p>{t("Supported_Media_Type") + allowedMimes.join(', ')} </p>
                    }
                </Message>
            }
        </Item>
    )
}

export const FileUploadForm = ({t, activity, postTreatment, error, history, forAdmin = false, onClose = undefined}) => {

    const { isAdmin } = useContext(AuthContext).isAdmin
    const [loader, setLoader] = useState( false )
    const [errors, setErrors] = useState(error ? error : undefined)

    const [updatedActivity, setUpdatedActivity] = useState({
        id:activity.id,
        size: activity.size ? activity.size : undefined,
        filename: activity.filename ? activity.filename : undefined,
        fileType: activity.fileType ? activity.fileType : undefined,
        isValid : activity.size ? true : undefined,
        file: undefined
    })

    const cantSave = () => {
        return updatedActivity.file === undefined || (updatedActivity.file && !updatedActivity.isValid)
    }

    const handleCancel = (e) => {
        e.preventDefault()
        setUpdatedActivity({ ...updatedActivity, file:undefined })
   //     if(onClose !== undefined) onClose(e)
    }

    const preSubmit = async () => {
        await HandleUpdateActivity({
                id: activity.id,
                file: updatedActivity.file
            },
            postTreatment, setLoader, setErrors, history, forAdmin && isAdmin)
    }

    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const handleDelete = async () => {
        await HandleUpdateActivity({
                id: activity.id,
                file: null
            },
            postTreatment, setLoader, setErrors, history, forAdmin && isAdmin)
    }

    return (
        <Item>
            <Form onSubmit={preSubmit} loading={loader}>
                <FileInfos activity = { updatedActivity } />
                <FileUploadFormInput activity = {updatedActivity} setActivity = {setUpdatedActivity} />

                {updatedActivity.file &&
                <Segment className="center" basic>
                    <Form.Group>
                        <Button.Group>
                            <Button size="small" onClick={handleCancel} disabled={!updatedActivity.file}> { t("cancel") } </Button>
                            <Button.Or />
                            <Button size="small" positive disabled={cantSave()}>
                                { t("save") }
                            </Button>
                        </Button.Group>
                    </Form.Group>
                </Segment>
                }
            </Form>

            {updatedActivity.size &&
                <Segment basic>
                    {deleteConfirm &&
                        <ConfirmActionForm t={t}
                                           confirmMessage={t("are_you_sure?")}
                                           confirmAction={handleDelete}
                                           cancelAction={() => setDeleteConfirm(false)}
                                           cancelLabel={"no"}
                                           submitLabel={"yes"}
                        />
                    }

                    {!deleteConfirm &&
                    <BtnDelete t={t} deleteAction={() => setDeleteConfirm(true)}/>
                    }
                </Segment>

            }

            {errors && errors.file &&
            <Message negative>
                <Message.Item> {t(errors.file)} </Message.Item>
            </Message>
            }
        </Item>
    )
}

export const FileDownloadForm = ({ activity, isAdmin = undefined}) => {

    const { t } = useTranslation()

    const [loader, setLoader]= useState(false)

    const downloadFile = () => {
        setLoader(true)
        activityAPI.download(activity, isAdmin)
            .then(response => {
                let blob = new Blob([response.data], { type: activity.fileType });
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = activity.filename
                link.click()
            }).catch(error => {
            console.log(error)
        })
            .finally(() => setLoader(false))
    }

    return (
        <Segment className="heightLess w-70 margAuto" placeholder loading={loader}>
            <>
                <FileInfos activity={ activity } />
                <Container textAlign='center'>
                    <Button fluid animated onClick={downloadFile} disabled={!activity.fileType}>
                        <Button.Content visible>
                            { t('download') }
                        </Button.Content>
                        <Button.Content hidden>
                            <Icon name='download'/>
                        </Button.Content>
                    </Button>
                </Container>
            </>
        </Segment>
    )
}