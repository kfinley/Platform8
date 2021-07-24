import { required, email } from 'vee-validate/dist/rules';
import { ValidationRule } from 'vee-validate/dist/types/types';

function fieldToSentenceCase(field: string) {
  const titleCase = field.replace(/([A-Z])/g, ' $1')
  return `${titleCase.charAt(0).toUpperCase()}${titleCase.slice(1)}`;
}

function requiredMessage(field: string, params: Record<string, any>) {
  return `${fieldToSentenceCase(field)} is required`;
}

function emailMessage(field: string, params: Record<string, any>) {
  return `${fieldToSentenceCase(field)} is not valid`;
}

export const setupValidation = (extend: (name: string, schema: ValidationRule) => void) => {

  extend('email', {
    ...email,
    message: emailMessage
  });

  extend('required', {
    ...required,
    message: requiredMessage
  });

  extend('positive', {
    message: (field, params) => `${fieldToSentenceCase(field)} is should be a positive number`,
    validate: value => value >= 0 
  });

  extend('gt', {
    message: (field, params) => `${fieldToSentenceCase(field)} should be greater than ${params[0]}`,
    validate: (value, [other]) => {
      return value > other;
    }
  });
  
};
