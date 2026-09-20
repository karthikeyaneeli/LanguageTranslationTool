export const downloadTranslation = (
  inputText: string,
  translatedText: string,
  sourceLanguageName: string,
  targetLanguageName: string
): void => {
  if (typeof window === 'undefined') return;

  const content = `Original Text (${sourceLanguageName}):\n${inputText}\n\nTranslated Text (${targetLanguageName}):\n${translatedText}`;

  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'translation.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download translation file:', error);
    throw new Error('Unable to download translation.');
  }
};

export default downloadTranslation;
