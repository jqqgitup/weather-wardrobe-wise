
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ForecastDay, TemperatureUnit } from '@/types/weather';

interface ForecastWeatherProps {
  forecast: ForecastDay[];
  tempUnit: TemperatureUnit;
}

const ForecastWeather: React.FC<ForecastWeatherProps> = ({ forecast, tempUnit }) => {
  // Format date to display day name
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <Card className="glass-card overflow-hidden mt-6 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">未来天气预报</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forecast.map((day, index) => {
            const maxTemp = tempUnit === TemperatureUnit.Celsius 
              ? Math.round(day.day.maxtemp_c) 
              : Math.round(day.day.maxtemp_f);
            const minTemp = tempUnit === TemperatureUnit.Celsius 
              ? Math.round(day.day.mintemp_c) 
              : Math.round(day.day.mintemp_f);
            
            return (
              <div 
                key={index} 
                className={`flex flex-col items-center p-4 rounded-lg bg-white/30 dark:bg-gray-800/30 ${index === 0 ? 'border-l-4 border-primary' : ''}`}
              >
                <h3 className="font-medium mb-2">{formatDate(day.date)}</h3>
                <img 
                  src={day.day.condition.icon} 
                  alt={day.day.condition.text}
                  className="w-16 h-16 my-2"
                />
                <div className="text-sm">{day.day.condition.text}</div>
                <div className="flex gap-3 mt-2">
                  <span className="font-bold">{maxTemp}°</span>
                  <span className="text-gray-600 dark:text-gray-400">{minTemp}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastWeather;
