import React from 'react';
import { useKeycloak } from '@react-keycloak/web';

export default function DeletePostButton(props) {
    const { keycloak } = useKeycloak();
    const deletePost = () => {
        fetch(`http://localhost:5000/posts/${props.id}`, {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${keycloak.token}`,
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            window.location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    return(
        <button onClick={deletePost}>Usuń post</button>
    )
}