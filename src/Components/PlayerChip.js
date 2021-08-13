import "./PlayerChip.css"

function PlayerChip ({ player, bannerPlayers, setBannerPlayers, deletePlayer }) {

    const onChipClicked = () => {
        setBannerPlayers(oldPlayers => {
            let newPlayers = [...oldPlayers]

            const playerIndex = newPlayers.findIndex(p => {
                return p.steamid === player.steamid
            })

            if (playerIndex !== -1) {
                newPlayers.splice(playerIndex, 1)
            } else {
                newPlayers.splice(1, 1, player)
            }
            
            return newPlayers
        })
    }

    return (
        <div className="player-chip">
            <button className={`player-button ${bannerPlayers.includes(player) ? "active" : ""}`} onClick={onChipClicked}>
                <img src={player.avatar} alt={player.name} />
                <span>{player.name}</span>
            </button>
            <button className="delete-button" onClick={e => deletePlayer(player)}>x</button>
        </div>
    )
}

export default PlayerChip