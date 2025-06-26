import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

import './PersonCard.css';

const PersonCard = (props) => {
    const imageSrc = props.src ? props.src : "https://firebasestorage.googleapis.com/v0/b/rush-site-6a467.appspot.com/o/meme.jpg?alt=media&token=817d2f0d-e273-44e4-9904-ff46cba5585a";
    return (
        <Card >
            <div className="image-container">
                <Card.Img variant="top" src={imageSrc} className="image"/>
            </div>
            <Card.Body>
                <Card.Title>{props.name}<Badge className="vote-badge">{props.votes}</Badge></Card.Title>
            </Card.Body>
        </Card>
    )
}

export default PersonCard;