import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function TopBar() {
  return (
    <div className="top-bar">
      <div className="title">
        <img className="vector" src="/logo.svg" alt="Vector" />
        <div className="ez-ens valign-text-middle sfprorounded-bold-black-22px  ">
          EZ ENS
        </div>
      </div>
      {/*<div className="nav">
        <div className="nav-item">Set Primary Name</div>
        <div className="nav-item">Register ENS</div>
  </div>*/}
      <div className="connect">
        <ConnectButton />
      </div>
    </div>
  );
}

export default TopBar;
