const RANKING = [
    "NEWBIE",
    "NEWBIE+",
    "SCRUB",
    "SCRUB+",
    "TRAINEE",
    "TRAINEE+",
    "CASUAL",
    "CASUAL+",
    "REGULAR",
    "REGULAR+",
    "SKILLED",
    "SKILLED+",
    "EXPERT",
    "EXPERT+",
    "SEMIPRO",
    "SEMIPRO+",
    "PRO",
    "PRO+",
    "DEMIGOD",
    "GOD"
]

export default function PlayerRanking (points, completions) {
    //The rank is bassically dependant on avg points, but if you have less than 50k points, your rank will be decreased by an ease cubic function
    
    const average = points/50000
    
    let easeOutCubic = (1 - (Math.pow(1 - average, 3)))
    if (easeOutCubic > 1) {
        easeOutCubic = 1
    }
    
    const avg = completions > 0 ? points/completions : 0
    
    return RANKING[(Math.floor((avg * easeOutCubic) * 0.02))]
}