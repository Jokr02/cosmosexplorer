import starData from '../data/stars.json';

export interface SystemData {
  id: string;
  name: string;
  spectralClass: string;
  mass: number;
  radius: number;
  temperature: number;
  distance: number;
  coordinates: { x: number; y: number; z: number };
  planets: number;
  description: string;
}

export const analyzeObject = async (objectData: SystemData): Promise<string> => {
  // Placeholder for Gemini API call
  // In a real implementation, this would send a prompt to the API
  console.log('Analyzing object:', objectData.name);
  return `Analysis of ${objectData.name}: ${objectData.description}. Spectral Class: ${objectData.spectralClass}.`;
};

export const getStars = (): SystemData[] => {
  return starData;
};
