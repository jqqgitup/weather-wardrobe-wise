
import { WeatherData } from "../types/weather";

const API_KEY = "replace_with_your_api_key"; // Note: In production, this should be in environment variables
const BASE_URL = "https://api.weatherapi.com/v1";

export const fetchWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`
    );
    
    if (!response.ok) {
      throw new Error("Weather data fetch failed");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`
    );
    
    if (!response.ok) {
      throw new Error("Weather data fetch failed");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather by city:", error);
    throw error;
  }
};

export const searchCities = async (query: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search.json?key=${API_KEY}&q=${query}`
    );
    
    if (!response.ok) {
      throw new Error("City search failed");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error searching cities:", error);
    throw error;
  }
};
