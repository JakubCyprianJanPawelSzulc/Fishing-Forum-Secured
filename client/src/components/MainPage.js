import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import PostForm from "./PostForm.js";
import Post from "./Post.js";
import Navigation from "./Navigation.js";

export default function MainPage() {
    const { keycloak } = useKeycloak();
    const [posts, setPosts] = React.useState([]);

    React.useEffect(() => {
        fetch("http://localhost:5000/posts", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setPosts(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);


    return(
        <div className="main-page">
            <Navigation/>
            <PostForm/>
            {posts!==[] ? (
                posts.map((post) => (
                    <Post key={post._id} id={post._id} username={post.username} title={post.title} content={post.content} comments={post.comments} imageURL={post.imageURL} timestamp={post.timestamp} roles={post.roles}/>
                ))
            ) : (
                <p>Brak postów do wyświetlenia</p>
            )}
        </div>
    )
}
