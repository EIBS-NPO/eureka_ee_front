import React, {createContext, useContext, useEffect, useState} from "react";
import { withTranslation } from 'react-i18next';

import AuthContext from "../../_contexts/AuthContext";
import {Form, Step, Button, Item, Segment, Icon} from "semantic-ui-react";
import AuthAPI from "../../_services/authAPI";
import projectAPI from "../../_services/projectAPI";

import ProjectDescForm from "../../_components/forms/project/ProjectDescForm";
import ProjectDatingForm from "../../_components/forms/project/ProjectDatingForm";
import OrgLinkForm from "../../_components/forms/org/OrgLinkForm";
import PublicationForm from "../../_components/forms/PublicationForm";
import ProjectFormResume from "../../_components/forms/project/ProjectFormResume";

export const StepFormContext = createContext({
    obj:{ },
    setObj: ( value ) => { },
    errors: { },
    setErrors: ( value ) => { }
    /*currentStep:{ },
    setCurrentStep: ( value ) =>{ },
    stepList:[ ],
    setStepList: ( value ) => { }*/
})

const CreateProject = ({ history, t }) => {
    AuthAPI.setup();
    const isAuthenticated = useContext(AuthContext);
    if (isAuthenticated === true) {
        history.replace('/');
    }

    const [stepList, setStepList] = useState([
        {id:0, name:"description", isValid:false, state:"active"},
        {id:1, name:"dating", isValid:false, state:"disabled"},
        {id:2, name:"linking", isValid:false, state:"disabled"},
        {id:3, name:"publication", isValid:false, state:"disabled"},
        {id:4, name:"resume", isValid:false, state:"disabled"}
    ])
    const [currentStep, setCurrentStep] = useState({id:0, name:"description", isValid:false})

    const [obj, setObj] = useState( {
        title: "",
        description: "",
        organization: {},
        startDate: "",
        endDate: "",
        isPublic:false
    })

    const handleNext = () => {
        currentStep.isValid = true
        currentStep.state = "completed"
        stepList.splice(currentStep.id, 1, currentStep)
        if(stepList.length > currentStep.id){
            setCurrentStep(stepList[currentStep.id + 1])
            stepList[currentStep.id + 1].state = "active"
        }
    /*todo sinon on est a la fin de from fair epage de requete et de resultat*/
        console.log(stepList)
        console.log(obj)
    }

    const stepReturn = ({id}) => {
        console.log(id)
        console.log(stepList.find(step => step.id === {id}))
        setCurrentStep(stepList.find(step => step.id === id))
    }

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
            case "publication":
                return <PublicationForm loader={loader} errors={errors} nextStep={handleNext}/>
            case "resume":
                return <ProjectFormResume loader={loader} errors={errors} nexStep={handleNext} history />
        }
    }

    const [loader, setLoader] = useState(false)

    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault()

        projectAPI.post(obj)
            .then(response =>
                console.log(response.data)
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
        endDate: "",
        isPublic:""
    });

    /*//todo verifier par isValid aussi, avec retour erreurs.*/
    const isRegistrable = () => {
        let c = true;
        stepList.map(s => {
            if(s.state !== "completed"){
                c =  false
            }
        })
        return c
    }

    /*//todo possibilité de lier a une org ?  */
    /*//todo faire un truc etape par etape?*/
    /*//todo public ou non */

    return (
        <div className="card">
            <StepFormContext.Provider
                value={{
                    obj,
                    setObj
                }}
            >
                    <Form onSubmit={handleSubmit}>
                        {/*<StepsRow />*/}
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