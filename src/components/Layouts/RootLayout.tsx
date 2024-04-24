import React from "react";
import Navbar from "../Navbar/Navbar";

interface IRootLayoutProps {
    children: React.ReactNode;
}

export const RootLayout = ({ children }: IRootLayoutProps) => {
    return (
        <>
            <Navbar />

            <div className="container-fluid mt-2">{children}</div>
        </>
    );
};

export default RootLayout;
