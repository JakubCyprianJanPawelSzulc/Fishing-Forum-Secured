import React from 'react';

export default function Comment(props) {

    return(
        <div className="comment">
            <h5 className='comment-user'>użytkownik: {props.username}</h5>
            <h6 className='comment-role'>rola: {props.roles}</h6>
            <h6 className='comment-timestamp'>{props.timestamp}</h6>
            <p className='comment-content'>{props.content}</p>
            {props.imageURL && <img className='comment-image' src={props.imageURL} alt="Obrazek" />}
        </div>
    )

}