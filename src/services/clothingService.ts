
import { ClothingRecommendation } from "../types/weather";

export const getClothingRecommendation = (
  temperature: number, 
  condition: string, 
  humidity: number
): ClothingRecommendation => {
  // Convert condition to lowercase for easier comparison
  const lowerCondition = condition.toLowerCase();
  const isRaining = lowerCondition.includes("rain") || lowerCondition.includes("drizzle");
  const isSnowing = lowerCondition.includes("snow") || lowerCondition.includes("sleet");
  const isWindy = lowerCondition.includes("wind");
  const isSunny = lowerCondition.includes("sun") || lowerCondition.includes("clear");
  const isHumid = humidity > 70;
  
  // Default accessories
  const accessories: string[] = [];

  // Very cold (below 0°C/32°F)
  if (temperature < 0) {
    return {
      upperBody: "厚外套或羽绒服，保暖内衣，毛衣",
      lowerBody: "厚裤子，保暖内衣或羊毛裤",
      accessories: [...accessories, "围巾", "手套", "帽子", "保暖鞋"],
      description: "天气非常寒冷，请穿着厚重的保暖衣物和多层服装。"
    };
  }
  // Cold (0-10°C/32-50°F)
  else if (temperature < 10) {
    const upperBody = isRaining 
      ? "防水外套，毛衣"
      : "中厚外套，毛衣";
      
    if (isRaining) accessories.push("雨伞");
    if (isWindy) accessories.push("风衣");
      
    return {
      upperBody,
      lowerBody: "长裤，可能需要保暖内衣",
      accessories,
      description: "天气寒冷，请穿着保暖层和外套。"
    };
  }
  // Cool (10-15°C/50-59°F)
  else if (temperature < 15) {
    const upperBody = isRaining 
      ? "防水外套，长袖衫"
      : "轻便外套，长袖衫";
      
    if (isRaining) accessories.push("雨伞");
    if (isSunny) accessories.push("太阳镜");
      
    return {
      upperBody,
      lowerBody: "长裤",
      accessories,
      description: "天气凉爽，适合穿着轻便外套。"
    };
  }
  // Mild (15-20°C/59-68°F)
  else if (temperature < 20) {
    const upperBody = isRaining 
      ? "轻便防水外套，长袖衫或短袖"
      : "长袖衫或轻便外套";
      
    if (isRaining) accessories.push("雨伞");
    if (isSunny) accessories.push("太阳镜");
      
    return {
      upperBody,
      lowerBody: "长裤或厚裙子",
      accessories,
      description: "温和的天气，适合轻便的长袖衣物。"
    };
  }
  // Warm (20-25°C/68-77°F)
  else if (temperature < 25) {
    const upperBody = isRaining 
      ? "轻便防水外套，短袖"
      : "短袖";
      
    if (isRaining) accessories.push("雨伞");
    if (isSunny) accessories.push("太阳镜", "防晒霜");
      
    return {
      upperBody,
      lowerBody: "轻便长裤、裙子或短裤",
      accessories,
      description: "温暖的天气，适合穿着轻便衣物。"
    };
  }
  // Hot (25-30°C/77-86°F)
  else if (temperature < 30) {
    const upperBody = "短袖或无袖上衣";
    
    if (isRaining) accessories.push("雨伞");
    if (isSunny) accessories.push("太阳镜", "防晒霜", "帽子");
      
    return {
      upperBody,
      lowerBody: "短裤或裙子",
      accessories,
      description: isHumid 
        ? "天气炎热且潮湿，请穿着轻便透气的衣物。" 
        : "天气炎热，请穿着轻便的衣物。"
    };
  }
  // Very hot (above 30°C/86°F)
  else {
    const upperBody = "轻便、透气的短袖或无袖上衣";
    
    if (isRaining) accessories.push("雨伞");
    if (isSunny) accessories.push("太阳镜", "防晒霜", "帽子");
      
    return {
      upperBody,
      lowerBody: "轻便、透气的短裤或裙子",
      accessories,
      description: isHumid 
        ? "天气非常炎热且潮湿，请穿着最轻便透气的衣物，并注意补水。" 
        : "天气非常炎热，请穿着最轻便的衣物，并注意补水。"
    };
  }
};

export const getWeatherBackground = (condition: string): string => {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
    return "bg-weather-rainy";
  } else if (lowerCondition.includes("cloud") || lowerCondition.includes("overcast")) {
    return "bg-weather-cloudy";
  } else if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
    return "bg-weather-clear";
  } else {
    return "bg-weather-clear"; // Default
  }
};
