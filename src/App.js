import './App.css'

//https://esterata.com/profile.php?id=76561198199601203
import PlayerProfile from './Components/PlayerProfile'
import PlayerChip from './Components/PlayerChip'

function App() {

    return (
        <div className="canvas">
            <div className="stream-section">
                <div className="players-row">
                    <PlayerProfile inverted={true} />
                    <img src="/images/vs.png" alt="vs" style={{marginLeft:"5rem", marginRight:"5rem"}} />
                    <PlayerProfile inverted={false} />
                </div>
            </div>
            <div className="settings-section">
                <div className="players-input">
                    <input type="text" placeholder="Steam ID" ></input>
                    <button>ADD</button>
                </div>
                <div className="players-pool">
                    <PlayerChip name="Syuks" />
                    <PlayerChip name="Syuks" />
                </div>
            </div>
        </div>
    )
}

export default App
