import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import './css/error.css'
import napo from './assets/thereisnothing.jpg'
export default function Error() {
    const errorData = useRouteError()
    const navigate = useNavigate()
    return (
        <>
            <div className="errorDivOuter">
                <div className="errorDivInner">
                    <div className="errorImg">
                        <img src={napo} alt="" />
                    </div>
                    <div className="errorText">
                        <h1>
                            {`Oops, you've hit an ERROR :(`}
                        </h1>
                        <p>
                            {
                                errorData.message || errorData.data
                            }
                        </p>
                        <button onClick={() => {
                            navigate('/')
                        }} >Back Home!?</button>
                    </div>
                </div>
            </div>
        </>
    )
}