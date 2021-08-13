//https://developer.valvesoftware.com/wiki/SteamID
//http://whatsmysteamid.azurewebsites.net/

//Steam64 = 76561198267993933
//Binary  = 00000001 0001 00000000000000000001 0001001001010111100011110100110 1
//          ^      ^ ^  ^ ^                  ^ ^                             ^ ^
//          |______| |__| |__________________| |_____________________________| |
//              U     AT        INSTANCE              32-BIT ACCOUNT ID        Y
//Steam32  = STEAM_1:1:153864102 -> STEAM_U:Y:32-bit
//Y is actually part of the 32 bits, it is just displayed separetly

import { SteamVanityURL } from "./APICalls"

export async function GetSteam64 (myInput) {

    if (isValidSteamId64(myInput)) {
        return myInput
    }

    if (isValidSteamId32(myInput)) {
        
        //will just assume universe, account type and instance as 1

        var firstHalf = "00000001000100000000000000000001"

        var steamId32Array = myInput.split(":")

        var accountIdLowBit = steamId32Array[1]

        var accountIdHighBits = parseInt(steamId32Array[2]).toString(2) //toString(2) from int to bits

        var secondHalf = accountIdHighBits.padStart(31, '0') + accountIdLowBit //padStart makes sure we get the whole 31 bits with leading zeros

        var steamId64 = BigInt('0b' + (firstHalf + secondHalf)) //parsing the string back to a number
        
        return steamId64.toString()
    }

    if (isValidSteamProfile(myInput)) {
        return /^https:\/\/steamcommunity\.com\/profiles\/([0-9]{17})(?:\/)?$/.exec(myInput)[1]
    }

    if (isValidVanityProfile(myInput)) {
        try {
            const { data } = await SteamVanityURL(myInput)
            if (data?.response.success === 1) {
                return data.response.steamid
            }
            return null
        } catch (err) {
            console.log(err)
            return null
        }
    }

    return null
}

export async function GetSteam32 (myInput) {

    if (isValidSteamId32(myInput)) {
        return myInput
    }
    
    if (isValidSteamId64(myInput)) {
        var steamId64 = BigInt(myInput)

        var universe = (steamId64 >> 56n) & 0xFFn

        var accountIdLowBit = steamId64 & 1n

        var accountIdHighBits = (steamId64 >> 1n) & 0x7FFFFFFFn

        return("STEAM_" + universe + ":" + accountIdLowBit + ":" + accountIdHighBits)
    }

    if (isValidSteamProfile(myInput)) {
        return /^https:\/\/steamcommunity\.com\/profiles\/([0-9]{17})(?:\/)?$/.exec(myInput)[1]
    }

    if (isValidVanityProfile(myInput)) {
        try {
            const { data } = await SteamVanityURL(myInput)
            if (data?.response.success === 1) {
                return data.response.steamid
            }
            return null
        } catch (err) {
            console.log(err)
            return null
        }
    }
    
    return null
}

export function isValidInput (myInput) {
    if (isValidSteamId64(myInput) || isValidSteamId32(myInput) || isValidSteamProfile(myInput) || isValidVanityProfile(myInput)) {
        return true
    }

    return false
}

function isValidSteamId64(steamID) {
    //76561199039866117
    return /^[0-9]{17}$/.test(steamID)
}

function isValidSteamId32(steamID) {
    //STEAM_1:1:153864102
    return /^STEAM_[0-5]:[01]:\d+$/.test(steamID)
}

function isValidSteamProfile(steamProfile) {
    //profiles is with steam64s
    //https://steamcommunity.com/profiles/76561199039866117/
    return /^https:\/\/steamcommunity\.com\/profiles\/([0-9]{17})(?:\/)?$/.test(steamProfile)
}

function isValidVanityProfile(steamProfile) {
    //id is with vanity url
    //https://steamcommunity.com/id/Syuks/
    return /^https:\/\/steamcommunity\.com\/id\/\S+$/.test(steamProfile)
}