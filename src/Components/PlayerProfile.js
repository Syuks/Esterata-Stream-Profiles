import "./PlayerProfile.css"

function PlayerProfile ({ inverted }) {
    return (
        <div className="player" style={{flexDirection: inverted ? "row-reverse" : "row"}}>
            <div className="avatar">
                <img className="avatar-image" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/a4/a4c507b8f8f13f90a3a213185a394ac3fe2dcc85_full.jpg" alt="playerAvatar" />
            </div>
            <div className="medals" style={{marginLeft: inverted ? 0 : "3rem", marginRight: inverted ? "3rem" : 0}}>
                <div className="medal wr-medal">
                    <img src="/images/medals/WRs.png" alt="WRsMedal" />
                    <span className="wr-badge">1</span>
                </div>
                <div className="medal red-medal">
                    <img src="/images/medals/900s.png" alt="900sMedal" />
                    <span className="red-badge">1</span>
                </div>
                <div className="medal blue-medal">
                    <img src="/images/medals/800s.png" alt="800sMedal" />
                    <span className="blue-badge">1</span>
                </div>
            </div>
            <div className="info-col" style={{
                marginLeft: inverted ? 0 : "3rem",
                marginRight: inverted ? "3rem" : 0,
                textAlign: inverted ? "end" : "start"
            }}>
                <div className="info-name">
                    {inverted && 
                        <img title="AR" alt="AR" src="/flags/AR.png" style={{marginRight: "1.25rem"}}/>
                    }
                    <span>Syuks</span>
                    {!inverted && 
                        <img title="AR" alt="AR" src="/flags/AR.png" style={{marginLeft: "1.25rem"}}/>
                    }
                </div>
                <div className="info-rank">NEWBIE</div>
                <div className="info-points">975 (487.50)</div>
            </div>
        </div>
    )
}

export default PlayerProfile