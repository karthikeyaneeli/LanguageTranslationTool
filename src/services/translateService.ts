import { API_URLS } from '../utils/constants';

interface TranslateParams {
  q: string;
  source: string;
  target: string;
  format: string;
}

export interface TranslationResult {
  translatedText: string;
  detectedLanguageCode?: string;
}

export const translateText = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<TranslationResult> => {
  const params: TranslateParams = {
    q: text,
    source: sourceLanguage === 'auto' ? 'auto' : sourceLanguage,
    target: targetLanguage,
    format: 'text',
  };

  const endpoints = [API_URLS.TRANSLATE, ...API_URLS.FALLBACKS];
  let lastError: Error | null = null;

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          // Rate limited or API key required
          throw new Error('API limit reached');
        }
        if (response.status >= 500) {
          throw new Error('Server temporarily unavailable.');
        }
        throw new Error('Translation failed.');
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Unexpected response received.');
      }

      // If response has translatedText
      if (typeof data.translatedText === 'string') {
        let detectedLanguageCode: string | undefined;

        // Try to get detected language if using auto
        if (sourceLanguage === 'auto' && data.detectedLanguage) {
          if (typeof data.detectedLanguage === 'string') {
            detectedLanguageCode = data.detectedLanguage;
          } else if (typeof data.detectedLanguage === 'object' && typeof data.detectedLanguage.language === 'string') {
            detectedLanguageCode = data.detectedLanguage.language;
          }
        }

        return {
          translatedText: data.translatedText,
          detectedLanguageCode,
        };
      }

      throw new Error('Unexpected response received.');
    } catch (error: any) {
      console.warn(`Translation attempt failed for endpoint ${url}:`, error.message);
      lastError = error;
      // Continue to next fallback if it's a network error or server error
      if (error.message === 'API limit reached' || error.message.includes('Fetch') || error.message.includes('network')) {
        continue;
      }
    }
  }

  // If all attempts failed, try Google Translate GTX API as ultimate fallback (free & CORS-friendly)
  try {
    const sl = sourceLanguage === 'auto' ? 'auto' : sourceLanguage;
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(googleUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data[0] && data[0][0] && typeof data[0][0][0] === 'string') {
        let detectedLanguageCode: string | undefined;
        if (sourceLanguage === 'auto' && typeof data[2] === 'string') {
          detectedLanguageCode = data[2];
        }
        return {
          translatedText: data[0][0][0],
          detectedLanguageCode,
        };
      }
    }
  } catch (googleError) {
    console.warn('Google Translate fallback also failed:', googleError);
  }

  // If all attempts failed
  if (lastError) {
    if (lastError.message === 'API limit reached') {
      throw new Error('Translation failed. API limit reached or key required.');
    }
    if (lastError.message.includes('Failed to fetch') || lastError.message.includes('NetworkError')) {
      throw new Error('Network error occurred.');
    }
    throw lastError;
  }

  throw new Error('Translation failed.');
};
