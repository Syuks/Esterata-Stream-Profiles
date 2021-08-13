import axios from 'axios'

import { GetSteam64 } from './SteamID'

const globalAPI = axios.create({
    baseURL: 'https://kztimerglobal.com/api/v2.0/'
})

const steamAPI = axios.create({
    baseURL: 'https://kzprofile.kreedz.top/api/v1/'
})

export async function PlayerRecords (identifier) {
    const url = 'records/top'

    const steamid = await GetSteam64(identifier)

    let params = {
        steamid64: steamid,
        modes_list_string: "kz_vanilla",
        has_teleports: false,
        stage: 0,
        tickrate: 128,
        limit: 9999
    }

    return globalAPI.get( url, {params: params} )
}

export async function SteamProfile (identifier) {
    const url = 'steam'

    const steamid = await GetSteam64(identifier)

    let params = {
        steamids: steamid
    }

    return steamAPI.get( url, {params: params} )
}

export function SteamVanityURL (vanityURL) {
    //https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=023DC037A9187B9DD374365F858B5545&vanityurl=Syuks
    
    const url = 'steam/vanity'

    const vanityKey = vanityURL.split("/id/").pop().replace("/","")

    const params = {
        url: vanityKey
    }

    return steamAPI.get( url, {params: params} )
}