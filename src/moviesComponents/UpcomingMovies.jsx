import React, { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import Loading from "../Loading";
import { DisplayDataPage, Youtube } from "../util";

export default function UpcomingMovies() {
    const dataPromise = useLoaderData()
    function movieEl(data) {
        return (
            <>
                <Youtube />
                <DisplayDataPage data={data} url={'/movie/upcoming'} />
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