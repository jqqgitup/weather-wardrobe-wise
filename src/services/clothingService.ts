
import { ClothingRecommendation } from "../types/weather";

export const getClothingRecommendation = (
  temperature: number, 
  condition: string, 
  humidity: number
): ClothingRecommendation => {
  // 根据天气描述进行判断
  const isRaining = condition.includes("雨") || condition.includes("阵雨");
  const isSnowing = condition.includes("雪") || condition.includes("霜");
  const isWindy = condition.includes("风") || condition.includes("大风");
  const isSunny = condition.includes("晴") || condition.includes("阳");
  const isHumid = humidity > 70;
  
  // 默认配饰
  const accessories: string[] = [];

  // 极冷 (低于0°C)
  if (temperature < 0) {
    return {
      upperBody: "厚羽绒服或棉服，保暖内衣，毛衣",
      lowerBody: "保暖棉裤或羽绒裤，保暖内衬",
      accessories: [...accessories, "围巾", "手套", "帽子", "保暖鞋"],
      description: "天气非常寒冷，请穿戴厚重保暖衣物，建议多层穿着。"
    };
  }
  // 寒冷 (0-10°C)
  else if (temperature < 10) {
    const upperBody = isRaining 
      ? "防水外套，毛衣"
      : "羽绒服或厚外套，毛衣";
      
    if (isRaining) accessories.push("雨伞");
    if (isWindy) accessories.push("防风衣物");
      
    return {
      upperBody,
      lowerBody: "长裤，可搭配保暖内衬",
      accessories,
      description: "天气寒冷，需穿着保暖层和外套。"
    };
  }
  // 微凉 (10-15°C)
  else if (temperature < 15) {
    const upperBody = isRaining 
      ? "防水外套，长袖衫"
      : "夹克或风衣，长袖衫";
      
    if (isRaining) accessories.push("雨伞");
    if (isSunny) accessories.push("太阳镜");
      
    return {
      upperBody,
      lowerBody: "长裤",
      accessories,
      description: "天气微凉，适合穿着薄外套。"
    };
  }
  // 温和 (15-20°C)
  else if (temperature < 20) {
    const upperBody = isRaining 
      ? "轻便防水外套，长袖或短袖"
      : "长袖衬衫或轻薄外套";
      
    if (isRaining) accessories.push("雨伞");
    if (isSunny) accessories.push("太阳镜");
      
    return {
      upperBody,
      lowerBody: "长裤或半裙",
      accessories,
      description: "天气温和，适合穿着长袖衣物。"
    };
  }
  // 温暖 (20-25°C)
  else if (temperature < 25) {
    const upperBody = isRaining 
      ? "轻薄防水外套，短袖"
      : "短袖T恤";
      
    if (isRaining) accessories.push("雨伞");
    if (isSunny) accessories.push("太阳镜", "防晒霜");
      
    return {
      upperBody,
      lowerBody: "轻便长裤、半裙或短裤",
      accessories,
      description: "天气温暖，适合穿着轻便衣物。"
    };
  }
  // 炎热 (25-30°C)
  else if (temperature < 30) {
    const upperBody = "短袖T恤或背心";
    
    if (isRaining) accessories.push("雨伞");
    if (isSunny) accessories.push("太阳镜", "防晒霜", "遮阳帽");
      
    return {
      upperBody,
      lowerBody: "短裤或轻便裙子",
      accessories,
      description: isHumid 
        ? "天气炎热且潮湿，请穿着轻便透气的衣物。" 
        : "天气炎热，请穿着轻便的衣物。"
    };
  }
  // 酷热 (30°C以上)
  else {
    const upperBody = "轻薄透气的短袖或背心";
    
    if (isRaining) accessories.push("雨伞");
    if (isSunny) accessories.push("太阳镜", "防晒霜", "遮阳帽");
      
    return {
      upperBody,
      lowerBody: "轻便透气的短裤或裙子",
      accessories,
      description: isHumid 
        ? "天气酷热且潮湿，请穿着最轻便透气的衣物，注意防晒补水。" 
        : "天气酷热，请穿着最轻便的衣物，注意防晒补水。"
    };
  }
};

export const getWeatherBackground = (condition: string): string => {
  // 根据中文天气描述设置背景
  if (condition.includes("雨")) {
    return "bg-gradient-to-b from-slate-500 to-slate-700"; // 雨天背景
  } else if (condition.includes("云") || condition.includes("阴")) {
    return "bg-gradient-to-b from-gray-400 to-gray-600"; // 多云/阴天背景
  } else if (condition.includes("晴")) {
    return "bg-gradient-to-b from-sky-400 to-blue-600"; // 晴天背景
  } else if (condition.includes("雪")) {
    return "bg-gradient-to-b from-blue-100 to-blue-300"; // 雪天背景
  } else if (condition.includes("雾") || condition.includes("霾")) {
    return "bg-gradient-to-b from-gray-300 to-gray-500"; // 雾/霾背景
  } else {
    return "bg-gradient-to-b from-sky-400 to-blue-600"; // 默认背景
  }
};
