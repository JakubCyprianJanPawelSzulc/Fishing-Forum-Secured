import React, { useState } from "react";
import CommentForm from "./CommentForm";
import DeletePostButton from "./DeletePostButton";
import AdminComment from "./AdminComment";

export default function AdminPost(props) {
  const [comments, setComments] = useState(props.comments);

  const deleteComment = (commentIndex) => {
    const updatedComments = [...comments];
    updatedComments.splice(commentIndex, 1);
    setComments(updatedComments);
  };

  return (
    <div className="post">
      <DeletePostButton id={props.id} />
      <h2>{props.title}</h2>
      <h3>{props.username}</h3>
      <h6>{props.timestamp}</h6>
      <h4>{props.ip}</h4>
      {props.imageURL && <img className='post-image' src={props.imageURL} alt="Obrazek" />}
      <p>{props.content}</p>
      <CommentForm id={props.id} />
      {comments && comments.length > 0 ? (
        comments.map((comment, index) => (
          <AdminComment
            key={index}
            id={index}
            username={comment.username}
            content={comment.content}
            postId={props.id}
            onDeleteComment={deleteComment}
            ipAddress={comment.ipAddress}
            imageURL={comment.imageURL}
            timestamp={comment.timestamp}
          />
        ))
      ) : (
        <p>Brak komentarzy do wyświetlenia</p>
      )}
    </div>
  );
}
