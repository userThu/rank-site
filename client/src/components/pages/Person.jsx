import React, { useState, useEffect, useContext } from "react";
import {useParams} from 'react-router-dom';

import Comments from "../modules/Comments";
import ImageUpload from "../modules/ImageUpload";
import SocialLinks from "../modules/SocialLinks";

import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { UserContext } from "../App"; 

import { get, post } from "../../utilities";
import './Person.css';

/**
 * Allow users to comment, include links to social media, and upload photos
 */
const Person = () => {
    const { user } = useContext(UserContext)
    let props = useParams();
    const [person, setPerson] = useState();
    const [imageURL, setImageURL] = useState('');
    const [votes, setVotes] = useState(0);
    const [voted, setVoted] = useState(false);

    useEffect(() => {
        get("/api/person", {personid: props.personid}).then((personArr) => {
            if (personArr.length > 0) {
                const person = personArr[0];
                setPerson(person);
                setImageURL(person.imagesrc);
                setVotes(person.votes.length);
            }
        });
    }, [imageURL]);

    const handleVote = async () => {
        let voted = false;
        get("/api/vote", {personid: props.personid}).then((personObj) => {
            const voteArr = personObj.votes;
            if (user && voteArr.includes(user._id)) {
                voted = true;
            }
        }).then(() => {
            if (!voted) {
                vote();
                setVoted(true);
            } else {
                unvote();
                setVoted(false);
            }
        });
    }

    const vote = async () => {
        try {
            const res = await fetch("/api/vote", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ personid: props.personid })
            });

            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
            const data = await res.json();
            
            setVotes(data.votes.length);
        } catch (e) {
            console.error(e)
        }
    }

    const unvote = async () => {
        try {
            const res = await fetch("/api/unvote", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ personid: props.personid })
            });

            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
            const data = await res.json();
            
            setVotes(data.votes.length);
        } catch (e) {
            console.error(e)
        }
    }

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
            const data = await res.json();
            saveUpload(data.url);
        } catch (e) {
            console.error(e);
        }
    }

    const saveUpload = async (imagesrc) => {
        try {
            const res = await fetch("/api/save-image", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ personid: props.personid, imagesrc: imagesrc })
            });

            const data = await res.json();
            setImageURL(data.imagesrc);
        } catch (e) {
            console.error(e);
        }
    }

    const voteButtonMessage = voted ? "Unvote" : "Upvote";

    let loggedCheck;
    if (person) {
        loggedCheck = user ? (
            <h2 className="name">{person.name}
                <Button className="upvote-button" onClick={handleVote}>{voteButtonMessage}<Badge className="vote-badge">{votes}</Badge></Button>
            </h2>
        ) : (
            <h2 className="name">{person.name}
                <Button className="upvote-button">Votes<Badge className="vote-badge">{votes}</Badge></Button>
                <p className="log-message">Please sign in to vote.</p>
            </h2>
        );
    }

    if (!person) {
        return (<Spinner animation="border"></Spinner>)
    } else {
        return (
            <Container className="page-container">
                <Row className="row-container">
                    <Col xs={12} md={4} className="left-column">
                        <div className="image-container">
                            <Image src={imageURL} className="image" rounded/>
                        </div>
                        <ImageUpload handleUpload={handleUpload}/>
                        <hr className="break-1"></hr>
                        {loggedCheck}
                        <hr className="break-2"></hr>
                        <div>
                            <h4>Social Links</h4>
                            <SocialLinks icon='instagram' personid={props.personid}/>
                            <SocialLinks icon='tiktok' personid={props.personid}/>
                            <SocialLinks icon='other' personid={props.personid}/>
                        </div>
                    </Col>
                    <Col className="right-column" xs={8}>
                        <Comments personid={props.personid} name={person.name} user={user}/>
                    </Col>
                </Row>
            </Container>
        )
    }

    
}

export default Person;