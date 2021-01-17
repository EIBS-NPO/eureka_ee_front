import './_css/main.css';
import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AuthAPI from "./_services/authAPI";
import AuthContext from "./_contexts/AuthContext";
import HeaderAndMenus from "./_components/HeaderAndMenus";
/*import MainMenu from "./_components/menus/MainMenu";
import AnoMenu from "./_components/menus/AnoMenu";
import AdminMenu from "./_components/menus/AdminMenu";
import UserMenu from "./_components/menus/UserMenu";*/

const Home = lazy(() => import('./_routes/Home'));
const Register = lazy(() => import('./_routes/Register'));
const About = lazy(() => import('./_routes/About'));
const Login = lazy(() => import('./_routes/Login'));

 function App() {
    AuthAPI.setup();

    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthAPI.isAuthenticated()
    );

    /*const [userRole, setUR] = useState(
        AuthAPI.getRole()
    );*/

  return (
      <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
          <Router>
              <HeaderAndMenus />
          {/*/todo placer Header et menu dans un Compo
              //todo make Header component with logo & MainMenu inside*/}
              {/*<header>
                  <MainMenu />
              </header>*/}
           {/* //todo make AsideNav component with (MenuUser or MenuAdmin) & AnonyMenu*/}
             {/*<aside>
                 <AdminMenu />
                 <UserMenu />
                 {isAuthenticated && (
                     <AdminMenu />
                 )}
                 {isAuthenticated && (
                     <UserMenu />
                 )}
                 <AnoMenu />
             </aside>*/}

             <Suspense fallback={<div>Chargement...</div>}>
               <Switch>
                   <Route exact path="/" component={Home}/>
                   <Route path="/register" component={Register}/>
                   <Route path="/login" component={Login}/>
                   <Route path="/about" component={About}/>
               </Switch>
             </Suspense>
          </Router>
      </AuthContext.Provider>
  );
  /*
  return (
    <div className="App">
      <header className="App-header">
        <MainMenu />
        {/!*<img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>*!/}

      </header>
      <main className="container-fluid">
      </main>
    </div>
  );*/
}

export default App;
/*

import React, { useState } from "react";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import AuthAPI from "./js/services/authAPI";
import AuthContext from "./js/contexts/AuthContext";
import LoginPage from "./js/pages/LoginPage";
import RegisterAdminPage from "./js/pages/RegisterAdminPage";
import SideNav from "./js/components/SideNav";
import PrivateRoute from "./js/components/PrivateRoute";
import DashboardAdminPage from "./js/pages/DashboardAdminPage";
import DashboardCoachPage from "./js/pages/DashboardCoachPage";
import DashboardPlayerPage from "./js/pages/DashboardPlayerPage";
import CoachAdminPage from "./js/pages/CoachsAdminPage";
import PlayersAdminPage from "./js/pages/PlayersAdminPage";
import TeamsAdminPage from "./js/pages/TeamsAdminPage";
import MailPage from "./js/pages/MailPage";
import ClubFormPage from "./js/pages/ClubFormPage";
import ProfilForm from "./js/pages/ProfilForm";
import RegisterUserPage from "./js/pages/RegisterUserPage";
import EncountersPage from "./js/pages/EncountersPage";
import EncountersAdminPage from "./js/pages/EncountersAdminPage";
import MyPlayersCoachPage from "./js/pages/MyPlayersCoachPage";
import TeamContext from "./js/contexts/TeamContext";
import PlayerStatsPage from "./js/pages/PlayerStatsPage";
import TrainingsPage from "./js/pages/TrainingsPage";
import PlanningPlayer from "./js/pages/PlanningPlayer";
import FormationPage from "./js/pages/FormationPage";
import PreLivePage from "./js/pages/PreLivePage";
import LivePage from "./js/pages/LivePage";
import MatchLiveContext from "./js/contexts/MatchLiveContext";
import NotAllowedPage from "./js/pages/NotAllowedPage";

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'



function App() {
  AuthAPI.setup();

  const [isAuthenticated, setIsAuthenticated] = useState(
      AuthAPI.isAuthenticated()
  );

  const [currentTeamId, setCurrentTeamId] = useState('')
  const [matchLiveId, setMatchLiveId] = useState('')

  const SideNavWithRouter = withRouter(SideNav);

  return (
      <AuthContext.Provider
          value={{
            isAuthenticated,
            setIsAuthenticated,
          }}
      >
        <MatchLiveContext.Provider
            value={{
              matchLiveId,
              setMatchLiveId
            }}
        >
          <HashRouter>
            <SideNavWithRouter />
            <TeamContext.Provider
                value={{
                  currentTeamId,
                  setCurrentTeamId
                }}
            >
              <main className="container-fluid">
                <ReactNotification />
                <Switch>
                  <Route path="/registerUser/:token" component={RegisterUserPage} />
                  <PrivateRoute path="/player/:id/stats" component={PlayerStatsPage} />
                  <PrivateRoute path="/player/:id/planning" component={PlanningPlayer} />
                  <PrivateRoute path="/createClub" component={ClubFormPage} />
                  <Route path="/RegisterAdmin" component={RegisterAdminPage} />
                  <Route path="/login" component={LoginPage} />
                  <PrivateRoute path="/dashboardAdmin" component={DashboardAdminPage} />
                  <PrivateRoute path="/dashboardCoach" component={DashboardCoachPage} />
                  <PrivateRoute path="/dashboardPlayer" component={DashboardPlayerPage} />
                  <PrivateRoute path="/coachs" component={CoachAdminPage} />
                  <PrivateRoute path="/players" component={PlayersAdminPage} />
                  <PrivateRoute path="/teams" component={TeamsAdminPage} />
                  <PrivateRoute path="/mail" component={MailPage} />
                  <PrivateRoute path="/profil" component={ProfilForm} />
                  <PrivateRoute path="/myPlayers" component={MyPlayersCoachPage} />
                  <PrivateRoute path="/encountersCoach" component={EncountersPage} />
                  <PrivateRoute path="/encountersAdmin" component={EncountersAdminPage} />
                  <PrivateRoute path="/trainings" component={TrainingsPage} />
                  <PrivateRoute path="/formation" component={FormationPage} />
                  <PrivateRoute path="/notAllowedUser" component={NotAllowedPage} />

                  <PrivateRoute path="/preLive" component={PreLivePage} />
                  <PrivateRoute path="/live/:matchId" component={LivePage} />

                  <Route path="/" component={LoginPage} />
                </Switch>
              </main>
            </TeamContext.Provider>
          </HashRouter>
        </MatchLiveContext.Provider>
      </AuthContext.Provider>
  );
}

export default App;
*/

