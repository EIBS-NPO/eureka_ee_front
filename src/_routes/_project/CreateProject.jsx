import React, {createContext, useContext, useEffect, useState} from "react";
import { withTranslation } from 'react-i18next';

import AuthContext from "../../_contexts/AuthContext";
import {Step, Button, Item, Segment, Icon} from "semantic-ui-react";
import AuthAPI from "../../_services/authAPI";

import ProjectDescForm from "../../_components/forms/project/ProjectDescForm";
import ProjectDatingForm from "../../_components/forms/project/ProjectDatingForm";
import OrgLinkForm from "../../_components/forms/org/OrgLinkForm";
import PublicationForm from "../../_components/forms/PublicationForm";
import ProjectFormResume from "../../_components/forms/project/ProjectFormResume";
import Organization from "../../_components/cards/organization";

//import StepFormContext from "../../_contexts/StepFormContext";

export const StepFormContext = createContext({
    obj:{ },
    setObj: ( value ) => { },
    currentStep:{ },
    setCurrentStep: ( value ) =>{ },
    stepList:[ ],
    setStepList: ( value ) => { }
})

const CreateProject = ({ history, t }) => {
    AuthAPI.setup();
    const isAuthenticated = useContext(AuthContext);
    if (isAuthenticated === true) {
        history.replace('/');
    }

  // const { obj, setObj, currentStep, setCurrentStep, stepList, setStepList } = useContext(StepFormContext)

    /*const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setProject({ ...project, [name]: value });
    };*/
    const [stepList, setStepList] = useState([
        {id:0, name:"description", isValid:false, state:"active"},
        {id:1, name:"dating", isValid:false, state:"diseable"},
        {id:2, name:"linking", isValid:false, state:"diseable"},
        {id:3, name:"publication", isValid:false, state:"diseable"},
        {id:4, name:"resume", isValid:false, state:"diseable"}
    ])
    const [currentStep, setCurrentStep] = useState({id:0, name:"description", isValid:false})

    const [obj, setObj] = useState( {
        title: "",
        description: "",
        organization: {},
        startDate: {},
        endDate: {},
        isPublic:false
    })

    const handleClick = ({id}) => {
        console.log(id)
        console.log(stepList.find(step => step.id === {id}))
     //   setCurrentStep(stepList.find(step => step.id === id))
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
                return <Step as="a" onClick={handleClick(step.id)} completed>
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
        switch(currentStep.name){
            case "description":
                return <ProjectDescForm loader={loader} errors={errors}/>
            case "dating":
                return <ProjectDatingForm loader={loader} errors={errors}/>
            case "linking":
                return <OrgLinkForm loader={loader} errors={errors}/>
            case "publication":
                return <PublicationForm loader={loader} errors={errors}/>
            case "resume":
                return <ProjectFormResume loader={loader} errors={errors}/>
        }
    }

    const [loader, setLoader] = useState(false)

    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault()

        /*ProjectAPI.post(project)
            .then(response =>
                console.log(response.data)
            )
            .catch(error => {
                console.log(error.response.data.error)
                setErrors(error.response.data.error);
            })
            .finally(()=>setLoader(false))*/
    };

    const [errors, setErrors] = useState({
        title: "",
        description: "",
        organization: "",
        startDate: "",
        endDate: "",
        isPublic:""
    });

    /*//todo possibilité de lier a une org ?  */
    /*//todo faire un truc etape par etape?*/
    /*//todo public ou non */

    return (
        <div className="card">
            <StepFormContext.Provider
                value={{
                    obj,
                    setObj,
                    currentStep,
                    setCurrentStep,
                    stepList,
                    setStepList
                }}
            >
                <Segment>
                    {/*<StepsRow />*/}
                    <Step.Group size='mini'>
                        {stepList && stepList.map(s => (
                            <GetStepState key={s.id} step={s}/>
                        ))}
                    </Step.Group>
                </Segment>
                <Segment>
                    <SwitchedStepBoard />
                </Segment>
                <Segment>

                {/*<Item>
                    <div className="inline-btn">
                            <Button type="submit" className="btn btn-success" onClik={handleSubmit}> Enregistrer </Button>

                            <Button type="submit" className="btn btn-success" disabled> Enregistrer </Button>
                    </div>
                </Item>*/}
                </Segment>
            </StepFormContext.Provider>
        </div>
    );
};

export default withTranslation()(CreateProject);