import { Suspense } from "react";
import { Await, defer, redirect, useLoaderData } from "react-router-dom"
import { getUserData } from "../firebase";
import Loading from "../Loading";
import { Card, getTmdbDataByID, Youtube } from "../util";

export async function watchlistLoader(request, params, authUser) {
    async function fetchWatchlistData(authUser) {
        const data = await getUserData(authUser.uid);
        const moviePromises = data.movies.map(async (m) => {
            const movData = await getTmdbDataByID('/movie', m);
            return movData;
        });
        const tvPromises = data.tv.map(async (t) => {
            const tvData = await getTmdbDataByID('/tv', t);
            return tvData;
        });
        const [movies, tv] = await Promise.all([Promise.all(moviePromises), Promise.all(tvPromises)]);
        const watchlistData = {
            movies,
            tv,
        };
        return watchlistData;
    }
    if (authUser) {
        return defer({ data: fetchWatchlistData(authUser) })
    } else {
        return redirect(`/literally/login?loginMsg=true`);
    }
}

export default function Watchlist() {
    const dataPromise = useLoaderData()
    function movieEl(data) {
        return (
            <>
                <Youtube />
                <h1 className="watchlistHeading">Your Favourites</h1>
                <div className='pageData--div'>
                    {data.movies.map(m => {
                        if (m.videos.results.some(d => d.type === 'Trailer')) {
                            return (<Card key={m.id} data={m} url={'/movie/bruh'} />)
                        } else {
                            return (<Card key={m.id} data={m} url={'/movie/bruh'} trailerNot={true} />)
                        }
                    })}
                    {data.tv.map(t => {
                        if (t.videos.results.some(d => d.type === 'Trailer')) {
                            return (<Card key={t.id} data={t} url={'/tv/bruh'} />)
                        } else {
                            return (<Card key={t.id} data={t} url={'/tv/bruh'} trailerNot={true} />)
                        }
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