import React from "react";
import { useNavigate } from 'react-router-dom';
import "../../styles/buttons/loginbutton.css"

//use effect es 
const Home = ({ text, route, fn }) => {

    const navigate = useNavigate();

    if (route === undefined) {
        return (
            <button className="lgn-btn" type="submit">{text}</button>
        )
    } else {
        return (
            <button className="lgn-btn" type="submit" onClick={() => navigate(route)}>{text}</button>
        );
    }
};

export default Home;
