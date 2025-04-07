
import { AMAP_API } from "./config";

// 使用高德地图API获取城市经纬度
export const fetchCityLocation = async (city: string) => {
  try {
    const response = await fetch(
      `${AMAP_API.GEOCODE_URL}?address=${encodeURIComponent(city)}&key=${AMAP_API.KEY}`
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
export const fetchLocationName = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `${AMAP_API.REGEO_URL}?location=${lon},${lat}&key=${AMAP_API.KEY}`
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

// 搜索城市
export const searchCities = async (query: string) => {
  try {
    const response = await fetch(
      `${AMAP_API.INPUTTIPS_URL}?keywords=${encodeURIComponent(query)}&key=${AMAP_API.KEY}`
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
