import React from "react";
import { useKeycloak } from "@react-keycloak/web";

export default function DeleteCommentButton(props) {
    const { keycloak, initialized } = useKeycloak();

    const deleteComment = async () => {
        const response = await fetch(`http://localhost:5000/posts/${props.postId}/comments/${props.id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${keycloak.token}`,
            }
        });

        const parseRes = await response.json();
        console.log(parseRes);

    }

    return(
        <button onClick={deleteComment}>Usuń komentarz</button>
    )

}