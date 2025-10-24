import fetch from "node-fetch";

export interface GetWeatherRequest {
    city: string
}

export interface GetWeatherResponse {
    current_condition: {
        temp_C: number,
        temp_F: number,
        weatherDesc: {value: string}[]
    }[]
}

export async function getWeather({ city }: GetWeatherRequest): Promise<GetWeatherResponse> {
    const resp = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);

    // grab first result from API response because the weather API returns like 30K bytes of data
    const {
        current_condition: [{
            temp_C,
            temp_F,
            weatherDesc: [{ value }]
        }]
    }: GetWeatherResponse = await resp.json() as GetWeatherResponse;

    return {
        current_condition: [
            {
                temp_C,
                temp_F,
                weatherDesc: [{value}]
            }
        ]
    };
}