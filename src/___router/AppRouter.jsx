import React, {lazy, Suspense } from "react";
import {Loader, Segment} from "semantic-ui-react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import '../scss/components/mainMenu.scss';

import PrivateRoute from "./PrivateRoute";
import Footer from "../___pages/components/Footer";
import HeaderMenu from "../___pages/components/menus/HeaderMenu";
import SideMenu from "../___pages/components/menus/SideMenu";
import AdminRoute from "./AdminRoute";

const Home = lazy(() => import('../___pages/HomePage'));
const Login = lazy(() => import('../___pages/LoginPage'));
const ForgotPassword = lazy(() => import('../___pages/ForgotPassword'));
const Register = lazy(() => import('../___pages/RegisterPage'));
const Activation = lazy(()=> import('../___pages/ActivationPage'))

const CreateOrg = lazy(() => import('../___pages/_orgPages/CreateOrg'));
const CreateProject = lazy(() => import('../___pages/_projectPages/CreateProject'));
const CreateActivity = lazy(() => import('../___pages/_activityPages/CreateActivity'));

const ProfilUser = lazy(() => import('../___pages/_userPages/UserProfile'));

 const ProfilOrg = lazy(() => import('../___pages/_orgPages/OrgProfile'));

const ProfilProject = lazy(() => import('../___pages/_projectPages/ProjectProfile'));
const ProfilActivity = lazy(() => import('../___pages/_activityPages/ActivityProfile'));

const OrgList = lazy(() => import('../___pages/_orgPages/OrgList'));
const ProjectsList = lazy(() => import('../___pages/_projectPages/ProjectsList'));
const ActivitiesList = lazy(() => import('../___pages/_activityPages/ActivitiesList'));

const AdminUsers = lazy(()=> import('../___pages/_userPages/AdminUsers'))
const AdminOrgs = lazy(()=> import('../___pages/_orgPages/AdminOrgs'))
const AdminProjects = lazy(()=> import('../___pages/_projectPages/AdminProjects'))

const AppRouter = () => {

    return (
        <Router>
            <HeaderMenu/>
            <Segment basic padded>
                <SideMenu/>
                <Segment id="main" basic>
                    <Suspense fallback={<Loader content='Loading' />}>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/register" component={Register}/>
                            <Route path="/activation/:token" component={Activation}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/forgot_password/:token" component={ForgotPassword}/>

                            <Route path="/all_organizations/:ctx" component={OrgList}/>
                            <Route path="/all_projects/:ctx" component={ProjectsList}/>
                            <Route path="/all_activities/:ctx" component={ActivitiesList}/>

                            <Route path="/org/:id" component={ProfilOrg}/>
                            <Route path="/project/:id" component={ProfilProject}/>
                            <Route path="/activity/:id" component={ProfilActivity}/>
                            <PrivateRoute path="/account" component={ProfilUser}/>

                            <PrivateRoute path="/create_org" component={CreateOrg}/>
                            <PrivateRoute path="/create_project" component={CreateProject}/>
                            <PrivateRoute path="/create_activity" component={CreateActivity}/>

                            <AdminRoute path="/admin/users" component={AdminUsers} />
                            <AdminRoute path="/admin/orgs" component={AdminOrgs} />
                            <AdminRoute path="/admin/projects" component={AdminProjects} />

                        </Switch>
                    </Suspense>
                </Segment>
            </Segment>
            <Footer/>
        </Router>
    )
}

export default AppRouter;