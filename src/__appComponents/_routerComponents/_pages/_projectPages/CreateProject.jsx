import {Button, Form, Grid, Icon, Item, Label, Loader, Segment} from "semantic-ui-react";
import PictureForm from "../__CommonComponents/forms/picture/PictureForm";
import TextAreaMultilang from "../__CommonComponents/forms/TextAreaMultilang";
import React, {useState} from "react";
import {withTranslation} from "react-i18next";
import ProjectAPI from "../../../../__services/_API/projectAPI";
import fileAPI from "../../../../__services/_API/fileAPI";
import utilities from "../../../../__services/utilities";


const CreateProject = ({ history, t }) => {

    const [loader, setLoader] = useState(false)

    const [project, setProject] = useState( {
        picture: undefined,
        title: "",
        description: {},
        organization: {},
        startDate: "",
        endDate: ""
    })

    const [errors, setErrors] = useState({
        picture: "",
        name: "",
        type: "",
        email: "",
        phone: "",
    });

    const [dates, setDates] = useState({
        start:"",
        end:""
    })

    const minDateForEnd = () => {
        if(dates.start) {
            return utilities.addDaysToDate(dates.start, 1)
        }
        else return null
    }

    const maxDateForStart = () => {
        if(dates.end) {
            return utilities.removeDaysToDate(dates.start, 1)
        }
    }

    const [desc, setDesc] = useState({
        en:"",
        fr:"",
        nl:""
    })

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setProject({ ...project, [name]: value });
    };

    const handleChangeDates = (event) => {
        const { name, value } = event.currentTarget;
        setDates({ ...dates, [name]: value });
    };

    const preSubmit = (event) => {
        event.preventDefault()
        project.description = desc;
        project.startDate = dates.start
        project.endDate = dates.end
        handleSubmit()
    }

    const handleSubmit = async() => {
        setLoader(true)
        let newProject

        let response = await ProjectAPI.post(project)
            .catch(error => {
                console.log(error.response.data)
                setErrors(error.response.data);
            })
        if(response && response.status === 200){
            newProject = response.data[0]
        }

        if(project.picture){
            let bodyFormData = new FormData();
            bodyFormData.append('image', project.picture)
            bodyFormData.append('id', newProject.id)
            await fileAPI.uploadPic("project", bodyFormData)
                .catch(error => {
                    console.log(error.response)
                    setErrors({...error,"picture":error.response})
                })
        }

        history.replace("/project/creator_" + newProject.id)
    };

    return (
        <div className="card">
            <h1> {t('new_project')} </h1>
            {!loader &&
            <>
                <Segment>
                    <PictureForm entityType="project" entity={project} setter={setProject} />
                </Segment>
                <Form onSubmit={preSubmit} loading={loader}>
                    <Segment>
                        <Form.Input
                            iconPosition='left'

                            label={t('title')}
                            name="title"
                            value={project.title}
                            onChange={handleChange}
                            placeholder={t('title') + "..."}
                            type="text"
                            error={errors.title ? errors.title : null}
                            required
                        />
                    </Segment>
                    <Segment>
                        <Label attached="top">
                            { t('description') }
                        </Label>
                        <TextAreaMultilang  tabText={desc} setter={setDesc} name="description" min={2} max={500}/>
                    </Segment>
                    <Segment>
                        <Item.Group divided>
                            <Item>
                                <Label size="small" ribbon>
                                    Date de début
                                </Label>
                                {loader ?
                                    <Form.Input
                                        type="date"
                                        disabled
                                        loading
                                    />
                                    :
                                    <Form.Input
                                        name="start"
                                        type="date"
                                        value={ project.startDate ? project.startDate : dates.start }
                                        onChange={handleChangeDates}
                                        max={maxDateForStart()}
                                        error={errors.startDate ? errors.startDate : null}
                                    />
                                }
                            </Item>
                            <Item>
                                <Label size="small" ribbon>
                                    Date de fin
                                </Label>
                                {loader ?
                                    <Form.Input
                                        type="date"
                                        disabled
                                        loading
                                    />
                                    :
                                    <Form.Input
                                        name="end"
                                        type="date"
                                        value={ project.endDate ? project.endDate : dates.end}
                                        onChange={handleChangeDates}
                                        min={minDateForEnd()}
                                        error={errors.endDate ? errors.endDate : null}
                                    />
                                }
                            </Item>
                        </Item.Group>
                    </Segment>

                    <Button className="ui primary basic button" fluid animated >
                        <Button.Content visible>{ t('save') } </Button.Content>
                        <Button.Content hidden>
                            <Icon name='save' />
                        </Button.Content>
                    </Button>
                </Form>
            </>

            }
            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{t('loading') +" : " + t('creation') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }
        </div>
    )
};

export default withTranslation()(CreateProject);