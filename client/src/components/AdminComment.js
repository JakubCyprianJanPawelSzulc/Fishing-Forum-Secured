import React, { useEffect } from 'react';
import DeleteCommentButton from './DeleteCommentButton.js';

export default function Comment(props) {
    return(
        <div className="comment">
            <h5>{props.username}</h5>
            <h6>{props.ipAddress}</h6>
            <h6>{props.timestamp}</h6>
            <h6>{props.roles}</h6>
            <p>{props.content}</p>
            {props.imageURL && <img className='comment-image'  src={props.imageURL} alt="Obrazek" />}
            <DeleteCommentButton id={props.id} postId={props.postId}/>
        </div>
    )
}