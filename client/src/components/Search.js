import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Post from './Post';
import { useKeycloak } from '@react-keycloak/web';

export default function Search(){
    const location = useLocation();
    const query = location.pathname.split('/')[2];
    const [posts, setPosts] = useState([]);
    const { keycloak } = useKeycloak();


    useEffect(() => {
        fetch(`http://localhost:5000/posts/search/${query}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json", Authorization: `Bearer ${keycloak.token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setPosts(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
    , []);

    return(
        <div className="main-page">
            <Link to="/MainPage">
                <button className="back-button">Wróć</button>
            </Link>
            <h1>Wyniki wyszukiwania dla "{query}"</h1>
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