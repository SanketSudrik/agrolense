// ─── Crop Models (matches .NET CropDto.cs) ───

export interface Crop {
  id: number;
  name: string;
  description: string;
  idealSeason: string;
  daysToHarvest: number;
}

export interface CreateCrop {
  name: string;
  description: string;
  idealSeason: string;
  daysToHarvest: number;
}
