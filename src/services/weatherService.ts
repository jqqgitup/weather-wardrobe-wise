
import { WeatherData } from "../types/weather";
import { toast } from "@/components/ui/use-toast";
import { CAIYUN_API } from "./api/config";
import { fetchCityLocation, fetchLocationName, searchCities as searchCitiesAPI } from "./api/locationService";
import { convertCaiyunToWeatherData, getWeatherIcon } from "./utils/weatherUtils";

// 通过经纬度获取天气数据
export const fetchWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    console.log(`正在获取位置(${lat},${lon})的天气数据...`);
    
    // 添加跨域代理以避免CORS问题
    const proxyUrl = `https://cors-anywhere.herokuapp.com/`;
    const targetUrl = `${CAIYUN_API.BASE_URL}/${CAIYUN_API.KEY}/${lon},${lat}/weather?alert=true&dailysteps=3&hourlysteps=24`;
    
    // 直接使用彩云天气API，不使用代理，因为可能不需要
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      throw new Error(`天气数据获取失败: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("彩云天气API返回数据:", data);
    
    // 构造location信息
    const location = {
      lat,
      lon,
      name: await fetchLocationName(lat, lon)
    };
    
    return convertCaiyunToWeatherData(data, location);
  } catch (error) {
    console.error("获取天气数据错误:", error);
    // 使用模拟数据作为后备
    return generateMockWeatherData(lat, lon);
  }
};

// 通过城市名获取天气数据
export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    console.log(`正在获取城市${city}的位置信息...`);
    // 先通过高德地图API获取城市的经纬度
    const cityLocation = await fetchCityLocation(city);
    if (!cityLocation) {
      console.log(`无法获取城市${city}的位置`);
      throw new Error("无法获取城市位置");
    }
    
    console.log(`城市${city}的位置:`, cityLocation);
    // 然后用经纬度获取天气信息
    return await fetchWeatherByCoords(cityLocation.lat, cityLocation.lon);
  } catch (error) {
    console.error("通过城市获取天气错误:", error);
    // 使用模拟数据作为后备
    return generateMockWeatherData(39.9042, 116.4074, city); // 北京的大致坐标
  }
};

// 生成模拟天气数据，在API调用失败时使用
const generateMockWeatherData = (lat: number, lon: number, cityName = "未知城市"): WeatherData => {
  console.log("使用模拟天气数据");
  
  const today = new Date();
  const forecastDays = [];
  
  // 生成未来三天的预报数据
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    forecastDays.push({
      date: date.toISOString().split('T')[0],
      day: {
        maxtemp_c: 22 + Math.floor(Math.random() * 5),
        maxtemp_f: 72 + Math.floor(Math.random() * 9),
        mintemp_c: 15 + Math.floor(Math.random() * 3),
        mintemp_f: 59 + Math.floor(Math.random() * 5),
        condition: {
          text: i === 0 ? "晴天" : i === 1 ? "多云" : "小雨",
          icon: i === 0 ? "https://unpkg.com/@qwd/weather-icons/dist/icons/fill/sunny.svg" : 
                i === 1 ? "https://unpkg.com/@qwd/weather-icons/dist/icons/fill/cloudy-day.svg" : 
                "https://unpkg.com/@qwd/weather-icons/dist/icons/fill/rain.svg",
          code: i
        }
      },
      hour: []
    });
  }
  
  return {
    location: {
      name: cityName,
      country: "中国",
      lat: lat,
      lon: lon
    },
    current: {
      temp_c: 20 + Math.floor(Math.random() * 5),
      temp_f: 68 + Math.floor(Math.random() * 9),
      condition: {
        text: "晴天",
        icon: "https://unpkg.com/@qwd/weather-icons/dist/icons/fill/sunny.svg",
        code: 0
      },
      wind_kph: 5 + Math.floor(Math.random() * 10),
      wind_mph: 3 + Math.floor(Math.random() * 6),
      humidity: 40 + Math.floor(Math.random() * 20),
      feelslike_c: 21 + Math.floor(Math.random() * 3),
      feelslike_f: 70 + Math.floor(Math.random() * 5),
      uv: 5 + Math.floor(Math.random() * 3)
    },
    forecast: {
      forecastday: forecastDays
    }
  };
};

// 导出位置服务中的搜索城市功能
export { searchCitiesAPI as searchCities };
