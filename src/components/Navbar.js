import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Switch, Route, Link, useNavigate } from "react-router-dom";
// import "../Styles/Nav.css";
import { auth, db, logout } from "../utils/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";

import NavDropdown from "react-bootstrap/NavDropdown";

function Navigation() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [currentUserData, setCurrentUserData] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      // console.log(data);
      setName(data.name);
      setCurrentUserData(data);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user && window.location.pathname !== "/register") return navigate("/");
    if (user) fetchUserName();
  }, [user, loading, navigate]);
  // console.log(window.location.pathname);
  if (
    !user ||
    window.location.pathname === "/area" ||
    window.location.pathname === "/gender" ||
    window.location.pathname === "/interests" ||
    window.location.pathname === "/profile"
  )
    return null;

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              alt="Just friends logo"
              src={require("../Just-friends_images/just-friends_logo.png")}
              width="130"
              height="130"
              id="logo"
              className="d-inline-block align-top"
            />{" "}
            Just Friends
          </Navbar.Brand>
          <img
            className="navatar"
            src={currentUserData.avatarURL}
            alt="your avatar"
            width="130"
            height="130"
          />
          <br />
          <Navbar.Text>Signed in as:{"  "} </Navbar.Text>
          <Navbar.Text as={Link} to="/myprofile">
            {currentUserData.firstname}
          </Navbar.Text>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/myprofile">
                View profile
              </Nav.Link>
              <Nav.Link as={Link} to="/gender">
                Edit profile
              </Nav.Link>
              <Nav.Link as={Link} to="/chatroom">
                View chat
              </Nav.Link>
              <Nav.Link as={Link} to="/chatmembers">
                View chat members
              </Nav.Link>
              <Nav.Item onClick={logout}>Logout</Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;