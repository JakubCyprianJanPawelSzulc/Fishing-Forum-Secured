import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "bezpieczenstwo-realm",
    clientId: "jacek",
    pkceMethod: 'S256',
});

export default keycloak;