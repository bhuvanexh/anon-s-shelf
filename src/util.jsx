import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import './css/dataCard.css'
import React, { memo, useState } from 'react';
import { defer, redirect, useNavigate, useOutletContext } from 'react-router-dom';
import YouTube from 'react-youtube';
import Loading from './Loading';
import trailerImg from './assets/findThatTrailerBish.webp'
import { contentDetailsLoader } from './ContentDetails';


const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNzYwMDhhY2YzMDM2ZjI4OGI1YjllNjNmNDYyOWU0YSIsInN1YiI6IjY0YzMxZGNkMDI4ZjE0MDE1MjQwZjA5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2LkET5Q3B2jaXybpm8jmPVbcSgfzD7b48bfqGqZxz9g'
    }
};

export async function getTmdbData(url, page) {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3${url}${page ? `?page=${page}` : ``}`,
            options
        );
        const data = await res.json()
        return data
    } catch (error) {
        throw {
            message: error.message
        }
    }
}
export async function getTmdbDataByID(url, id) {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3${url}/${id}?append_to_response=videos`,
            options
        );
        const data = await res.json()
        return data
    } catch (error) {
        throw {
            message: error.message
        }
    }
}

export async function getTmdbDataGenre(url, page, genre, matchALL) {
    let genres = matchALL ? genre.join('%2C') : genre.join('%7C')
    let urlToPass
    if (url.split('/').includes('tv')) {
        urlToPass = '/tv'
    } else if (url.split('/').includes('movie')) {
        urlToPass = '/movie'
    }
    let urltoFetch = `https://api.themoviedb.org/3/discover${urlToPass}${page ? `?page=${page}` : ``}&with_genres=${genres}`
    try {
        const res = await fetch(
            urltoFetch,
            options
        );
        const data = await res.json()
        return data
    } catch (error) {
        throw {
            message: error.message
        }
    }
}

export async function getMultiSearch(search) {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?query=${search}`,
            options
        );
        const data = await res.json()
        data.results = data.results.filter(d => d.media_type !== 'person' && d.poster_path !== null)
        if (data.results.length > 0) {
            return data
        } else {
            return null
        }
    } catch (error) {
        throw {
            message: error.message
        }
    }
}

export function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

export const Card = memo(function Card({ data, url, trailerNot }) {
    const context = useOutletContext()
    let { authUser, setWatchlistMain, watchlistMain, setYtTrailerUrl } = context
    let liked = watchlistMain.movies.includes(data.id) || watchlistMain.tv.includes(data.id)
    let urlToPass
    if (data.media_type) {
        urlToPass = '/' + data.media_type
    } else {
        const parts = url.split('/')
        if (parts.includes('trending')) {
            urlToPass = '/' + parts.slice(2, 3).join()
        } else {
            urlToPass = parts.slice(0, 2).join('/')
        }
    }
    async function likeClick() {
        if (authUser) {
            if (urlToPass === '/movie') {
                setWatchlistMain(p => {
                    let updatedMovies = p.movies.includes(data.id) ? p.movies.filter(m => m !== data.id) : [...p.movies, data.id]
                    return {
                        ...p,
                        movies: updatedMovies
                    }
                })
            } else if (urlToPass === '/tv') {
                setWatchlistMain(p => {
                    let updatedTv = p.tv.includes(data.id) ? p.tv.filter(t => t !== data.id) : [...p.tv, data.id]
                    return {
                        ...p,
                        tv: updatedTv
                    }
                })
            }
        } else {
            navigate('/literally/login?loginMsg=true')
        }
    }

    async function trailerClick() {
        const details = await getTmdbDataByID(urlToPass, data.id)
        if (details.videos.results.some(d => d.type === 'Trailer')) {
            console.log('trailer');
            const trailerObjs = details.videos.results.filter(d => d.type === 'Trailer')
            setYtTrailerUrl(trailerObjs[0].key)
        } else {
            setYtTrailerUrl(true)
        }
    }
    const navigate = useNavigate()
    function detailsClick() {
        navigate(`/literally${urlToPass}/${data.id}`)
    }

    let overview = data.overview.split(' ').slice(0, 30).join(' ') + '....'
    let styleObj
    return (
        <>
            <div className={`dataCard ${liked && 'likedCard'}`} >
                <img src={`https://image.tmdb.org/t/p/original${data.poster_path}`} alt="" loading="lazy" />
                <h2 className={`primary ${liked && 'activePrimary'}`}>{data.name || data.title}</h2>
                <div className="hiddenOverlay">
                    <div className='dataCard--content'>
                        <h2>{data.name || data.title}</h2>
                        <p>{overview}</p>
                    </div>
                    <div className={`likeBtn ${liked && 'active'}`} onClick={likeClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 555 555"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg>
                    </div>
                    <div className='dataCard--btns'>
                        {!trailerNot && <button onClick={trailerClick}>Trailer</button>}
                        <button onClick={detailsClick}>Details</button>
                    </div>
                </div>
            </div>
        </>
    )
})




