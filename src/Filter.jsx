import { useState } from "react"

export default function Filter({ setSearchParams, type, searchParams }) {
  function handleClickFilter(genreId) {
    setSearchParams(prev => {
      let curr = prev.getAll('genre')
      if (curr.length > 0) {
        let arrSp = curr[0].split(',')
        if (arrSp.includes(genreId.toString())) {
          let newArr = arrSp.filter(d => d !== genreId.toString())
          newArr.length > 0 ? prev.set('genre', newArr.join(',')) : prev.delete('genre')
        } else {
          let newVal = curr[0] + ',' + genreId
          prev.set('genre', newVal)
        }
      } else {
        prev.set('genre', genreId)
      }
      return prev
    })
  }
  const json = type === 'movie' ? `{
        "genres": [
          {
            "id": 28,
            "name": "Action"
          },
          {
            "id": 12,
            "name": "Adventure"
          },
          {
            "id": 16,
            "name": "Animation"
          },
          {
            "id": 35,
            "name": "Comedy"
          },
          {
            "id": 80,
            "name": "Crime"
          },
          {
            "id": 99,
            "name": "Documentary"
          },
          {
            "id": 18,
            "name": "Drama"
          },
          {
            "id": 10751,
            "name": "Family"
          },
          {
            "id": 14,
            "name": "Fantasy"
          },
          {
            "id": 27,
            "name": "Horror"
          },
          {
            "id": 9648,
            "name": "Mystery"
          },
          {
            "id": 10749,
            "name": "Romance"
          },
          {
            "id": 878,
            "name": "Science Fiction"
          },
          {
            "id": 53,
            "name": "Thriller"
          },
          {
            "id": 10752,
            "name": "War"
          },
          {
            "id": 37,
            "name": "Western"
          }
        ]
      }`: `{
        "genres": [
          {
            "id": 10759,
            "name": "Action & Adventure"
          },
          {
            "id": 16,
            "name": "Animation"
          },
          {
            "id": 35,
            "name": "Comedy"
          },
          {
            "id": 80,
            "name": "Crime"
          },
          {
            "id": 99,
            "name": "Documentary"
          },
          {
            "id": 18,
            "name": "Drama"
          },
          {
            "id": 10751,
            "name": "Family"
          },
          {
            "id": 10762,
            "name": "Kids"
          },
          {
            "id": 9648,
            "name": "Mystery"
          },
          {
            "id": 10763,
            "name": "News"
          },
          {
            "id": 10764,
            "name": "Reality"
          },
          {
            "id": 10765,
            "name": "Sci-Fi & Fantasy"
          },
          {
            "id": 10766,
            "name": "Soap"
          },
          {
            "id": 10767,
            "name": "Talk"
          },
          {
            "id": 10768,
            "name": "War & Politics"
          },
          {
            "id": 37,
            "name": "Western"
          }
        ]
      }`

  const filterDataObj = JSON.parse(json)
  const filterBtns = filterDataObj.genres.map(d => {
    if (searchParams.getAll('genre')[0]?.split(',').includes(d.id.toString())) {
      return (
        <button key={d.id} style={{ backgroundColor: 'rgb(10, 69, 14)' }} onClick={() => {
          handleClickFilter(d.id)
        }}>{d.name}</button>
      )
    } else {
      return (
        <button key={d.id} onClick={() => {
          handleClickFilter(d.id)
        }}>{d.name}</button>
      )
    }
  })
  const [displayFilters, setDisplayFilters] = useState(false)

  let bruh = searchParams.getAll('matchALL').length > 0
  function toggleSwitch() {
    setSearchParams(p => {
      if (bruh) {
        p.delete('matchALL')
      } else {
        p.set('matchALL', 'yes')
      }
      return p
    })
  }


  return (
    <div className="movies--filter">
      <button onClick={() => {
        setDisplayFilters(p => !p)
      }}> Filters </button>

      {
        displayFilters &&
        <>
          <div className="switchWrapper">
            <span>Movies that match 'ALL' selected Genre ??</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={bruh} onChange={toggleSwitch} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="filterBtn--wrapper">
            {filterBtns}
          </div>
        </>
      }
    </div >
  )
}