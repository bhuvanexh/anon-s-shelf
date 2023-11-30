import { createUserWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { Form, useActionData, useNavigate, useNavigation } from "react-router-dom";
import { auth } from "../firebase";
import '../css/login.css'


export async function signUpAction({ request }) {
    const formData = await request.formData()
    const path = new URL(request.url).searchParams.get('redirectTo') || '/literally'

    try {
        const data = await createUserWithEmailAndPassword(auth, formData.get('email'), formData.get('password'))
        return { status: true, path: path }
    } catch (e) {
        return { status: false, msg: e.message }
    }
}



export default function SignUp({ authUser }) {
    const navigate = useNavigate()
    const status = useNavigation()
    let state = status.state
    const obj = useActionData()
    let errorMsg
    if (authUser && obj?.status) {
        state = 'done'
        navigate(obj.path, { replace: true })
    }
    if (obj && !obj?.status) {
        errorMsg = obj.msg
    }
    return (
        <>
            <div className="signUp">
                <div className="signUp--form">

                    <h1>Sign Up</h1>
                    <Form method="post">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email address"
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" // Regular expression for email format
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                        />
                        {errorMsg && <h3>{errorMsg}</h3>}
                        <button
                            disabled={state === "submitting"}
                        >
                            {state === "submitting"
                                ? "Signing Up..."
                                : "Sign Up"
                            }
                        </button>
                    </Form>
                </div>
            </div>
        </>
    )
}