export const DisplayDataSwiper = memo(function DisplaySwiper({ data, url }) {
    const movieEl = data.results.map(d => {
        return (
            <SwiperSlide key={d.id}>
                <Card data={d} url={url} />
            </SwiperSlide>
        )
    })
    return (<>
        <div className='swiper--wrdiv'>
            <div className='swiperBtn-wrapperL'>
                <button className={`swiper-btn-prev swiper-btn-prev${data.total_pages}`}>&#x27E8;</button>
            </div>
            <Swiper
                modules={[Navigation]}
                spaceBetween={10}
                slidesPerView={2}
                // Navigation={{
                //     nextEl: '.swiper-btn-next',
                //     prevEl: '.swiper-btn-prev'
                // }}
                // navigation={true}
                // navigationPrevEl=".swiper-button-prev"
                // navigationNextEl=".swiper-button-next"
                navigation={{   // Use an object to specify custom elements for navigation
                    prevEl: `.swiper-btn-prev${data.total_pages}`,
                    nextEl: `.swiper-btn-next${data.total_pages}`
                }}
                breakpoints={{
                    // Responsive breakpoints
                    650: {
                        slidesPerView: 3,
                        spaceBetween: 15
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 25
                    },
                }}
            // navigation
            // onSlideChange={() => console.log('slide change')}
            // onSwiper={(swiper) => console.log(swiper)}
            >
                {movieEl}
            </Swiper>

            <div className='swiperBtn-wrapperR'>
                <button className={`swiper-btn-next swiper-btn-next${data.total_pages}`}>&#x27E9;</button>
            </div>
        </div>
    </>
    )
})

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function DisplayDataPage({ data, url }) {
    const contextG = useOutletContext().genre
    const matchALL = useOutletContext().matchALL
    const genreIni = contextG.length > 0 ? contextG[0].split(',') : []
    const genre = genreIni.map(Number).sort((a, b) => a - b)
    const [loadingState, setLoadingState] = useState({
        loading: false,
        error: false
    })
    const [extraData, setExtraData] = useState([])
    const [extraDataGenre, setExtraDataGenre] = useState([])
    const [genrePageLengths, setGenrePageLengths] = useState({ error: false })
    const mainData = []
    async function handleClick() {
        if (genre.length > 0) {
            let pageNo
            let currGenre = matchALL ? genre.join('|') : genre.join(',')
            if (Object.keys(genrePageLengths).includes(currGenre)) {
                pageNo = 1 + genrePageLengths[currGenre];
                setGenrePageLengths(p => {
                    p[currGenre] = p[currGenre] + 1
                    return p
                })
            } else {
                pageNo = 1
                setGenrePageLengths(p => {
                    p[currGenre] = 1
                    return p
                })
            }

            const allTempGenreData = []
            async function genreDataLoad(genreData) {
                allTempGenreData.push(genreData)
                let matchingIds = mainData.filter(id => genreData.results.some(obj => obj.id === id))
                if (matchingIds.length > 10) {
                    pageNo = pageNo + 1
                    setGenrePageLengths(p => {
                        p[currGenre] = p[currGenre] + 1
                        return p
                    })
                    const genreDataN = await getTmdbDataGenre(url, pageNo, genre, matchALL)
                    await genreDataLoad(genreDataN)
                } else {
                    setExtraDataGenre(prev => {
                        return [...prev, ...allTempGenreData]
                    })
                }
            }

            const genreDataNew = await getTmdbDataGenre(url, pageNo, genre, matchALL)
            if (genreDataNew.results.length === 0) {
                setLoadingState(p => ({
                    ...p,
                    error: true
                }))
                setTimeout(() => {
                    setLoadingState(p => ({
                        ...p,
                        error: false
                    }))
                }, 4000);
            } else {
                await genreDataLoad(genreDataNew);
            }
        } else {
            let pageNo = 2 + extraData.length;
            const dataNew = await getTmdbData(url, pageNo)
            setExtraData(prev => {
                return [...prev, dataNew]
            })
        }
    }
    let pageDataEl = data.results.map(d => {
        if (genre.length > 0) {
            let condn = matchALL ? genre.every(v => d.genre_ids.includes(parseInt(v))) : genre.some(v => d.genre_ids.includes(parseInt(v)))
            if (condn) {
                mainData.push(d.id)
                return (
                    <Card key={d.id} data={d} url={url} />
                )
            }
        } else {
            mainData.push(d.id)
            return (
                <Card key={d.id} data={d} url={url} />
            )
        }
    })
    function extraDataSubEl(extraDataType) {
        return (
            <>
                {extraDataType.map((pageData, i) => {
                    return (
                        <React.Fragment key={i}>
                            {pageData.results.map(d => {
                                if (genre.length > 0) {
                                    let condn = matchALL ? genre.every(v => d.genre_ids.includes(parseInt(v))) : genre.some(v => d.genre_ids.includes(parseInt(v)))
                                    if (condn && !mainData.includes(d.id)) {
                                        mainData.push(d.id)
                                        return (
                                            <Card key={d.id} data={d} url={url} trailerNot={true} />
                                        )
                                    }
                                } else {
                                    if (!mainData.includes(d.id)) {
                                        mainData.push(d.id)
                                        return (
                                            <Card key={d.id} data={d} url={url} trailerNot={true} />
                                        )
                                    }
                                }
                            })}
                        </React.Fragment>
                    )
                })}
            </>
        )
    }

    let extraDataEl
    if (genre.length > 0) {
        extraDataEl = [
            <React.Fragment key={1}>
                {extraDataSubEl(extraData)}
            </React.Fragment>
            ,
            <React.Fragment key={2}>
                {extraDataSubEl(extraDataGenre)}
            </React.Fragment>
        ]
    } else {
        extraDataEl = [
            <React.Fragment key={2}>
                {extraDataSubEl(extraDataGenre)}
            </React.Fragment>
            ,
            <React.Fragment key={1}>
                {extraDataSubEl(extraData)}
            </React.Fragment>
        ]
    }
    return (
        <>
            <div className='pageData--div'>
                {pageDataEl}
                {extraDataEl}
            </div>
            {loadingState.error && (
                <div className='error-message' style={{ color: 'red', textAlign: 'center', fontSize: '25px', marginBlock: '20px', fontFamily: "'Montserrat', sans-serif" }}>
                    Couldn't find any data with selected genres !!!
                </div>
            )}
            {loadingState.loading && <Loading />}
            <button className='page--SMbtn' onClick={async () => {
                setLoadingState(p => ({
                    ...p,
                    loading: true
                }))
                await handleClick()
                setLoadingState(p => ({
                    ...p,
                    loading: false
                }))
            }}>Show More</button>
        </>

    )
}



