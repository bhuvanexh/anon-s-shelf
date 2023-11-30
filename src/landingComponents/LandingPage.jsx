import { useNavigate } from "react-router-dom";
import '../css/landingPage.css'
import BgSlider from "./BgSlider";
import hero from "../assets/hero.webp"
import { delay } from "../util";
export default function LandingPage({ loading }) {
    const navigate = useNavigate()
    async function hmmClick() {
        window.scrollTo({ top: 0, behavior: 'auto' })
        await delay(500)
        navigate('/literally')
    }
    return (
        <>
            <div id="troll" className="LP--upper">
                {!loading && <h1 className="focus-in-expand">Anon's Shelf</h1>}
                <div className="LPup--btn">
                    <a href="#LP--lower">Dive in !</a>
                </div>
            </div>
            <div id="LP--lower" className="LP--lower">
                <BgSlider />
                <div className="LPlower--cardOuter">
                    <div>
                        <div className="LPlower--hero">
                            <img src={hero} alt="" />
                        </div>

                        <div className="LPlower--card">
                            <h1>Can't decide which Movie/Show to watch tonight ? </h1>
                            <p>Discover your preferred Movies and TV shows, delve into different categories such as Trending, Popular, Top rated, and Upcoming to select your favorites and add them to your personal collection.</p>
                        </div>
                        <button
                            onClick={() => {
                                hmmClick()
                            }}
                        >
                            Explore
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}