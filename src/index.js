import React, {  useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
    BrowserRouter as Router,
    Route, Link
} from 'react-router-dom'

import * as serviceWorker from './serviceWorker'




const Bird = (props) => {
    const date = new Date(props.bird.time).toLocaleDateString()

    const time = new Date(props.bird.time).toLocaleTimeString()
    let lat
    let lon
    if (props.bird.coords) {

        lat = props.bird.coords.lat
        lon = props.bird.coords.lon
    } else {

        lat = 'undefined'
        lon = 'undefined'
    }

    return (
        
        <div className='bird' key={props.bird.key}>
            <div className='birdInfo'>
                <p className='birdInfoAttribute'>{props.bird.species}</p>
                <p className='birdInfoAttribute'>{props.bird.notes}</p>
            </div>
            <div className='otherInfo'>
                <p className='birdOtherAttribute'>{date} <br/> {time}</p>
                <p className='birdOtherAttribute'>{props.bird.rarity}</p>
                <p className='birdOtherAttribute'>Latitude: {lat} <br/> Longitude: {lon}</p>
            </div>
            
        </div>
        
    )
}

const Birdlist = (props) => {
    const [sorting, setSorting] = useState(true)
    const birdComponents = []
    for (let bird of props.birds) {
        birdComponents.push(<Bird bird={bird} key={bird.key}/>)
    }

    const sortBirds = () => {
        let birds = props.birds.slice()
        if (sorting) {
            birds.sort(function (a, b) {
                return b.time - a.time
            })
            setSorting(false)
        } else {
            birds.sort(function (a, b) {
                return a.time - b.time
            })
            setSorting(true)
        }
        
        
        props.setBirds(birds)
    }


    return (
        <div className='birdList'>
            <button onClick={sortBirds}>Change order</button> 
                   
            {birdComponents}        
        </div>
    )
}

const Form = (props) => {
    const [species, setSpecies] = useState('')
    const [notes, setNotes] = useState('')
    const [rarity, setRarity] = useState('common')

    const handleSpeciesChange = (e) => {
        setSpecies(e.target.value)
    }

    const handleNotesChange = (e) => {
        setNotes(e.target.value)
    }

    const handleRarityChange = (e) => {
        setRarity(e.target.value)
    }
    const eraseForm = () => {
        setNotes('')
        setSpecies('')
        setRarity('common')
    }

    const onSubmit = (e) => {
        e.preventDefault()
        let stored = JSON.parse(localStorage.getItem('birds'))
        let time = new Date().getTime()
        let coordinates = null
        let key = props.birds.length
        navigator.geolocation.getCurrentPosition((position) => {
            
            coordinates = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            }

            stored[key].coords = coordinates
            localStorage.setItem('birds', JSON.stringify(stored))
            props.setBirds(stored)  
        })

        
        let bird = {
            species: species,
            notes: notes,
            rarity: rarity,
            time: time,
            key: key,
            coords: coordinates

            
        }

        if(stored) {
            stored.push(bird)

            localStorage.setItem('birds', JSON.stringify(stored))
        } else {
            stored = []
            stored.push(bird)
            localStorage.setItem('birds', JSON.stringify(stored))
        }
        
        props.setBirds(props.birds.concat(bird))
        eraseForm()
    }
    
    return (       
        <div>
            <h3>Add a new bird sighting</h3>
                <form onSubmit={onSubmit}>
            <div>
                Species: <input value={species} onChange={handleSpeciesChange} />
            </div>
            <div>
                Notes: <input value={notes} onChange={handleNotesChange}/>
            </div>
            <div>
                Rarity:
                <select value={rarity} onChange={handleRarityChange}>
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="extremely rare">Extremely rare</option>
                </select>
            </div>
                <button type="submit">Submit</button>
                <button onClick={eraseForm}>Cancel</button>
            </form>
        </div>
    )
}


const App = () => {
    const [birds, setBirds] = useState([])

    useEffect(() => {
        let birds = JSON.parse(localStorage.getItem('birds'))
        if(birds) {
            
            setBirds(birds)
        }
        
    }, [])
    

    return (
        <div>
            <Router>
                <div className='navbar'>
                    <Link className='naviItem' to="/">home</Link>
                    <Link className='naviItem' to="/newbird">new bird</Link>
                </div>
                <Route exact path="/" render={() => <Birdlist birds={birds} setBirds={setBirds}/>} />
                <Route path="/newbird" render={() => <Form setBirds={setBirds} birds={birds}/>} />
            </Router>
            
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
