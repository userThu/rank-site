import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

import './ImageUpload.css';

const ImageUpload = (props) => {

    return (
        <div>
            <Form.Group className="upload-container">
                <Form.Control type="file" size='sm' onChange={props.handleUpload} accept="image/*"/>
            </Form.Group>
            
        </div>
    )
};

export default ImageUpload