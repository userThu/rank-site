import React, { useState } from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'

import './SortList.css';

const toggleA = 'https://res.cloudinary.com/ddn3ylwye/image/upload/v1751057850/image_3_ximasl.png';
const toggleB = 'https://res.cloudinary.com/ddn3ylwye/image/upload/v1751057913/image_4_nd5q90.png';

const SortList = (props) => {
    const [toggleSort, setToggleSort] = useState(toggleA);

    const handleToggle = () => {
        if (toggleSort === toggleA) setToggleSort(toggleB);
        else if (toggleSort === toggleB) setToggleSort(toggleA);
        props.handleFlip();
    }

    return (
        <ButtonGroup>
            <DropdownButton title="Sort" variant="secondary" className="dropdown">
                <Dropdown.Item onClick={props.handleDate}>Date Added</Dropdown.Item>
                <Dropdown.Item onClick={props.handleAlph}>Alphabetical</Dropdown.Item>
                <Dropdown.Item onClick={props.handleLack}>Information</Dropdown.Item>
                <Dropdown.Item onClick={props.handleVote}>Votes</Dropdown.Item>
                
            </DropdownButton>
            <Button variant='outline' onClick={handleToggle}>
                <Image className='toggle' src={toggleSort}/>
            </Button>
        </ButtonGroup>
    )
}

export default SortList