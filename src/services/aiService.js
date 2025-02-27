// Import the mock service for development
import { analyzeRetailData as mockAnalyzeRetailData } from './mockAiService';

// Determine if we should use the mock service
const USE_MOCK_SERVICE = process.env.NODE_ENV === 'development';

export async function analyzeRetailData(data) {
  // Use mock service in development
  if (USE_MOCK_SERVICE) {
    return mockAnalyzeRetailData(data);
  }
  
  // Use real API in production
  try {
    const response = await fetch('/api/analyze-mobile-retail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in AI analysis service:', error);
    throw error;
  }
} 