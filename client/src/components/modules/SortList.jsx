import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import './SortList.css';

const SortList = (props) => {
    return (
        <DropdownButton title="Sort" variant="secondary" className="dropdown">
            <Dropdown.Item onClick={props.handleDate}>Date Added</Dropdown.Item>
            <Dropdown.Item onClick={props.handleAlph}>Alphabetical</Dropdown.Item>
            <Dropdown.Item onClick={props.handleLack}>Lacking Information</Dropdown.Item>
        </DropdownButton>
    )
}

export default SortList