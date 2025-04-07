
import { WeatherData } from "../types/weather";
import { toast } from "@/components/ui/use-toast";
import { CAIYUN_API } from "./api/config";
import { fetchCityLocation, fetchLocationName, searchCities as searchCitiesAPI } from "./api/locationService";
import { convertCaiyunToWeatherData } from "./utils/weatherUtils";

// 通过经纬度获取天气数据
export const fetchWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    // 彩云天气要求经度在前，纬度在后
    const response = await fetch(
      `${CAIYUN_API.BASE_URL}/${CAIYUN_API.KEY}/${lon},${lat}/weather?alert=true&dailysteps=3&hourlysteps=24`
    );
    
    if (!response.ok) {
      throw new Error("天气数据获取失败");
    }
    
    const data = await response.json();
    
    // 构造location信息
    const location = {
      lat,
      lon,
      name: await fetchLocationName(lat, lon)
    };
    
    return convertCaiyunToWeatherData(data, location);
  } catch (error) {
    console.error("获取天气数据错误:", error);
    throw error;
  }
};

// 通过城市名获取天气数据
export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    // 先通过高德地图API获取城市的经纬度
    const cityLocation = await fetchCityLocation(city);
    if (!cityLocation) {
      throw new Error("无法获取城市位置");
    }
    
    // 然后用经纬度获取天气信息
    return await fetchWeatherByCoords(cityLocation.lat, cityLocation.lon);
  } catch (error) {
    console.error("通过城市获取天气错误:", error);
    throw error;
  }
};

// 导出位置服务中的搜索城市功能
export { searchCitiesAPI as searchCities };
