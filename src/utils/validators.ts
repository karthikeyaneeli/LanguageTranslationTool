import { MAX_CHARACTER_LIMIT } from './constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateText = (text: string): ValidationResult => {
  const trimmed = text.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter text.' };
  }
  if (trimmed.length > MAX_CHARACTER_LIMIT) {
    return { isValid: false, error: `Character limit exceeded (maximum ${MAX_CHARACTER_LIMIT} characters).` };
  }
  return { isValid: true };
};
