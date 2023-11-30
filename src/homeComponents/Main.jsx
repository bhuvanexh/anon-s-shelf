import React from "react";
import { Youtube } from "../util";
import Search from "./Search";
import TopMovies from "./TopMovies";
import TopTv from "./TopTv";
import Trending from "./Trending";


export default function Main() {
    return (
        <>
            <Youtube />
            <Search />
            <div className="main--components--wrapper">
                <Trending />
                <TopMovies />
                <TopTv />
            </div>
        </>
    )
}