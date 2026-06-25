// ─── Fertilizer Models (matches .NET FertilizerRecommendationDtos.cs) ───

export interface FertilizerRecommendation {
  id: number;
  diseaseName: string;
  recommendedFertilizer: string;
  description: string;
  applicationRate: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateFertilizerRecommendation {
  diseaseName: string;
  recommendedFertilizer: string;
  description: string;
  applicationRate: string;
}

export interface UpdateFertilizerRecommendation {
  diseaseName: string;
  recommendedFertilizer: string;
  description: string;
  applicationRate: string;
}
