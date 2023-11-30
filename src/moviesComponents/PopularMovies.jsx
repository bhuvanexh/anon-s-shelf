import React, { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { DisplayDataPage, Youtube } from "../util";
import Loading from "../Loading";

export default function PopularMovies() {
    const dataPromise = useLoaderData()
    function movieEl(data) {
        return (
            <>
                <Youtube />
                <DisplayDataPage data={data} url={'/movie/popular'} />
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