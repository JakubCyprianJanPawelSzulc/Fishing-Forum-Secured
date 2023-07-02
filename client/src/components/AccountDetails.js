import { useKeycloak } from '@react-keycloak/web';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AccountDetails() {
    const { keycloak, initialized } = useKeycloak();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        if (initialized) {
            keycloak.loadUserProfile().then((profile) => {
                setName(profile.firstName);
                setEmail(profile.email);
                setUsername(profile.username);
                setRoles(keycloak.tokenParsed?.realm_access?.roles.filter(role => role === 'admin' || role === 'superszczupak') || [])
            });
        }
    }, [initialized]);

    return(
        <div className="accountDetails">
            <Link className='main-page-link' to="/MainPage">
                <button className="back-button">Wróć</button>
            </Link>
            <h1 className='twoje-dane'>Twoje dane</h1>
            <h2>Imię: {name}</h2>
            <h2>Email: {email}</h2>
            <h2>Nazwa użytkownika: {username}</h2>
            <h2>Role: {roles}</h2>
        </div>
    )
}