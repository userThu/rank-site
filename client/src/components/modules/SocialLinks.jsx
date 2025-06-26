import React, { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { get } from '../../utilities';

import './SocialLinks.css';

/**
 * im sorry for this shitty code lol
 */
const SocialLinks = (props) => {
    const [show, setShow] = useState(false);
    const [input, setInput] = useState("");
    const [link, setLink] = useState('');

    useEffect(() => {
        get(`/api/links`, {icon: props.icon, personid: props.personid}).then((linkObj) => {
            setLink(linkObj.link);
        });
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // called whenever the user types in the new post input box
    const handleChange = (event) => {
        setInput(event.target.value);
    };

    const saveLink = async () => {
        try {
            const res = await fetch(`/api/link-${props.icon}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ personid: props.personid, link: input })
            });
            const data = await res.json();
            setLink(data.link);
        } catch (e) {
            console.error(e);
        }
    }

    // called when the user hits "Submit" for a new post
    const handleSubmit = (event) => {
        event.preventDefault();
        saveLink();
        setInput("");
        handleClose();
    };

    const url = link ? link : window.location;

    return (
        <div>
            <Container>
                <Row xs={3} className="upload-link">
                    <Col xl="auto" className={`${props.icon}-container`}><img className={props.icon}/></Col>{': '}
                    <Col xl="auto"><a className="text" href={url} target="_blank">{link ? link : 'Link'}</a></Col>
                    <Col xl="auto" onClick={handleShow} className="link-col"><img className='link'/></Col>
                </Row>
            </Container>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Link Socials</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formPersonName">
                            <Form.Control type="text" placeholder="Insert Link" onChange={handleChange} value={input}></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}



export default SocialLinks;