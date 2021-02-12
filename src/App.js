import './scss/main.scss';
import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'
import { Loader } from "semantic-ui-react";

/*import eureka_logo from "./_resources/logos/eureka_logo.png"*/
import interreg_logo from "./_resources/logos/Interreg.jpg"

import AuthAPI from "./_services/authAPI";
import AuthContext from "./_contexts/AuthContext";
import MainMenu from "./_components/menus/MainMenu";
import LeftMenu from "./_components/menus/LeftMenu";
import Footer from "./_components/footer/Footer";

import PrivateRoute from "./_components/PrivateRoute";


const Home = lazy(() => import('./_routes/Home'));
const About = lazy(() => import('./_routes/About'));
const Login = lazy(() => import('./_routes/_user/Login'));

const Register = lazy(() => import('./_routes/_user/Register'));
const CreateOrg = lazy(() => import('./_routes/_org/CreateOrg'));
const CreateProject = lazy(() => import('./_routes/_project/CreateProject'));

const ProfilUser = lazy(() => import('./_routes/_user/ProfilUser'));
const ProfilOrg = lazy(() => import('./_routes/_org/ProfilOrg'));
const ProfilProject = lazy(() => import('./_routes/_project/ProfilProject'));

const AllOrg = lazy(() => import('./_routes/_org/GetAllOrg'));
const MyOrg = lazy(() => import('./_routes/_org/MyOrg'));
const PublicProjects = lazy(() => import('./_routes/_project/PublicProjects'));
const MyProjects = lazy(() => import('./_routes/_project/MyProjects'));

/*const UpdateUser = lazy(() => import('./_routes/_user/UpdateUser'));*/
const UpdateOrg = lazy(() => import('./_routes/_org/UpdateOrg'));
const UpdateProject = lazy(() => import('./_routes/_project/UpdateProject'));

//footer
const Beweging = lazy(() => import('./_routes/_partners/beweging'));

 function App({history}) {
    AuthAPI.setup();

    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthAPI.isAuthenticated()
    );

  return (
      <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
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
                          {/*<Suspense fallback={<div>Chargement...</div>}>*/}
                          <Suspense fallback={<Loader content='Loading' />}>
                              <Switch>
                                  <Route exact path="/" component={Home}/>
                                  <Route path="/login" component={Login}/>

                                  <Route path="/register" component={Register}/>
                                  <Route path="/create_org" component={CreateOrg}/>
                                  <Route path="/create_project" component={CreateProject}/>

                                  <Route path="/all_organizations" component={AllOrg}/>

                                  <Route path="/my_organizations" component={MyOrg}/>
                                  <Route path="/all_projects" component={PublicProjects}/>
                                  <Route path="/my_projects" component={MyProjects}/>

                                  <Route path="/about" component={About}/>

                                  <Route path="/profil_user" component={ProfilUser}/>
                                  <Route path="/profil_org" component={ProfilOrg}/>

                                  <Route path="/project/:id" component={ProfilProject}/>

                                  {/*<PrivateRoute path="/update_user" component={UpdateUser}/>*/}
                                  <PrivateRoute path="/update_org/:id" component={UpdateOrg}/>
                                  <PrivateRoute path="/update_project/:id" component={UpdateProject} />

                                  <Route path="/beweging" component={Beweging}/>
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

