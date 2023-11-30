import loadingVid from './assets/loading.mp4'
export default function Loading() {
    return (
        <>
            <div className="loading-outer">
                <div className="loading-text">
                    <h1>Loading</h1>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </div>
                <div className="video-container">
                    <video autoPlay loop muted>
                        <source src={loadingVid} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </>
    )
}