import React from "react";
import Heading from "./Heading";
import Main from './Main'
import '../css/home.css'
import Footer from "./Footer";

export default function Home() {
    return (
        <>
            <div className="home--outer">
                <Heading />
                <Main />
                <Footer />
            </div>
        </>
    )
}