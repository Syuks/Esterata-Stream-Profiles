import countries from "../Data/countries.json"

export default function PlayerCountry (code) {
    const countryFound = countries.find(country => {
        return country.Code === code
    })

    return countryFound ? countryFound.Name : "Unknown"
}