import React from "react";


function TopBar(props) {
    const { smallButtonProps } = props;
    return (
    ‹div className = "top-bar" >
    <Title2 />
    <SmallButton>{smallButtonProps. children}</SmallButton> 
    </div >
    );
}

function Title2() {
    return (
    ‹div className = "title" > 
        <img className="vector" sre="vector-1.svg" alt="Vector" /> 
    ‹div className="ez - ens valign - text - middle sprorounded - bold - black - 22px">
    EZ ENS </div >
    </ div >