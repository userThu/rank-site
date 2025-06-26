import Navbar from "react-bootstrap/Navbar";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import './NavBar.css';

const NavBar = (props) => {
    return (
        <Navbar expand='lg' className="Navbar-container">
            <Container>
                <Navbar.Brand href='/' className="brand-container">
                    <img className="logo-img" />
                    Home
                </Navbar.Brand>
                <Container className="log-container">
                    {props.user ? <Navbar.Text className="greetings">Hey, {props.user.name}</Navbar.Text> : <></>}
                    <Navbar.Text>
                        {props.user ? (
                            <Button className="logout-button" onClick={() => {
                                googleLogout();
                                props.handleLogout();}}>Log Out</Button>
                        ) : (
                        <GoogleLogin
                            buttonText="Login"
                            onSuccess={props.handleLogin}
                            onFailure={(err) => console.log(err)}
                        />
                        )}
                    </Navbar.Text>
                </Container>
            </Container>
        </Navbar>
    )
}

export default NavBar