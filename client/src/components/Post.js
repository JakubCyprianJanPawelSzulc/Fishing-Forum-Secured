import React from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

export default function Post(props) {

    return(
        <div className="post">
            <h2 className="post-title">{props.title}</h2>
            <h3 className="post-user">użytkownik: {props.username}</h3>
            <h4 className="post-role">rola: {props.roles}</h4>
            <h6 className="post-timestamp">{props.timestamp}</h6>
            {props.imageURL && <img className="post-image" src={props.imageURL} alt="Obrazek" />}
            <p>{props.content}</p>
            <CommentForm id={props.id}/>
            {props.comments!==[] && props.comments!== undefined? (
                props.comments.map((comment) => (
                    <Comment key={props.comments.indexOf(comment)} username={comment.username} content={comment.content} imageURL={comment.imageURL} timestamp={comment.timestamp} roles={comment.roles}/>
                ))
            ) : (
                <p>Brak komentarzy do wyświetlenia</p>
            )}
        </div>
    )

}