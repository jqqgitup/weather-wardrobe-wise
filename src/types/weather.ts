
export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_mph: number;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
  hour: WeatherHour[];
}

export interface WeatherHour {
  time: string;
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
}

export enum TemperatureUnit {
  Celsius = "C",
  Fahrenheit = "F"
}

export interface ClothingRecommendation {
  upperBody: string;
  lowerBody: string;
  accessories: string[];
  description: string;
}

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'clear';

export interface City {
  name: string;
  country: string;
}
