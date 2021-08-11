import "./PlayerChip.css"

function PlayerChip ({ name }) {
    return (
        <button className="player-chip">
            <img src="/images/Syuks_full.jpg" alt="player1" />
            <span>{name}</span>
        </button>
    )
}

export default PlayerChip