import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore/lite';
import React, { createContext, useState } from 'react';
import { useEffect } from 'react';
import { auth, db, getUsersData } from './firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    let userDataIn = {
        tv: [],
        movies: []
    }
    const [authUser, setAuthUser] = useState({ user: false, userData: userDataIn })
    async function setUserData(user) {
        let data = await getUsersData()
        if (!data.some(obj => obj.id == user.uid)) {
            const res = await setDoc(doc(db, "users", user.uid), {
                mail: user.email,
                tv: [],
                movies: []
            });

        } else {
            [userDataIn] = data.filter(obj => obj.id == user.uid)
        }
        setAuthUser({ user: user, userData: userDataIn })
    }

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserData(user)
            } else {
                setAuthUser({
                    user: null, userData: {
                        tv: [],
                        movies: []
                    }
                })
            }
        })
        return () => {
            listen()
        }
    }, [])

    return (
        <>
            <AuthContext.Provider value={{ context: authUser }}  >
                {children}
            </AuthContext.Provider>
        </>
    );
};