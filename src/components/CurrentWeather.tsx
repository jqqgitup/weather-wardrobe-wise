
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherData, TemperatureUnit } from '@/types/weather';
import { Wind, Droplets, ThermometerSun, Sun } from 'lucide-react';

interface CurrentWeatherProps {
  weatherData: WeatherData;
  tempUnit: TemperatureUnit;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData, tempUnit }) => {
  const { current, location } = weatherData;
  
  const temperature = tempUnit === TemperatureUnit.Celsius ? current.temp_c : current.temp_f;
  const feelsLike = tempUnit === TemperatureUnit.Celsius ? current.feelslike_c : current.feelslike_f;
  const windSpeed = tempUnit === TemperatureUnit.Celsius ? `${current.wind_kph} km/h` : `${current.wind_mph} mph`;
  
  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-xl font-medium text-gray-600 dark:text-gray-300">当前天气</h2>
            <h1 className="text-4xl font-bold mt-2 text-gray-800 dark:text-white">
              {location.name}, {location.country}
            </h1>
          </div>
          <div className="flex items-center">
            <img 
              src={current.condition.icon.replace('64x64', '128x128')} 
              alt={current.condition.text}
              className="w-24 h-24 object-contain animate-float"
            />
            <div className="ml-4 text-center">
              <div className="text-5xl font-bold text-gray-800 dark:text-white">
                {Math.round(temperature)}°{tempUnit}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-300">
                {current.condition.text}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <ThermometerSun className="w-6 h-6 text-orange-500 mr-3" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">体感温度</div>
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {Math.round(feelsLike)}°{tempUnit}
              </div>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <Wind className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">风速</div>
              <div className="font-medium text-gray-800 dark:text-gray-200">{windSpeed}</div>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <Droplets className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">湿度</div>
              <div className="font-medium text-gray-800 dark:text-gray-200">{current.humidity}%</div>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <Sun className="w-6 h-6 text-yellow-500 mr-3" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">紫外线指数</div>
              <div className="font-medium text-gray-800 dark:text-gray-200">{current.uv}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
