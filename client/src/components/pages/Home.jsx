import React, { useState, useEffect } from "react";
import PersonCard from "../modules/PersonCard";
import NewPerson from "../modules/NewPerson";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { get, post } from "../../utilities";

import "./Home.css";

const Home = () => {
    const [people, setPeople] = useState([]);

    // called when "Home" component mounts
    useEffect(() => {
        get("/api/people").then((peopleObjs) => {
            setPeople(peopleObjs);
        });
    }, []);

    const addNewPerson = (personName) => {
        post("/api/person", {name: personName}).then((person) => {
            setPeople(people.concat([person]));
        })
    }

    let peopleList = null;
    const hasPeople = people.length !== 0;
    if (hasPeople) {
        peopleList = (
            <Row xs={1} md={3} className="people-container">
                {
                    people.map((personObj) => (
                        <Col className="col-container" key={personObj._id}>
                            <a className="evil-a" href={`/profile/${personObj._id}`}>
                                <PersonCard name={personObj.name} votes={personObj.votes.length} src={personObj.imagesrc} />
                            </a> 
                        </Col>
                    ))
                }
            </Row>
        )
    } else {
        peopleList = <div>Nope. No one here.</div>;
    }

    return (
        <Container className="container">
            <Row className="row-container">
                <Col className="subheading-container"><h2 className="subheading">Pre-Frosh List</h2></Col>
                <Col className="new-button"><NewPerson addNewPerson={addNewPerson}/></Col>
            </Row>
            <hr className="break"/>
            <div className="evil-container">{peopleList}</div>
        </Container>
    );


}

export default Home;