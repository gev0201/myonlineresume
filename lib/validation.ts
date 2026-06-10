// Validation utilities for form inputs

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Armenian phone format: +374 followed by 8 digits
  // Also accepts spaces and dashes
  const phoneRegex = /^\+374\s?\d{2}\s?\d{3}\s?\d{3}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword && password.length >= 8;
};

export const validateName = (name: string): boolean => {
  return name.trim().length > 0;
};

export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateRegistrationForm = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!validateName(data.firstName)) {
    errors.firstName = 'First name is required';
  }

  if (!validateName(data.lastName)) {
    errors.lastName = 'Last name is required';
  }

  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number (e.g., +374 55223344)';
  }

  if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!validatePasswordMatch(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};
