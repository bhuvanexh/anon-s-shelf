import React from 'react';
import { useOutletContext } from 'react-router-dom';
import loadingVid from '../assets/literally_me.webm'



export default function Heading() {
    let { loadingInner } = useOutletContext()
    return (
        <div className="main--heading">
            <div className='litmeVideo'>
                <video autoPlay loop muted>
                    <source src={loadingVid} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            {!loadingInner && <div>
                <span className="showing">Literally</span>
            </div>}
            {!loadingInner && <div className="animated-word">
                <span className="word showing me">M</span>
                <span className="word hidden">ovi</span>
                <span className="word showing me">E</span>
                <span className="word hidden">s</span>
            </div>}

        </div>
    )
}