export async function getHomeData() {
    let dataObj = {}
    dataObj.trending = await getTmdbData('/trending/all/week')
    dataObj.topMovies = await getTmdbData('/movie/top_rated')
    dataObj.topTv = await getTmdbData('/tv/top_rated')
    return dataObj
}

export function Youtube() {
    const context = useOutletContext()
    const opts = {
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0, // Set to 1 to autoplay the video
        },
    };
    const onReady = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    };
    function boxClick() {
        context.setYtTrailerUrl(null)
    }
    const trailerNotFoundElement = [
        <>
            <div className='trailerErrorDiv'>
                <span> &#10006;</span>
                <div className="imgEr">
                    <img src={trailerImg} alt="" />
                </div>
                <h1>Uh-Oh, No trailer found for this movie/show so far :/</h1>
            </div>
        </>
    ]
    return (<>
        {context.ytTrailerUrl && <div className='ytBox' onClick={boxClick}>
            {context.ytTrailerUrl == true && trailerNotFoundElement}
            <div className='ytWrapper'>
                <span> &#10006;</span>
                {context.ytTrailerUrl !== true && <YouTube videoId={context.ytTrailerUrl} opts={opts} onReady={onReady} />}
            </div>
        </div>}
    </>
    )

}

export async function contentDetailsloaderMain(request, params, authUser) {

    let path = '/' + new URL(request.url).pathname.split('/').slice(2).join('/')
    if (authUser) {
        return defer({ data: contentDetailsLoader({ request, params }) })
    } else {
        return redirect(`/literally/login?redirectTo=/literally${path}&loginMsg=true`);
    }
}















//   "genres": [
//     {
//       "id": 28,
//       "name": "Action"
//     },
//     {
//       "id": 12,
//       "name": "Adventure"
//     },
//     {
//       "id": 16,
//       "name": "Animation"
//     },
//     {
//       "id": 35,
//       "name": "Comedy"
//     },
//     {
//       "id": 80,
//       "name": "Crime"
//     },
//     {
//       "id": 99,
//       "name": "Documentary"
//     },
//     {
//       "id": 18,
//       "name": "Drama"
//     },
//     {
//       "id": 10751,
//       "name": "Family"
//     },
//     {
//       "id": 14,
//       "name": "Fantasy"
//     },
//     {
//       "id": 36,
//       "name": "History"
//     },
//     {
//       "id": 27,
//       "name": "Horror"
//     },
//     {
//       "id": 10402,
//       "name": "Music"
//     },
//     {
//       "id": 9648,
//       "name": "Mystery"
//     },
//     {
//       "id": 10749,
//       "name": "Romance"
//     },
//     {
//       "id": 878,
//       "name": "Science Fiction"
//     },
//     {
//       "id": 10770,
//       "name": "TV Movie"
//     },
//     {
//       "id": 53,
//       "name": "Thriller"
//     },
//     {
//       "id": 10752,
//       "name": "War"
//     },
//     {
//       "id": 37,
//       "name": "Western"
//     }
//   ]
// }