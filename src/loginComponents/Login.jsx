import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { Form, useActionData, useNavigate, useNavigation, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import '../css/login.css';

export async function LoginAction({ request }) {
    const path = new URL(request.url).searchParams.get('redirectTo') || '/literally';
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const data = await signInWithEmailAndPassword(auth, email, password);
        return { status: true, path: path };
    } catch (e) {
        return { status: false, msg: e.message };
    }
}

export default function Login({ authUser }) {
    const navigate = useNavigate();
    const status = useNavigation();
    let state = status.state
    const obj = useActionData();
    let errorMsg;
    if (authUser && obj?.status) {
        state = 'done'
        navigate(obj.path, { replace: true })
    }
    if (obj && !obj?.status) {
        errorMsg = obj.msg
    }
    const [searchParams, setSearchParams] = useSearchParams();
    let path = searchParams.getAll('redirectTo');
    let loginMsg = searchParams.getAll('loginMsg');
    return (
        <>
            <div className="login">
                <div className="login--form">
                    <h1>Login</h1>
                    {loginMsg[0] && <h2>{`Sry m8, you'll have to login first :)`} </h2>}
                    <Form replace method="post">
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
                        <button disabled={state === "submitting"}>
                            {state === "submitting" ? "Logging in..." : "Log in"}
                        </button>
                    </Form>

                    <p>New User ?</p>
                    <button
                        onClick={() => {
                            if (path.length > 0) {
                                navigate(`/literally/signUp?redirectTo=${path}&loginMsg=true`);
                            } else {
                                navigate(`/literally/signUp`);
                            }
                        }}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </>
    );
}
