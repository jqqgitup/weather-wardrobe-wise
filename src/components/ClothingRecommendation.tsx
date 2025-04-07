
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClothingRecommendation as RecommendationType } from '@/types/weather';

interface ClothingRecommendationProps {
  recommendation: RecommendationType;
}

const ClothingRecommendation: React.FC<ClothingRecommendationProps> = ({ recommendation }) => {
  return (
    <Card className="glass-card overflow-hidden mt-6 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">穿衣建议</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {recommendation.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
              <span className="mr-2">👕</span> 上装
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{recommendation.upperBody}</p>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
              <span className="mr-2">👖</span> 下装
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{recommendation.lowerBody}</p>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
              <span className="mr-2">🧣</span> 配饰
            </h3>
            <ul className="text-gray-600 dark:text-gray-400">
              {recommendation.accessories.map((accessory, index) => (
                <li key={index} className="mb-1">• {accessory}</li>
              ))}
              {recommendation.accessories.length === 0 && <li>今日不需要特殊配件</li>}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClothingRecommendation;
