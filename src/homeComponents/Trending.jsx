import React, { Suspense } from "react";
import { DisplayDataSwiper } from "../util";
import { Await, useLoaderData } from "react-router-dom";
import Loading from "../Loading";

export default function Trending() {
    const dataPromise = useLoaderData()
    function MovieEl(data) {
        return (
            <>
                <div className="main--trending--wrapper main--component--wrapper">
                    <h1>Trending</h1>
                    <DisplayDataSwiper data={data.trending} />
                </div>
            </>
        )
    }
    return (
        <>
            <Suspense fallback={<Loading />}>
                <Await resolve={dataPromise.data}>
                    {MovieEl}
                </Await>
            </Suspense>
        </>
    )
}