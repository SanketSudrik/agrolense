// ─── Prediction Models (matches .NET PredictionDtos.cs) ───


export interface FertilizerRecommendation {
  id: number;
  diseaseName: string;
  recommendedFertilizer: string;
  description: string;
  applicationRate: string;
}

export interface PredictionResponse {
  id: number;
  plantName: string;
  predictedDisease: string;
  damagePercentage: number;
  imagePath: string;
  createdAt: string;
  isHealthy: boolean;
  diagnosisSource: string;
  diseaseDescription: string;
  cure: string;
  prevention: string;
  fertilizer: string;
  recommendation: FertilizerRecommendation | null;
}
