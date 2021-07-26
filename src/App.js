
import './scss/main.scss';
import React, {Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'
import { Loader } from "semantic-ui-react";
import interreg_logo from "./_resources/logos/Interreg.jpg";

import authAPI from "./_services/authAPI";
import AuthContext from "./_contexts/AuthContext";
import MainMenu from "./_components/menus/MainMenu";
import LeftMenu from "./_components/menus/LeftMenu";
import Footer from "./_components/footer/Footer";

import PrivateRoute from "./_routes/PrivateRoute";

const Home = lazy(() => import('./_routes/Home'));
const About = lazy(() => import('./_routes/About'));
const Login = lazy(() => import('./_routes/_user/Login'));

const Register = lazy(() => import('./_routes/_user/Register'));
const CreateOrg = lazy(() => import('./_routes/_org/CreateOrg'));
const CreateProject = lazy(() => import('./_routes/_project/CreateProject'));
const CreateActivity = lazy(() => import('./_routes/_activity/CreateActivity'));

const ProfilUser = lazy(() => import('./_routes/_user/UserProfile'));
const ProfilOrg = lazy(() => import('./_routes/_org/OrgProfile'));
const ProfilProject = lazy(() => import('./_routes/_project/ProjectProfile'));
const ProfilActivity = lazy(() => import('./_routes/_activity/ActivityProfile'));

const OrgList = lazy(() => import('./_routes/_org/OrgList'));
const ProjectsList = lazy(() => import('./_routes/_project/ProjectsList'));
const ActivitiesList = lazy(() => import('./_routes/_activity/ActivitiesList'));

const AdminUsers = lazy(()=> import('./_routes/_admin/AdminUsers'))
const AdminOrgs = lazy(()=> import('./_routes/_admin/AdminOrgs'))
const AdminProjects = lazy(()=> import('./_routes/_admin/AdminProjects'))

 function App({history}) {
     authAPI.setup()

     const [isAuthenticated, setIsAuthenticated] = useState( authAPI.isAuthenticated() )
     const [firstname, setFirstname] = useState( authAPI.getFirstname())
     const [lastname, setLastname] = useState( authAPI.getLastname())
     const [isAdmin, setIsAdmin] = useState(authAPI.isAdmin())

  return (
      <AuthContext.Provider value={{
          isAuthenticated, setIsAuthenticated,
          firstname, setFirstname,
          lastname, setLastname,
          isAdmin, setIsAdmin
      }}>
          <Router>
              <div id="main">
                  <div id="main_top">
                      <div id="logo">
                          <img src={interreg_logo} alt="Eurekal logo"/>
                      </div>
                      <div id="main_menu" className="main_left">
                          <MainMenu props={history}/>
                      </div>
                  </div>
                  <div id="main_middle">
                      <LeftMenu />
                      <div id="main_content" className="main_left">
                          <Suspense fallback={<Loader content='Loading' />}>
                              <Switch>
                                  <Route exact path="/" component={Home}/>
                                  <Route path="/register" component={Register}/>
                                  <Route path="/login" component={Login}/>

                                  <Route path="/register" component={Register}/>
                                  <PrivateRoute path="/create_org" component={CreateOrg}/>
                                  <PrivateRoute path="/create_project" component={CreateProject}/>
                                  <PrivateRoute path="/create_activity" component={CreateActivity}/>

                                  <Route path="/all_organizations/:ctx" component={OrgList}/>
                                  <Route path="/all_projects/:ctx" component={ProjectsList}/>
                                  <Route path="/all_activities/:ctx" component={ActivitiesList}/>


                                  <PrivateRoute path="/profil_user" component={ProfilUser}/>
                                  <Route path="/org/:id" component={ProfilOrg}/>
                                  <Route path="/project/:id" component={ProfilProject}/>
                                  <Route path="/activity/:id" component={ProfilActivity}/>

                                  <PrivateRoute path="/admin/users" component={AdminUsers} />
                                  <PrivateRoute path="/admin/orgs" component={AdminOrgs} />
                                  <PrivateRoute path="/admin/projects" component={AdminProjects} />

                                  <Route path="/about" component={About}/>
                              </Switch>
                          </Suspense>
                      </div>
                  </div>
                 <Footer/>
              </div>
          </Router>
      </AuthContext.Provider>
  );
}

export default App;

