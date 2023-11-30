import React, { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import Loading from "../Loading";
import { DisplayDataPage, Youtube } from "../util";

export default function PopularTvShows() {
    const dataPromise = useLoaderData()
    function MovieEl(data) {
        return (
            <>
                <Youtube />
                <DisplayDataPage data={data} url={'/tv/popular'} />
            </>
        )
    }
    return (
        <>
            <Suspense fallback={<Loading />}>
                <Await resolve={dataPromise.data} >
                    {MovieEl}
                </Await>
            </Suspense>
        </>
    )
}