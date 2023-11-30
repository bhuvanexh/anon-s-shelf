import { Suspense } from "react";
import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import Loading from "../Loading";
import { Card, getTmdbDataByID, Youtube } from "../util";

export async function anonLoader(request, params, authUser) {
    async function fetchWatchlistData() {
        const data = {
            movies: [262, 7345, 311, 627, 398173, 97367, 103, 530385, 25237, 1398, 25, 37165, 141, 152601, 38, 74308, 84892, 4553, 1018, 220289, 694, 4512, 949, 157336, 374720, 500, 5915, 619264, 550, 111, 63, 185, 503919, 466272, 146233, 64690, 244786, 1949, 629, 14, 641, 242582, 807,],
            tv: [1398, 60059, 1438, 1396, 46648, 67744, 70523, 48866, 62560]
        }
        const moviePromises = data.movies.map(async (m) => {
            const movData = await getTmdbDataByID('/movie', m);
            return movData;
        });
        const tvPromises = data.tv.map(async (t) => {
            const tvData = await getTmdbDataByID('/tv', t);
            return tvData;
        });
        const [movies, tv] = await Promise.all([Promise.all(moviePromises), Promise.all(tvPromises)]);
        const anonPicksData = {
            movies,
            tv,
        };
        return anonPicksData;
    }
    if (authUser) {
        return defer({ data: fetchWatchlistData() })
    } else {
        return redirect(`/literally/login?loginMsg=true`);
    }
}

export default function AnonPicks() {
    const dataPromise = useLoaderData()
    function movieEl(data) {
        return (
            <>
                <Youtube />
                <h1 className="watchlistHeading">Anon's Picks</h1>
                <p className="anonPickInfo">Some of Developer's favorite movies and shows</p>
                <div className='pageData--div'>
                    {data.movies.map(m => {
                        return (<Card key={m.id} data={m} url={'/movie/bruh'} />)
                    })}
                    {data.tv.map(t => {
                        return (<Card key={t.id} data={t} url={'/tv/bruh'} />)
                    })}
                </div>
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