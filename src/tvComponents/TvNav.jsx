import React from "react";
import { Link, NavLink, Outlet, useOutletContext, useSearchParams } from "react-router-dom";
import Filter from "../Filter";
export default function MoviesNav() {
    const { ytTrailerUrl, setYtTrailerUrl, authUser, watchlistMain, setWatchlistMain } = useOutletContext()
    const [searchParams, setSearchParams] = useSearchParams()
    const genre = searchParams.getAll('genre')
    let matchALL = searchParams.getAll('matchALL').length > 0

    const activeStyles = {
        borderBottom: '1px solid',
        paddingBottom: '2px'
    }
    return (
        <>
            <div className="secNavbar">
                <Link to='..'>&lt;-- Back Home</Link>
                <nav>
                    <NavLink style={({ isActive }) => isActive ? activeStyles : null} to='.' end>Popular</NavLink>
                    <NavLink style={({ isActive }) => isActive ? activeStyles : null} to='trending'>Trending</NavLink>
                    <NavLink style={({ isActive }) => isActive ? activeStyles : null} to='topRated'>Top Rated</NavLink>
                </nav>
            </div>
            <Filter setSearchParams={setSearchParams} searchParams={searchParams} type={'tv'} />
            < Outlet context={{ ytTrailerUrl, setYtTrailerUrl, genre, authUser, watchlistMain, setWatchlistMain, matchALL }} />
        </>
    )
}