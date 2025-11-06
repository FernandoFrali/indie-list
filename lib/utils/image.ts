export const createImageUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const revokeImageUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: "Tipo de arquivo não suportado. Use JPEG, PNG ou WebP." };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: "Arquivo muito grande. Máximo 5MB." };
  }

  return { isValid: true };
};
