import { useKeycloak } from "@react-keycloak/web";

const AdminRoute = ({ children }) => {
    const { keycloak } = useKeycloak();
    
    const isAdmin = keycloak.hasRealmRole('admin');
    
    return isAdmin ? children : <p>Not authorized</p>;
};

export default AdminRoute;

