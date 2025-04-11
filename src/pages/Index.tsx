
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastWeather from '@/components/ForecastWeather';
import ClothingRecommendation from '@/components/ClothingRecommendation';
import CitySearch from '@/components/CitySearch';
import { useGeolocation } from '@/hooks/useGeolocation';
import { fetchWeatherByCoords, fetchWeatherByCity } from '@/services/weatherService';
import { getClothingRecommendation, getWeatherBackground } from '@/services/clothingService';
import { WeatherData, TemperatureUnit, ClothingRecommendation as RecommendationType, City } from '@/types/weather';
import { Button } from '@/components/ui/button';
import { Thermometer, ThermometerSun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationType | null>(null);
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(TemperatureUnit.Celsius);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherBackground, setWeatherBackground] = useState<string>('bg-gradient-to-b from-blue-400 to-blue-600');
  
  const { latitude, longitude, error: locationError } = useGeolocation();
  const { toast } = useToast();

  // Initial fetch based on geolocation
  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData(latitude, longitude);
    } else if (locationError) {
      // If geolocation fails, default to a popular city
      fetchWeatherByCity('Shanghai')
        .then(data => {
          processWeatherData(data);
        })
        .catch(err => {
          setError('无法获取天气数据，请稍后再试');
          toast({
            title: "获取天气数据失败",
            description: "无法获取位置的天气数据。",
            variant: "destructive"
          });
          setLoading(false);
        });
    }
  }, [latitude, longitude, locationError]);

  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherByCoords(lat, lon);
      processWeatherData(data);
    } catch (err) {
      setError('无法获取天气数据，请稍后再试');
      toast({
        title: "获取天气数据失败",
        description: "请检查您的网络连接或稍后再试。",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleCitySelect = async (city: City) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherByCity(city.name);
      processWeatherData(data);
      toast({
        title: "已更新天气",
        description: `显示 ${city.name}, ${city.country} 的天气`,
      });
    } catch (err) {
      setError('无法获取所选城市的天气数据');
      toast({
        title: "获取天气数据失败",
        description: "无法获取所选城市的天气数据。",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const processWeatherData = (data: WeatherData) => {
    setWeatherData(data);
    
    // Generate clothing recommendation
    const clothingRecommendation = getClothingRecommendation(
      data.current.temp_c,
      data.current.condition.text,
      data.current.humidity
    );
    setRecommendation(clothingRecommendation);
    
    // Set weather background
    const background = getWeatherBackground(data.current.condition.text);
    setWeatherBackground(background);
    
    setLoading(false);
  };

  const toggleTemperatureUnit = () => {
    setTempUnit(tempUnit === TemperatureUnit.Celsius ? TemperatureUnit.Fahrenheit : TemperatureUnit.Celsius);
  };

  if (loading && !weatherData) {
    return (
      <Layout>
        <div className="h-[70vh] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-medium text-gray-100">加载天气数据中...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="h-[70vh] flex flex-col items-center justify-center">
          <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">出错了</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              刷新页面
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout weatherBackground={weatherBackground}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <CitySearch onCitySelect={handleCitySelect} />
          
          <Button 
            variant="outline" 
            onClick={toggleTemperatureUnit}
            className="bg-white/20 hover:bg-white/30 border-0"
          >
            {tempUnit === TemperatureUnit.Celsius ? (
              <><Thermometer className="w-5 h-5 mr-2" /> °C</>
            ) : (
              <><ThermometerSun className="w-5 h-5 mr-2" /> °F</>
            )}
          </Button>
        </div>
        
        {weatherData && (
          <>
            <CurrentWeather weatherData={weatherData} tempUnit={tempUnit} />
            {recommendation && <ClothingRecommendation recommendation={recommendation} />}
            {weatherData.forecast && (
              <ForecastWeather forecast={weatherData.forecast.forecastday} tempUnit={tempUnit} />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
