export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email обязателен' };
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return { isValid: false, error: 'Некорректный формат email' };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!password) {
    errors.push('Пароль обязателен');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Минимальная длина пароля 8 символов');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну строчную букву');
  }

  if (!/\d/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну цифру');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы один специальный символ (!@#$%^&*)');
  }

  return { isValid: errors.length === 0, errors };
};


export const validatePhoneNumber = (phone: string): boolean => {
  const regex = /^\+375 \((17|29|33|44|25)\) \d{3}-\d{2}-\d{2}$/;
  return regex.test(phone);
};

export const validatePostalCode = (code: string): boolean => {
  const regex = /^\d{6}$/;
  return regex.test(code);
};

export const validateFullName = (name: string): boolean => {
  const regex = /^[А-ЯЁа-яё\s-]{2,50}$/;
  return regex.test(name);
};