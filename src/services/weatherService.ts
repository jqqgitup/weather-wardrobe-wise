
import { WeatherData } from "../types/weather";
import { toast } from "@/components/ui/use-toast";

// 彩云天气API (with the provided API key)
const API_KEY = "E2yfcaKev2oZ5rZE"; // 彩云天气 API key
const BASE_URL = "https://api.caiyunapp.com/v2.6";

// 转换彩云天气API数据为我们的数据结构
const convertCaiyunToWeatherData = (data: any, location: any): WeatherData => {
  const { result } = data;

  // 处理未来天气预报
  const forecastDays = [];
  // 今天
  const today = new Date();
  // 未来三天
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    const dayData = {
      date: date.toISOString().split('T')[0],
      day: {
        maxtemp_c: Math.round(result.daily.temperature_max[i]),
        maxtemp_f: Math.round(result.daily.temperature_max[i] * 9/5 + 32),
        mintemp_c: Math.round(result.daily.temperature_min[i]),
        mintemp_f: Math.round(result.daily.temperature_min[i] * 9/5 + 32),
        condition: {
          text: getWeatherConditionText(result.daily.skycon[i]),
          icon: getWeatherIcon(result.daily.skycon[i]),
          code: i
        }
      },
      hour: []
    };
    forecastDays.push(dayData);
  }

  // 构建WeatherData对象
  return {
    location: {
      name: location.name || "未知位置",
      country: "中国",
      lat: location.lat,
      lon: location.lon
    },
    current: {
      temp_c: Math.round(result.realtime.temperature),
      temp_f: Math.round(result.realtime.temperature * 9/5 + 32),
      condition: {
        text: getWeatherConditionText(result.realtime.skycon),
        icon: getWeatherIcon(result.realtime.skycon),
        code: 0
      },
      wind_kph: Math.round(result.realtime.wind.speed * 3.6), // m/s 转 km/h
      wind_mph: Math.round(result.realtime.wind.speed * 2.237), // m/s 转 mph
      humidity: Math.round(result.realtime.humidity * 100), // 转为百分比
      feelslike_c: Math.round(result.realtime.apparent_temperature),
      feelslike_f: Math.round(result.realtime.apparent_temperature * 9/5 + 32),
      uv: Math.round(result.realtime.life_index.ultraviolet.index)
    },
    forecast: {
      forecastday: forecastDays
    }
  };
};

// 根据彩云天气的天气代码获取对应的天气描述
const getWeatherConditionText = (skycon: string): string => {
  const skyconMap: Record<string, string> = {
    'CLEAR_DAY': '晴天',
    'CLEAR_NIGHT': '晴夜',
    'PARTLY_CLOUDY_DAY': '多云',
    'PARTLY_CLOUDY_NIGHT': '多云',
    'CLOUDY': '阴',
    'LIGHT_HAZE': '轻度雾霾',
    'MODERATE_HAZE': '中度雾霾',
    'HEAVY_HAZE': '重度雾霾',
    'LIGHT_RAIN': '小雨',
    'MODERATE_RAIN': '中雨',
    'HEAVY_RAIN': '大雨',
    'STORM_RAIN': '暴雨',
    'FOG': '雾',
    'LIGHT_SNOW': '小雪',
    'MODERATE_SNOW': '中雪',
    'HEAVY_SNOW': '大雪',
    'STORM_SNOW': '暴雪',
    'DUST': '浮尘',
    'SAND': '沙尘',
    'WIND': '大风'
  };
  return skyconMap[skycon] || '未知天气';
};

