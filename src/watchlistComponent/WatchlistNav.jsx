import React from "react"
import { Link, NavLink, Outlet, useOutletContext } from "react-router-dom"

export default function WatchlistNav() {
    const { ytTrailerUrl, setYtTrailerUrl, authUser, watchlistMain, setWatchlistMain } = useOutletContext()
    const activeStyles = {
        borderBottom: '1px solid',
        marginRight: '5px'
    }
    return (
        <>
            <div className="secNavbar">
                <Link to='..'>&lt;-- Back Home</Link>
                <nav>
                    <NavLink style={({ isActive }) => isActive ? activeStyles : null} to='.' end>Your Picks</NavLink>
                    <NavLink style={({ isActive }) => isActive ? activeStyles : null} to='anon'>Anon's Picks</NavLink>
                    {/* <NavLink style={({ isActive }) => isActive ? activeStyles : null} to='topRated'>Top Rated</NavLink> */}
                </nav>
            </div>
            < Outlet context={{ ytTrailerUrl, setYtTrailerUrl, authUser, watchlistMain, setWatchlistMain }} />

        </>
    )
}