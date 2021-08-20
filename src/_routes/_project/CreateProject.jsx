
import React, {createContext, useContext, useState } from "react";
import { withTranslation } from 'react-i18next';

import AuthContext from "../../_contexts/AuthContext";
import {Form, Step, Button, Item, Segment, Icon, Message} from "semantic-ui-react";
import projectAPI from "../../_services/projectAPI";

import ProjectDescForm from "../../_components/forms/project/ProjectDescForm";
import ProjectDatingForm from "../../_components/forms/project/ProjectDatingForm";
import OrgLinkForm from "../../_components/forms/org/OrgLinkForm";
import ProjectFormResume from "../../_components/forms/project/ProjectFormResume";

export const StepFormContext = createContext({
    obj:{ },
    setObj: ( value ) => { },
    errors: { },
    setErrors: ( value ) => { }
})

const CreateProject = ({ history, t }) => {

    const isAuthenticated = useContext(AuthContext);

    const [stepList, setStepList] = useState([
        {id:0, name:t('summary'), isValid:false, state:"active"},
        {id:1, name:t("dating"), isValid:false, state:"disabled"},
        {id:2, name:t('linking'), isValid:false, state:"disabled"},
        {id:3, name:t('finish'), isValid:false, state:"disabled"}
    ])
    const [currentStep, setCurrentStep] = useState({id:0, name:"description", isValid:false})

    const [obj, setObj] = useState( {
        title: "",
        description: {},
        organization: {},
        startDate: "",
        endDate: ""
    })

    const handleNext = () => {
        currentStep.isValid = true
        currentStep.state = "completed"
        stepList.splice(currentStep.id, 1, currentStep)
        if(stepList.length > currentStep.id){
            setCurrentStep(stepList[currentStep.id + 1])
            stepList[currentStep.id + 1].state = "active"
        }
    }
/*
    const stepReturn = ({id}) => {
        console.log(id)
        console.log(stepList.find(step => step.id === {id}))
        setCurrentStep(stepList.find(step => step.id === id))
    }*/

    const GetStepState = ({step}) => {
        switch(step.state){
            case "active":
                return <Step active>
                            <Icon name='edit outline' />
                            <Step.Content>
                                <Step.Title>{step.name}</Step.Title>
                            </Step.Content>
                        </Step>
            case "completed":
                return <Step /*as="button" onSubmit={stepReturn(step.id)}*/ completed>
                        <Icon name='check circle outline' />
                        <Step.Content>
                            <Step.Title>{step.name}</Step.Title>
                        </Step.Content>
                    </Step>
            default:
                return <Step disabled>
                        <Step.Content>
                            <Step.Title>{step.name}</Step.Title>
                        </Step.Content>
                    </Step>
        }
    }

    const SwitchedStepBoard = () => {
        if (isAuthenticated === true) {
            history.replace('/');
        }
        switch(currentStep.name){
            case "description":
                return <ProjectDescForm loader={loader} errors={errors} nextStep={handleNext}/>
            case "dating":
                return <ProjectDatingForm loader={loader} errors={errors} nextStep={handleNext}/>
            case "linking":
                return <OrgLinkForm loader={loader} errors={errors} nextStep={handleNext}/>
            case "resume":
                return <ProjectFormResume loader={loader} errors={errors} nexStep={handleNext} history={history} />
        }
    }

    const [loader, setLoader] = useState(false)

    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault()

        projectAPI.post(obj)
            .then(response => {
                //        console.log(response.data)
                history.replace("/project/creator_" + response.data[0].id)
                }
            )
            .catch(error => {
                console.log(error.response.data.error)
                setErrors(error.response.data.error);
            })
            .finally(()=>setLoader(false))
    };

    const [errors, setErrors] = useState({
        title: "",
        description: "",
        organization: "",
        startDate: "",
        endDate: ""
    });

    const isRegistrable = () => {
        let c = true;
        stepList.map(s => {
            if(s.state !== "completed"){
                c =  false
            }
        })
        return c
    }

    return (
        <div className="card">
            <StepFormContext.Provider
                value={{
                    obj,
                    setObj
                }}
            >
                <Message
                    info compact color="teal" size="mini"
                    icon='idea'
                    header={ t('informations') }
                    content={ t('about_project') }
                />
                    <Form onSubmit={handleSubmit}>
                        <Step.Group size='mini'>
                            {stepList && stepList.map(s => (
                                <GetStepState key={s.id} step={s}/>
                            ))}
                        </Step.Group>
                    </Form>
                <Segment>
                    <SwitchedStepBoard />
                </Segment>

                {isRegistrable() === true &&
                    <Item>
                        <div className="inline-btn">
                            <Button type="submit" className="btn btn-success" > {t("save")} </Button>
                        </div>
                    </Item>
                }
            </StepFormContext.Provider>
        </div>
    );
};

export default withTranslation()(CreateProject);