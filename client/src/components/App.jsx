import React, { useState, useEffect, createContext } from "react";
import NavBar from "../components/modules/NavBar";
import Footer from "./modules/Footer";
import { Outlet } from "react-router-dom";

import jwt_decode from "jwt-decode";

import "../utilities.css";
import "./App.css"

import { socket } from "../client-socket";

import { get, post } from "../utilities";

export const UserContext = createContext(null);

/**
 * Define the "App" component
 */
const App = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUser(user);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUser(user);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUser(undefined);
    post("/api/logout");
  };

  const authContextValue = {
    user,
    handleLogin,
    handleLogout,
  };

  return (
    <div className="page-wrapper">
      <NavBar handleLogin={handleLogin} handleLogout={handleLogout} user={user}/>
      <UserContext.Provider value={authContextValue}>
        <main className="content-wrap">
          <Outlet />
        </main>
      </UserContext.Provider>
      <Footer />
    </div>
  );
};

export default App;
