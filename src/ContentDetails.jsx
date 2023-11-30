import { Await, Link, useLoaderData, useOutletContext } from "react-router-dom";
import { delay, getTmdbDataByID, Youtube } from "./util";
import './css/detailsPage.css'
import { Suspense } from "react";
import Loading from "./Loading";
export async function contentDetailsLoader({ request, params }) {
    const pathname = new URL(request.url).pathname
    const urlToPass = '/' + pathname.split('/')[2]
    const data = await getTmdbDataByID(urlToPass, params.id)
    let returnObj = { data, urlToPass }
    return returnObj
}

export default function ContentDetails() {
    const dataPromise = useLoaderData()
    const { setYtTrailerUrl, watchlistMain, setWatchlistMain } = useOutletContext()
    function convertToHoursAndMinutes(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours}h ${minutes}min`;
    }
    function movieEl({ data, urlToPass }) {
        let liked = (watchlistMain.movies.includes(data.id) || watchlistMain.tv.includes(data.id))
        let trailerObjs = null
        async function likeClick() {
            if (urlToPass === '/movie') {
                let updatedMovies = watchlistMain.movies.includes(data.id) ? watchlistMain.movies.filter(m => m !== data.id) : [...watchlistMain.movies, data.id]
                setWatchlistMain(p => ({
                    ...p,
                    movies: updatedMovies
                }))

            } else if (urlToPass === '/tv') {
                let updatedTv = watchlistMain.tv.includes(data.id) ? watchlistMain.tv.filter(t => t !== data.id) : [...watchlistMain.tv, data.id]
                setWatchlistMain(p => ({
                    ...p,
                    tv: updatedTv
                }))
            }
        }

        if (data.videos.results.length > 0) {
            trailerObjs = data.videos.results.filter(d => d.type === 'Trailer')
        }
        async function trailerClick() {
            setYtTrailerUrl(trailerObjs[0].key)
        }
        return (
            <>
                <Youtube />
                <div className="contentDetailsPage">
                    <Link to='..'>&lt;-- Back Home</Link>
                    <div className="CDPinner" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center' }} >
                        <div className="detailsWrapper">
                            <div className="posterImg">
                                <img src={`https://image.tmdb.org/t/p/original${data.poster_path}`} alt="" loading="lazy" />
                            </div>
                            <div className="movieDetails">
                                <div className="mdInner">

                                    <div className="md-row1 md-row">
                                        <h1>{data.title || data.name}
                                        </h1>
                                        <div className="heart">
                                            <div className={`likeBtn2 ${liked && 'active2'}`} onClick={likeClick}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 555 555"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md-row2 md-row">
                                        {data.release_date && <> <span>{data.release_date.split('-')[0]}</span> <>|</> </>}
                                        {data.first_air_date && <> <span>{data.first_air_date.split('-')[0]}</span> <>|</> </>}
                                        {data.runtime && <> <span>{convertToHoursAndMinutes(data.runtime)}</span> <>|</> </>}
                                        <span>{data.vote_average.toString().substring(0, 4)} <span>&#x2605;</span> </span>
                                    </div>
                                    <h3>Overview</h3>
                                    <p>{data.overview}</p>
                                    {data.tagline && <p>{data.tagline.toUpperCase()}...</p>}
                                    <p className="mdGenre">
                                        <span>genre -</span>
                                        {data.genres.map((g, index) => (
                                            <span key={g.id}>
                                                {g.name}
                                                {index !== data.genres.length - 1 && ','}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                                {trailerObjs && <button onClick={trailerClick} className="trailerBtn">Watch Trailer</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }


    return (
        <>
            <Suspense fallback={<div className="loadingMain">
                <Loading />
            </div>}>
                <Await resolve={dataPromise.data}>
                    {movieEl}
                </Await>
            </Suspense>
        </>
    )

}

// Date runtime tagline vote_average trailerButton genre

// name      heart
// year | runtime in hr | rating *
// overview           watchTrailer
// *overview*
// tagline CAPS
// genre - *genre*
// similar movies