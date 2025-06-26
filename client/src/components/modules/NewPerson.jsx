import React, {useState} from "react"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import './NewPerson.css';

const NewPerson = (props) => {
    const [show, setShow] = useState(false);
    const [input, setInput] = useState("");

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    // called whenever the user types in the new post input box
    const handleChange = (event) => {
        setInput(event.target.value);
    };

    // called when the user hits "Submit" for a new post
    const handleSubmit = (event) => {
        event.preventDefault();
        props.addNewPerson(input);
        setInput("");
        handleClose();
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow} className="person-button">
                Add Person
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Add a new person</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formPersonName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Legal or illegal name?" onChange={handleChange} value={input}></Form.Control>
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
        </>
    )
}

export default NewPerson