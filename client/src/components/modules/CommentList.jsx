import { useState } from 'react';
import Comment from "./Comment";
import NewInput from './NewInput';

import { post } from "../../utilities";

/**
 * `comments` is an array of commentObjects:
 * {
 *  personid: the profile commented on
 *  author: the author of the comment
 *  comment: the content
 * }
 */
const CommentList = (props) => {
    const [comments, setComments] = useState(props.comments);

    const handleNewComment = (newComment) => {
        post("/api/comment", {personid: props.personid, comment: newComment}).then((comment) => {
            setComments(comments.concat(comment));
        });
    }

    const newComment = !props._id ? (<div>Sign in to comment</div>) : (<NewInput onSubmit={handleNewComment}/>);

    return (
        <div>
            <h2>Comments</h2>
            <div>
                {comments.map((commentObj) => (
                    <Comment comment={commentObj.comment} author={commentObj.author}/>
                ))}
            </div>
            <div>
                {newComment}
            </div>
        </div>
    )
}

export default CommentList