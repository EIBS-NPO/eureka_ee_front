import React, {lazy, Suspense, useEffect, useState} from "react";
import {Container, Loader, Segment} from "semantic-ui-react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";

import '../scss/components/mainMenu.scss';

import PrivateRoute from "./_routerComponents/PrivateRoute";
import Footer from "./_routerComponents/_mainComponents/Footer";
import HeaderMenu from "./_routerComponents/_menuComponents/HeaderMenu";
import SideMenu from "./_routerComponents/_menuComponents/SideMenu";

const Home = lazy(() => import('./_routerComponents/_pages/HomePage'));
const Login = lazy(() => import('./_routerComponents/_pages/LoginPage'));
const Register = lazy(() => import('./_routerComponents/_pages/RegisterPage'));
const Activation = lazy(()=> import('./_routerComponents/_pages/ActivationPage'))

const CreateOrg = lazy(() => import('./_routerComponents/_pages/_orgPages/CreateOrg'));
const CreateProject = lazy(() => import('./_routerComponents/_pages/_projectPages/CreateProject'));
const CreateActivity = lazy(() => import('./_routerComponents/_pages/_activityPages/CreateActivity'));

const ProfilUser = lazy(() => import('./_routerComponents/_pages/_userPages/UserProfile'));
const ProfilOrg = lazy(() => import('./_routerComponents/_pages/_orgPages/OrgProfile'));
// const ProfilOrg = lazy(() => import('./_routerComponents/_pages/_orgPages/ProfilOrg2'));
const ProfilProject = lazy(() => import('./_routerComponents/_pages/_projectPages/ProjectProfile'));
const ProfilActivity = lazy(() => import('./_routerComponents/_pages/_activityPages/ActivityProfile'));

const OrgList = lazy(() => import('./_routerComponents/_pages/_orgPages/OrgList'));
const ProjectsList = lazy(() => import('./_routerComponents/_pages/_projectPages/ProjectsList'));
const ActivitiesList = lazy(() => import('./_routerComponents/_pages/_activityPages/ActivitiesList'));

const AdminUsers = lazy(()=> import('./_routerComponents/_pages/_userPages/AdminUsers'))
const AdminOrgs = lazy(()=> import('./_routerComponents/_pages/_orgPages/AdminOrgs'))
const AdminProjects = lazy(()=> import('./_routerComponents/_pages/_projectPages/AdminProjects'))

const Page404 = lazy(()=>import('./_routerComponents/_pages/Page404'))



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

                            <Route path="/all_organizations/:ctx" component={OrgList}/>
                            <Route path="/all_projects/:ctx" component={ProjectsList}/>
                            <Route path="/all_activities/:ctx" component={ActivitiesList}/>

                            <Route path="/org/:id" component={ProfilOrg}/>
                            <Route path="/project/:id" component={ProfilProject}/>
                            <Route path="/activity/:id" component={ProfilActivity}/>
                            {/*<PrivateRoute path="/account" component={ProfilUser}/>*/}
                            <Route path="/account" component={ProfilUser}/>

                            <PrivateRoute path="/create_org" component={CreateOrg}/>
                            {/* <Route path="/create_org" component={CreateOrg}/>*/}
                            <PrivateRoute path="/create_project" component={CreateProject}/>
                            {/*<Route path="/create_project" component={CreateProject}/>*/}
                            <PrivateRoute path="/create_activity" component={CreateActivity}/>
                            {/* <Route path="/create_activity" component={CreateActivity}/>*/}

                            <PrivateRoute path="/admin/users" component={AdminUsers} />
                            <PrivateRoute path="/admin/orgs" component={AdminOrgs} />
                            <PrivateRoute path="/admin/projects" component={AdminProjects} />

                        </Switch>
                    </Suspense>
                </Segment>
            </Segment>
            <Footer/>
        </Router>
    )
}

export default AppRouter;