import React, {useContext} from "react";
import MainMenu from "./menus/MainMenu";
import AdminMenu from "./menus/AdminMenu";
import UserMenu from "./menus/UserMenu";
import AnoMenu from "./menus/AnoMenu";
import AuthContext from "../_contexts/AuthContext";

//import AuthAPI from "../_services/authAPI";

const HeaderAndMenus = ({history}) => {

    const { isAuthenticated} = useContext(AuthContext);

    /*const [userRole, setUR] = useState(
        AuthAPI.getRole()
    );*/

    return(
        <>
            <header className="row">
                <div className="logo">The Logo</div>
                <div className="main_menu">
                    <MainMenu props={history}/>
                </div>
                <aside id="left_menu">
                    {isAuthenticated && (
                        <AdminMenu />
                    )}
                    {isAuthenticated && (
                        <UserMenu />
                    )}
                    <AnoMenu />
                </aside>
            </header>
        </>
    );
}

export default HeaderAndMenus;
