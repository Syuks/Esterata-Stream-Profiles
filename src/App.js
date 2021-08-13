import { useState, useEffect } from 'react'

import './App.css'

import countries from "./Data/countries.json"

import { useLocalStorage } from './Hooks/useLocalStorage'

import { isValidInput } from './Utils/SteamID'
import { GetSteam64 } from './Utils/SteamID'
import { PlayerRecords, SteamProfile } from './Utils/APICalls'
import PlayerRanking from './Utils/PlayerRanking'
import Dialog from './Components/Dialog'
import Autocomplete from './Components/Autocomplete'

import PlayerProfile from './Components/PlayerProfile'
import PlayerChip from './Components/PlayerChip'

function App() {

    const [playerPool, setPlayerPool] = useLocalStorage("playerPool", [])
    const [bannerPlayers, setBannerPlayers] = useState([])

    const [steamIdInput, setSteamIdInput] = useState("")

    const [dialogVisibility, setDialogVisibility] = useState(false)
    const [nationalityInput, setNationalityInput] = useState("")
    const [filteredCountries, setFilteredCountries] = useState(countries)

    const [showBackground, setShowBackground] = useState(false)

    const addPlayer = async () => {
        setSteamIdInput("")
        const steamid = await GetSteam64(steamIdInput)
        
        if (steamid) {
            const playerFound = playerPool.find(player => {
                return player.steamid === steamid
            })

            if (!playerFound) {
                Promise.all([SteamProfile(steamid), PlayerRecords(steamid)])
                    .then(responses => {
                        const playerProfile = responses[0].data.response.players[0]
                        const playerTimes = responses[1].data

                        const timesData = playerTimes.reduce(
                            (a, b) => {
                                return {
                                    points: a.points + b.points,
                                    wrs: a.wrs + (b.points === 1000 ? 1 : 0),
                                    reds: a.reds + (b.points >= 900 && b.points < 1000 ? 1 : 0),
                                    blues: a.blues + (b.points >= 800 && b.points < 900 ? 1 : 0)
                                }
                            },
                            {points: 0, wrs: 0, reds: 0, blues: 0}
                        )

                        const newPlayer = {
                            steamid: playerProfile.steamid,
                            name: playerProfile.personaname,
                            avatar: playerProfile.avatar,
                            avatarfull: playerProfile.avatarfull,
                            loc: playerProfile.loccountrycode ? playerProfile.loccountrycode : "_unknown",
                            ...timesData,
                            avg: playerTimes.length ? (timesData.points / playerTimes.length).toFixed(2) : 0,
                            rank: PlayerRanking(timesData.points, playerTimes.length)
                        }

                        setPlayerPool(oldPool => {
                            let newPool = [...oldPool]
                            newPool.push(newPlayer)
                            return newPool
                        })

                        if (!playerProfile.loccountrycode) {
                            setDialogVisibility(true)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("Player already in pool.")
            }
        }
    }

    const deletePlayer = (player) => {
        setPlayerPool(oldPool => {
            let newPool = [...oldPool]
            const playerToDelete = newPool.findIndex(p => {
                return p.steamid === player.steamid
            })
            newPool.splice(playerToDelete, 1)
            return newPool
        })
        setBannerPlayers([])
    }

    const dialogFooter = (
        <div style={{display:"flex", justifyContent:"space-between"}}>
            <button
                className="stylized-button button-text"
                onClick={e => {
                    setDialogVisibility(false)
                    setNationalityInput("")
                }}
            >
                Close
            </button>
            <button
                className="stylized-button"
                disabled={!countries.filter(country => country.Name === nationalityInput).length}
                onClick={e => {
                    setPlayerPool(oldPool => {
                        let newPool = [...oldPool]
                        newPool[newPool.length - 1].loc = countries.find(country => country.Name === nationalityInput).Code
                        return newPool
                    })
                    setDialogVisibility(false)
                    setNationalityInput("")
                }}
            >
                Save
            </button>
        </div>
    )

    const autocompleteTemplate = (item) => {
        return (
            <div style={{display: "flex", alignItems:"center"}}>
                <img width="24" title={item.Code} alt={item.Code} src={`/flags/${item.Code}.png`}/>
                <span style={{marginLeft:"0.5rem"}}>{item.Name}</span>
            </div>
        )
    }

    useEffect(()=>{
        let _filteredCountries
        if (!nationalityInput.trim().length) {
            _filteredCountries = [...countries]
        }
        else {
            _filteredCountries = countries.filter(country => {
                return country.Name.toLowerCase().includes(nationalityInput.toLowerCase())
            })
        }

        setFilteredCountries(_filteredCountries)
    },[nationalityInput])

    return (
        <div className="canvas" style={{backgroundImage: showBackground ? "url(/images/background.png)" : "none"}}>
            <div className="stream-section">
                <div className="players-row" style={{marginLeft: bannerPlayers.length === 1 ? "10rem" : 0}}>
                    {bannerPlayers.map((player, index) => {
                        return (
                            <PlayerProfile
                                key={index}
                                player={player}
                                inverted={index === 0 && bannerPlayers.length > 1 ? true : false}
                                bannerPlayers={bannerPlayers}
                            />
                        )
                    })}
                    {bannerPlayers.length > 1 && <img className="vs-image" src="/images/vs.png" alt="vs" />}
                </div>
            </div>
            <div className="settings-section">
                <div className="top-bar">
                    <div className="mode-chooser"></div>
                    <div className="players-input">
                        <input type="text" placeholder="Steam ID" value={steamIdInput} onChange={e => setSteamIdInput(e.target.value)} ></input>
                        <button disabled={!isValidInput(steamIdInput)} onClick={addPlayer}>ADD</button>
                    </div>
                    <div className="background-setting">
                        <label htmlFor="background-checkbox">Background</label>
                        <input id="background-checkbox" type="checkbox" checked={showBackground} onChange={e => setShowBackground(e.target.checked)}></input>
                    </div>
                </div>
                <div className="players-pool">
                    {playerPool.map((player, index) => {
                        return <PlayerChip
                            key={index}
                            player={player}
                            bannerPlayers={bannerPlayers}
                            setBannerPlayers={setBannerPlayers}
                            deletePlayer={deletePlayer}
                        />
                    })}
                </div>
                <Dialog
                    visible={dialogVisibility}
                    header="Nationality missing"
                    footer={dialogFooter}
                >
                    <div style={{marginBottom:"1rem"}}>This player doesn't have a nationality in Steam. Please choose one.</div>
                    <Autocomplete
                        value={nationalityInput}
                        onChange={value => setNationalityInput(value)}
                        placeholder="Nationality"
                        suggestions={filteredCountries}
                        field="Name"
                        itemTemplate={autocompleteTemplate}
                    />
                </Dialog>
            </div>
        </div>
    )
}

export default App
