import LanguageSelector from "../__appComponents/_routerComponents/_mainComponents/LanguageSelector";
import AuthContext from "./AuthContext";
import {useContext} from "react";
import {Dropdown} from "semantic-ui-react";

const { isAuthenticated, setIsAuthenticated,
    isAdmin, setIsAdmin,
    lastname, setLastname,
    firstname, setFirstname,
    partnerList, setPartnerList
} = useContext(AuthContext)

const menuNew = () => {
    return (
        <Dropdown text={t('new')}>
            <Dropdown.Menu>
                <Dropdown.Item>
                    <Menu.Item as={NavLink} to="/profil_user">{t('account')}</Menu.Item>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Menu.Item onClick={handleLogout}>{t('Logout')}</Menu.Item>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}
  /*  { as: "d", text: "new",
    options: [
        {as:"a", icon:'file', content:'activity', to:"/create_activity", key: 'new_activity',authstate:"true"},
        {as:"a", icon:'idea', content:'project', to:"/create_project", key: 'new_project',authstate:"true"},
        {as:"a", icon:'group', content:'organization', to:"/create_org", key: 'new_org', authstate:"true"},
    ],
    key:"menuNew", authstate:"true"
}

const baseLeft = [
    { as:"a", icon:"home", to:"/", key: "home", authstate:"always"}
]

const rightItems = [
    {as: "d", text: firstname + ' ' + lastname,
        options: [
            {as:"a", content:"account", to:"/profil_user", key:"account", authstate:"true"},
            {content: <a onClick={handleLogout}>{t('Logout')}</a>, key: "logout", authstate:"true"}
        ],
        key:"accountMenu", authstate:"true"
    },
    {as:"d", text:"Login",
        options:[
            { as:"a", content:'Login', to: "/login", key:"Login", authstate:"false"},
            { as:"a", content:'Sign_up', to:"/register", key:'Sign_up', authstate:"false" },
        ],
        key:"logMenu", authstate: "false"
    },
    { as:"s", content:<LanguageSelector />, key: "language", authstate:"always"}
]

const subLeft = [
    {as:"m", id:"", header:'admin',
        options: [
            {as:"a", to:'/admin/users', content:'users', key:"adminUsers", adminstate:true},
            {as:"a", to:'/admin/orgs', content:'organizations', key:"adminOrgs", adminstate:true},
            {as:"a", to:'/admin/projects', content:'projects', key:"adminProjects", adminstate:true},
            {as:"a", to:'/admin/activities', content:'activities', key:"adminActivities", adminstate:true},
        ],
        key:"menuAdmin", adminstate: true
    },
    {as:"m", id:"left_menu", header:'activity',
        options: [
            {as:"a", to:'/all_activities/owned', content:'my_activities', key:"myActivities", authstate:"true"},
            {as:"a", to:'/all_activities/followed', content:'my_favorites', key:"favoriteActivities", authstate:"true"},
            {as:"a", to:'/all_activities/public', content:'public_activities', key:"publicActivities", authstate:"always"}
        ],
        key:"menuActivities", authstate:"always"
    },
    { as:"m", id:"", header:'projects',
        options: [
            {as:"a", to:'/all_projects/owned', content:'my_projects', key:"myProjects", authstate:"true"},
            {as:"a", to:'/all_projects/followed', content:'my_favorites', key:"favoriteProjects", authstate:"true"},
            {as:"a", to:'/all_projects/public', content:'all_projects', key:"allProjects", authstate:"always"}
        ] ,
        key:'menuProjects', authstate:"always"
    },
    { as:"m", id:"", header:'organization',
        options: [
            {as:"a", to:'/all_organizations/owned', content:'my_orgs', key:"myOrgs", authstate:"true"},
            /!*{as:"a", to:'/all_projects/followed', content:t('my_favorites'), key:"favoriteProjects", authstate:"true"},*!/
            {as:"a", to:'/all_organizations/public', content:'all_org', key:"allOrgs", authstate:"always"}
        ] ,
        key:'menuOrgs', authstate:"always"
    },
]*/