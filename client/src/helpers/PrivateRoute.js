import { useKeycloak } from "@react-keycloak/web";
import { Link } from "react-router-dom";

const PrivateRoute = ({ children }) => {
 const { keycloak } = useKeycloak();

 const isLoggedIn = keycloak.authenticated;

 return( isLoggedIn 
    ? children 
    : <div>
        <h1>Nie masz uprawnień żeby zobaczyć tą stronę</h1>
        <button><Link to="/">Zaloguj się</Link></button>
    </div>
);
};

export default PrivateRoute;