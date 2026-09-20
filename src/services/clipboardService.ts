export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) return false;

  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Clipboard API copy failed, attempting fallback:', err);
    }
  }

  // Fallback for older browsers or non-HTTPS environments
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    // Hide visual layout
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textarea);
    return result;
  } catch (fallbackErr) {
    console.error('Fallback clipboard copy failed:', fallbackErr);
    return false;
  }
};

export default copyToClipboard;