// 根据彩云天气的天气代码获取对应的图标URL
const getWeatherIcon = (skycon: string): string => {
  // 使用开源的天气图标URL
  const iconBase = "https://cdn.jsdelivr.net/gh/qwd/WeatherIcon/dist/icons/fill/";
  
  const skyconMap: Record<string, string> = {
    'CLEAR_DAY': 'sunny.svg',
    'CLEAR_NIGHT': 'night.svg',
    'PARTLY_CLOUDY_DAY': 'cloudy-day.svg',
    'PARTLY_CLOUDY_NIGHT': 'cloudy-night.svg',
    'CLOUDY': 'cloudy.svg',
    'LIGHT_HAZE': 'haze.svg',
    'MODERATE_HAZE': 'haze.svg',
    'HEAVY_HAZE': 'haze.svg',
    'LIGHT_RAIN': 'rain.svg',
    'MODERATE_RAIN': 'rain.svg',
    'HEAVY_RAIN': 'heavy-rain.svg',
    'STORM_RAIN': 'storm.svg',
    'FOG': 'fog.svg',
    'LIGHT_SNOW': 'snow.svg',
    'MODERATE_SNOW': 'snow.svg',
    'HEAVY_SNOW': 'heavy-snow.svg',
    'STORM_SNOW': 'blizzard.svg',
    'DUST': 'dust.svg',
    'SAND': 'dust.svg',
    'WIND': 'wind.svg'
  };
  
  return `${iconBase}${skyconMap[skycon] || 'cloudy.svg'}`;
};

export const fetchWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    // 彩云天气要求经度在前，纬度在后
    const response = await fetch(
      `${BASE_URL}/${API_KEY}/${lon},${lat}/weather?alert=true&dailysteps=3&hourlysteps=24`
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

// 使用高德地图API获取城市经纬度
const fetchCityLocation = async (city: string) => {
  try {
    // 使用高德地图API的提供的key
    const amap_key = "488307e472c8e616c0d402f4061bbb89";  // 高德地图Web API key
    const response = await fetch(
      `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(city)}&key=${amap_key}`
    );
    
    if (!response.ok) {
      throw new Error("获取城市位置失败");
    }
    
    const data = await response.json();
    
    if (data.status !== "1" || !data.geocodes || data.geocodes.length === 0) {
      throw new Error("找不到该城市");
    }
    
    const location = data.geocodes[0].location.split(",");
    
    return {
      name: data.geocodes[0].city || data.geocodes[0].district || city,
      lon: parseFloat(location[0]),
      lat: parseFloat(location[1])
    };
  } catch (error) {
    console.error("获取城市位置错误:", error);
    return null;
  }
};

// 通过经纬度获取地点名称
const fetchLocationName = async (lat: number, lon: number) => {
  try {
    // 使用高德地图API的提供的key
    const amap_key = "488307e472c8e616c0d402f4061bbb89";
    const response = await fetch(
      `https://restapi.amap.com/v3/geocode/regeo?location=${lon},${lat}&key=${amap_key}`
    );
    
    if (!response.ok) {
      throw new Error("获取位置信息失败");
    }
    
    const data = await response.json();
    
    if (data.status !== "1" || !data.regeocode) {
      return "未知位置";
    }
    
    // 尝试获取最精确的位置名称
    const addressComponent = data.regeocode.addressComponent;
    return addressComponent.city || addressComponent.district || addressComponent.province || "未知位置";
  } catch (error) {
    console.error("获取位置名称错误:", error);
    return "未知位置";
  }
};

export const searchCities = async (query: string) => {
  try {
    // 使用高德地图API的地点搜索
    const amap_key = "488307e472c8e616c0d402f4061bbb89";
    const response = await fetch(
      `https://restapi.amap.com/v3/assistant/inputtips?keywords=${encodeURIComponent(query)}&key=${amap_key}`
    );
    
    if (!response.ok) {
      throw new Error("城市搜索失败");
    }
    
    const data = await response.json();
    
    if (data.status !== "1" || !data.tips) {
      return [];
    }
    
    // 转换为我们需要的格式
    return data.tips
      .filter((tip: any) => tip.address) // 确保有地址信息
      .map((tip: any) => ({
        name: tip.name,
        country: "中国"
      }));
  } catch (error) {
    console.error("搜索城市错误:", error);
    throw error;
  }
};

