import React, { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import Loading from "../Loading";
import { DisplayDataPage, Youtube } from "../util";

export default function TopRatedMovies() {
    const dataPromise = useLoaderData()
    function movieEl(data) {
        return (
            <>
                <Youtube />
                <DisplayDataPage data={data} url={'/movie/top_rated'} />
            </>
        )
    }
    return (
        <>
            <Suspense fallback={<Loading />}>
                <Await resolve={dataPromise.data}>
                    {movieEl}
                </Await>
            </Suspense>
        </>
    )
}