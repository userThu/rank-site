import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import './NewInput.css';

const NewInput = (props) => {
    const [input, setInput] = useState("");

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        props.onSubmit && props.onSubmit(input);
        setInput("");
    }

    return (
        <div>
            <Form>
                <Row className="row-container">
                    <Col><Form.Control as="textarea" rows={4} placeholder="Comment" onChange={handleChange}/></Col>
                    <Col md="auto"><Button onClick={handleSubmit} className="button">Submit</Button></Col>
                </Row>
            </Form>
        </div>
    )
}

export default NewInput;