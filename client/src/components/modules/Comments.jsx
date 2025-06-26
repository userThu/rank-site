import { useState, useEffect } from 'react';
import { socket } from "../../client-socket.js";
import Comment from "./Comment";
import NewInput from './NewInput';

import { get, post } from "../../utilities";

import './Comments.css';

/**
 * Everytime someone makes a comment, send an request to the server (API endpoint),
 * the server emits a response to all connected sockets (users on the page),
 * clients have sockets listening for a new message
 */
const Comments = (props) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        get("/api/comments", {personid: props.personid}).then((foundComments) => {
            setComments(foundComments);
        })
    }, [comments]);

    useEffect(() => {
        document.title = props.name;
    }, []);

    useEffect(() => {
        const addComments = (data) => {
            setComments(comments.concat(data));
        };
        socket.on("comment", addComments);
        return () => {
            socket.off("comment", addComments);
        }
    }, []);

    const handleNewComment = (newComment) => {
            post("/api/comment", {personid: props.personid, comment: newComment}).then((comment) => {
                setComments(comments.concat(comment));
            });
        }

    const newComment = !props.user ? (<div className="unlogged-container">Sign in to comment</div>) : (<NewInput onSubmit={handleNewComment}/>);

    return (
        <div>
            <h2>Comments</h2>
            <div className="comment-list-container">
                {comments.map((commentObj) => (
                    <Comment comment={commentObj.comment} author={commentObj.author}/>
                ))}
            </div>
            <div className="new-comment-container">
                {newComment}
            </div>
        </div>
    )
}

export default Comments