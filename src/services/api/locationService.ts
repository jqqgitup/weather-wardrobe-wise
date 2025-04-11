
import { AMAP_API } from "./config";

// 使用高德地图API获取城市经纬度
export const fetchCityLocation = async (city: string) => {
  try {
    console.log(`正在请求高德地图API获取城市${city}的位置...`);
    const response = await fetch(
      `${AMAP_API.GEOCODE_URL}?address=${encodeURIComponent(city)}&key=${AMAP_API.KEY}`
    );
    
    if (!response.ok) {
      throw new Error("获取城市位置失败");
    }
    
    const data = await response.json();
    console.log("高德地图API返回结果:", data);
    
    if (data.status !== "1" || !data.geocodes || data.geocodes.length === 0) {
      console.log("找不到该城市的信息");
      // 模拟一些常见城市的坐标
      const mockLocations: Record<string, {lon: number, lat: number}> = {
        "shanghai": {lon: 121.4737, lat: 31.2304},
        "beijing": {lon: 116.4074, lat: 39.9042},
        "guangzhou": {lon: 113.2644, lat: 23.1291},
        "shenzhen": {lon: 114.0579, lat: 22.5431},
        "hangzhou": {lon: 120.1551, lat: 30.2741}
      };
      
      const cityLower = city.toLowerCase();
      if (mockLocations[cityLower]) {
        console.log(`使用${city}的模拟位置数据`);
        return {
          name: city,
          ...mockLocations[cityLower]
        };
      }else{
        return {
          name: '上海徐汇',
          lon: parseFloat('121.409702'),
          lat: parseFloat('31.173743')
        };
      }
      
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
    console.log(`正在请求高德地图API获取经纬度(${lat},${lon})的位置名称...`);
    const response = await fetch(
      `${AMAP_API.REGEO_URL}?location=${lon},${lat}&key=${AMAP_API.KEY}`
    );
    
    if (!response.ok) {
      throw new Error("获取位置信息失败");
    }
    
    const data = await response.json();
    console.log("高德地图API反向地理编码结果:", data);
    
    if (data.status !== "1" || !data.regeocode) {
      // 根据经纬度范围判断大致位置
      let estimatedLocation = "未知位置";
      
      // 简易中国主要城市经纬度判断
      if (lat > 30.5 && lat < 32 && lon > 120.5 && lon < 122) {
        estimatedLocation = "上海";
      } else if (lat > 39.5 && lat < 40.5 && lon > 115.5 && lon < 117) {
        estimatedLocation = "北京";
      } else if (lat > 22.5 && lat < 24 && lon > 112.5 && lon < 114) {
        estimatedLocation = "广州";
      } else{
        estimatedLocation = "上海";
      }
      
      console.log(`使用估计位置: ${estimatedLocation}`);
      return estimatedLocation;
    }
    
    // 尝试获取最精确的位置名称
    const addressComponent = data.regeocode.addressComponent;
    if(Array.isArray(addressComponent.city) && addressComponent.city.length === 0){
      return addressComponent.district || addressComponent.province || "未知位置";
    }
    return addressComponent.city || addressComponent.district || addressComponent.province || "未知位置";
  } catch (error) {
    console.error("获取位置名称错误:", error);
    return "未知位置";
  }
};

// 搜索城市
export const searchCities = async (query: string) => {
  try {
    console.log(`正在搜索城市: ${query}`);
    const response = await fetch(
      `${AMAP_API.INPUTTIPS_URL}?keywords=${encodeURIComponent(query)}&key=${AMAP_API.KEY}`
    );
    
    if (!response.ok) {
      throw new Error("城市搜索失败");
    }
    
    const data = await response.json();
    console.log("城市搜索结果:", data);
    
    if (data.status !== "1" || !data.tips) {
      // 提供一些模拟数据作为备选
      if (query.toLowerCase().includes("bei")) {
        return [{name: "北京", country: "中国"}];
      } else if (query.toLowerCase().includes("shang")) {
        return [{name: "上海", country: "中国"}];
      } else if (query.toLowerCase().includes("guang")) {
        return [{name: "广州", country: "中国"}];
      } else {
        return [{name: "上海", country: "中国"}];
      }
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
    
    // 提供一些基本城市作为后备
    return [
      {name: "北京", country: "中国"},
      {name: "上海", country: "中国"},
      {name: "广州", country: "中国"}
    ];
  }
};
