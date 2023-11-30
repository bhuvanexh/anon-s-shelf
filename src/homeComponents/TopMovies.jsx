import React, { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import Loading from "../Loading";
import { DisplayDataSwiper } from "../util";

export default function TopMovies() {
    const dataPromise = useLoaderData()
    function MovieEl(data) {
        return (
            <>
                <div className="main--component--wrapper">
                    <h1>Highly Rated Movies</h1>
                    <DisplayDataSwiper data={data.topMovies} url={'/movie/top_rated'} />
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