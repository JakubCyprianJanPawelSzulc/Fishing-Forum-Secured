import keycloak from "../Keycloak";
import React from 'react';

export default function LogoutButton() {
    return(
        <div>
            <button onClick={() => keycloak.logout()}>Logout</button>
        </div>
    )
}