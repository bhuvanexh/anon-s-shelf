import { signOut } from "firebase/auth";
import React from "react";

import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import '../css/navbar.css'
import { useState } from "react";
import { useEffect } from "react";
import { debounce, delay } from "../util";
import Loading from "../Loading";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { doc, updateDoc } from "firebase/firestore/lite";

export default function Navbar() {
    const location = useLocation()
    let { context } = useContext(AuthContext)
    let authUser = context.user
    let navigate = useNavigate()

    const [watchlistMain, setWatchlistMain] = useState(context.userData)

    useEffect(() => {
        setWatchlistMain(context.userData)
    }, [authUser])

    async function syncWithDatabase() {
        if (authUser) {
            let res = await updateDoc(doc(db, "users", authUser.uid), {
                movies: watchlistMain.movies,
                tv: watchlistMain.tv
            })
        }
    }

    useEffect(() => {
        const debounceSync = debounce(syncWithDatabase, 800);
        debounceSync();
    }, [watchlistMain]);








    const [loadingInner, setLoadingInner] = useState(false)
    useEffect(() => {
        async function timer() {
            setLoadingInner(true)
            if (location.pathname !== '/literally/login' && location.pathname !== '/literally/signUp') {
                await delay(4500)
                setLoadingInner(false)
            } else {
                await delay(1500)
                setLoadingInner(false)
            }
        }
        timer()

    }, [location.pathname])


    const [ytTrailerUrl, setYtTrailerUrl] = useState(null)
    async function userSignOut() {
        let data = await signOut(auth)
        navigate('/literally')
    }
    const activeStyles = {
        borderBottom: '1px solid',
    }

    return (
        <>
            {loadingInner &&
                <div className="loadingMain">
                    <Loading />
                </div>
            }
            <nav className="navbar navbar--top">
                <NavLink style={({ isActive }) => isActive ? activeStyles : null} to='movie'>Movies</NavLink>
                <NavLink style={({ isActive }) => isActive ? activeStyles : null} to='tv'>Tv Shows</NavLink>
                {authUser && <NavLink style={({ isActive }) => isActive ? activeStyles : null} to='watchlist'>Watchlist</NavLink>}
                {authUser ? <button className="signOutBtn" onClick={userSignOut}>Sign out</button> : <NavLink style={({ isActive }) => isActive ? activeStyles : null} to='login'>Sign in</NavLink>}
            </nav>
            < Outlet context={{ ytTrailerUrl, setYtTrailerUrl, watchlistMain, setWatchlistMain, authUser, loadingInner }} />
        </>
    )
}