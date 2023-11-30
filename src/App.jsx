import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, defer } from "react-router-dom"
import './App.css'
import './css/page.css'
import './css/loading.css'
import Home from './homeComponents/Home';
import Login, { LoginAction } from "./loginComponents/Login";
import MoviesNav from "./moviesComponents/MoviesNav";
import Navbar from './homeComponents/Navbar';
import PopularMovies from "./moviesComponents/PopularMovies";
import TopRatedMovies from "./moviesComponents/TopRatedMovies";
import TrendingMovies from "./moviesComponents/TrendingMovies";
import TvNav from "./tvComponents/TvNav";
import UpcomingMovies from "./moviesComponents/UpcomingMovies";
import { contentDetailsloaderMain, getHomeData, getTmdbData } from "./util";
import LandingPage from "./landingComponents/LandingPage";
import PopularTvShows from "./tvComponents/PopularTvShows";
import TrendingTvShows from "./tvComponents/TrendingTvShows";
import TopRatedTvShows from "./tvComponents/TopRatedTvShows";
import Error from "./Error";
import ContentDetails from "./ContentDetails";
import SignUp, { signUpAction } from "./loginComponents/SignUp";
import { useEffect } from "react";
import { useState } from "react";
import Loading from "./Loading";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import Watchlist, { watchlistLoader } from "./watchlistComponent/Watchlist";
import WatchlistNav from "./watchlistComponent/WatchlistNav";
import AnonPicks, { anonLoader } from "./watchlistComponent/AnonPicks";
function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setLoading(false);
    };

    window.addEventListener('load', handleLoad);

    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timeoutId);
    };
  }, []);

  let { context } = useContext(AuthContext)

  let authUser = context.user
  if (authUser === false) {
    return (
      <>
        <div className="loadingMain">
          <Loading />
        </div>
      </>
    )
  }

  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/" element={
        <>
          {loading &&
            <div className="loadingMain">
              <Loading />
            </div>
          }
          <LandingPage loading={loading} />
        </>
      }
        errorElement={<Error />} />
      <Route path="literally" element={<Navbar />} errorElement={<Error />}>
        <Route index element={<Home />} loader={() => {
          return defer({ data: getHomeData() })
        }} errorElement={<Error />} />
        <Route path="movie" element={<MoviesNav />}>
          <Route index element={<PopularMovies />} loader={() => {
            return defer({ data: getTmdbData('/movie/popular') })
          }} errorElement={<Error />} />
          <Route path="trending" element={<TrendingMovies />} loader={() => {
            return defer({ data: getTmdbData('/trending/movie/week') })
          }} errorElement={<Error />} />
          <Route path="topRated" element={<TopRatedMovies />} loader={() => {
            return defer({ data: getTmdbData('/movie/top_rated') })
          }} errorElement={<Error />} />
          <Route path="upcoming" element={<UpcomingMovies />} loader={() => {
            return defer({ data: getTmdbData('/movie/upcoming') })
          }} errorElement={<Error />} />
        </Route>
        <Route path='movie/:id' element={<ContentDetails />} loader={({ request, params }) => {
          return contentDetailsloaderMain(request, params, authUser)
        }} errorElement={<Error />} />
        <Route path="tv" element={<TvNav />}>
          <Route index element={<PopularTvShows />} loader={() => {
            return defer({ data: getTmdbData('/tv/popular') })
          }} errorElement={<Error />} />
          <Route path="trending" element={<TrendingTvShows />} loader={() => {
            return defer({ data: getTmdbData('/trending/tv/week') })
          }} errorElement={<Error />} />
          <Route path="topRated" element={<TopRatedTvShows />} loader={() => {
            return defer({ data: getTmdbData('/tv/top_rated') })
          }} errorElement={<Error />} />
        </Route>
        <Route path='tv/:id' element={<ContentDetails />} loader={({ request, params }) => {
          return contentDetailsloaderMain(request, params, authUser)
        }} errorElement={<Error />} />
        <Route path="watchlist" element={<WatchlistNav />}>
          <Route index element={<Watchlist />} loader={({ request, params }) => {
            return watchlistLoader(request, params, authUser)
          }} errorElement={<Error />} />
          <Route path="anon" element={<AnonPicks />} loader={(request, params) => {
            return anonLoader(request, params, authUser)
          }} errorElement={<Error />} />
        </Route>
        <Route path="login" element={<Login authUser={authUser} />} action={LoginAction} />
        <Route path="signUp" element={<SignUp authUser={authUser} />} action={signUpAction} />
      </Route>
    </>
  ))

  return (
    <>
      <div id="main--wrapper" className="main--wrapper">
        <RouterProvider router={router} />
      </div>
    </>
  )
}

export default App
















































// search
// movie name
// fetch('https://api.themoviedb.org/3/search/movie?query=come%20and%20see', options)
// actor/person
// fetch('https://api.themoviedb.org/3/search/person?query=ryan%20gosling', options)
// tv shows
// fetch('https://api.themoviedb.org/3/search/tv?query=the%20100', options)

// IMP multi all movies , tv show and person in one link
// fetch('https://api.themoviedb.org/3/search/multi?query=mr%20robot', options)

// https://image.tmdb.org/t/p/w185/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg
// https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg
// {
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