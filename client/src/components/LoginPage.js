import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate} from 'react-router-dom';

export default function LoginPage() {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  const loginWithPKCE = () => {
    keycloak.login({
      pkceMethod: 'S256',
      usePkce: true,
    });
  };

  useEffect(() => {
    if (keycloak.authenticated) {
      navigate('/MainPage');
    }
  }, [initialized, keycloak, navigate]);

  useEffect(() => {
    if (keycloak.authenticated) {
      // Aktualizacja tokena po zalogowaniu
      keycloak.updateToken(5).then((refreshed) => {
        if (refreshed) {
          console.log('Token refreshed');
        } else {
          console.log('Token not refreshed, or not needed');
        }
      }).catch((error) => {
        console.error('Error refreshing token:', error);
      });
    }
  }, [keycloak]);

  return (
    <div className="login-page">
      <h1 className='welcome-header-login'>Witaj na forum o rybkach!</h1>
      <button className='keycloak-button' onClick={loginWithPKCE}>
        <img className='keycloak-img' src="https://blog.consdata.tech/assets/img/posts/2020-02-01-keycloak-uwierzytelnianie-autoryzacja-springboot-angular/Keycloak.png" alt="google-icon" />
        Zaloguj się kontem Keycloak
      </button>
      <button className='register-button'>
        <a className='register-link' href="http://localhost:8080/realms/bezpieczenstwo-realm/account">Zarejestruj się</a>
      </button>
    </div>
  );
}
