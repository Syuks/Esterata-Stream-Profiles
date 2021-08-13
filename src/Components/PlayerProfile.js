import "./PlayerProfile.css"

import PlayerCountry from "../Utils/PlayerCountry"

function PlayerProfile ({ player, inverted, bannerPlayers }) {
    return (
        <div style={{width: "40%"}}>

            <div className="player" style={{flexDirection: inverted ? "row-reverse" : "row"}}>
                <div className="avatar">
                    <img className="avatar-image" src={player.avatarfull} alt="playerAvatar" />
                </div>
                <div className="info-col" style={{
                    marginLeft: inverted ? 0 : "3rem",
                    marginRight: inverted ? "3rem" : 0,
                    textAlign: inverted ? "end" : "start",
                    overflow: bannerPlayers.length > 1 ? "hidden" : "unset"
                }}>
                    <div className="info-name">{player.name}</div>
                    <div className={`info-rank ${player.rank}`}>{player.rank}</div>
                    <div className="info-points">{`${player.points.toLocaleString()} (${player.avg})`}</div>
                </div>
            </div>

            <div className="bottom-row" style={{flexDirection: inverted ? "row-reverse" : "row"}}>
                <div className="country-box">
                    <div className="country-name">{PlayerCountry(player.loc)}</div>
                    <div>
                        <img title={player.loc} alt={player.loc} src={`/flags/${player.loc}.png`}/>
                    </div>
                </div>
                <div className="medals" style={{flexDirection: inverted ? "row-reverse" : "row"}}>
                    <div className="medal">
                        <div className="medal-image">
                            <img src={`/images/medals/WRs${player.wrs === 0 ? "-empty" : ""}.png`} alt="WRsMedal" />
                        </div>
                        <div className="medal-count">{player.wrs}</div>
                    </div>
                    <div className="medal">
                        <div className="medal-image">
                            <img src={`/images/medals/900s${player.reds === 0 ? "-empty" : ""}.png`} alt="900sMedal" />
                        </div>
                        <div className="medal-count">{player.reds}</div>
                    </div>
                    <div className="medal">
                        <div className="medal-image">
                            <img src={`/images/medals/800s${player.blues === 0 ? "-empty" : ""}.png`} alt="800sMedal" />
                        </div>
                        <div className="medal-count">{player.blues}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlayerProfile