
// 根据彩云天气的天气代码获取对应的天气描述
export const getWeatherConditionText = (skycon: string): string => {
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
export const getWeatherIcon = (skycon: string): string => {
  // 使用开源的天气图标URL
  // const iconBase = "https://cdn.jsdelivr.net/gh/qwd/WeatherIcon/dist/icons/fill/";
  const iconBase = "/public/";

  
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

// 转换彩云天气API数据为我们的数据结构
export const convertCaiyunToWeatherData = (data: any, location: any) => {
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
        maxtemp_c: Math.round(result.daily.temperature[i].max),
        maxtemp_f: Math.round(result.daily.temperature[i].max * 9/5 + 32),
        mintemp_c: Math.round(result.daily.temperature[i].min),
        mintemp_f: Math.round(result.daily.temperature[i].min * 9/5 + 32),
        condition: {
          text: getWeatherConditionText(result.daily.skycon[i].value),
          icon: getWeatherIcon(result.daily.skycon[i].value),
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
