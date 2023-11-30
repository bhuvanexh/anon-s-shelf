import React, { useState } from "react";
import { debounce, DisplayDataSwiper, getMultiSearch } from "../util";

export default function Search() {
    const [currMovies, setCurrMovies] = useState(null);
    const [searchValue, setSearchValue] = useState('');

    const debouncedGetMovies = debounce(getMovies, 300);

    async function getMovies(param) {
        const data = await getMultiSearch(param);
        setCurrMovies(data);
    }

    function handleChange(e) {
        const value = e.target.value;
        setSearchValue(value);

        const param = encodeURIComponent(value);
        debouncedGetMovies(param);
    }

    return (
        <div className="main--search">
            <div className="main--input--wrapper">
                <input type="text" placeholder="search" onChange={handleChange} value={searchValue} />
            </div>

            <div style={currMovies && { paddingBlock: '10px' }} className="main--searchResults--wrapper">
                {currMovies && <DisplayDataSwiper data={currMovies} />}
            </div>
        </div>
    );
}
