import React from "react";
import { NavItem } from "./NavItem";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    Navbar
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <NavItem text="Home" active={true} />
                        <NavItem text="Features" />
                        <NavItem text="Pricing" />
                        <NavItem text="Disabled" disabled={true} />
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
