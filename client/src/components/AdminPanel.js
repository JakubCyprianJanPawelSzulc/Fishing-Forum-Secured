import { useKeycloak } from '@react-keycloak/web';
import React from 'react';
import AdminPost from './AdminPost.js';
import PostForm from './PostForm.js';
import UploadPosts from './UploadPosts.js';

export default function AdminPanel() {
    const { keycloak} = useKeycloak();
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
            <h1>Rybki forum panel admina</h1>
            <PostForm/>
            {posts!==[] ? (
                posts.map((post) => (
                    <React.Fragment key={post._id}>
                        <AdminPost id={post._id} username={post.username} title={post.title} content={post.content} comments={post.comments} ip={post.ipAddress} imageURL={post.imageURL} timestamp={post.timestamp} roles={post.roles}/>
                    </React.Fragment>
                ))
            ) : (
                <p>Brak postów do wyświetlenia</p>
            )}
            <UploadPosts/>
        </div>
    )
    
}
