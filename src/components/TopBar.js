import React from 'react';

function TopBar() {

    return (
        <div className="top-bar" >
            <div className="title" >
                {/* <Image src="/logo.svg" alt="me" width="64" height="64" /> */}
                <img className="vector" src="/logo.svg" alt="Vector" />
                <div className="ez-ens valign-text-middle sfprorounded-bold-black-22px  " >
                    EZ ENS
                </div >
            </ div >
        </div >

    )
}

export default TopBar;