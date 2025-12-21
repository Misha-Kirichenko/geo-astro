import { REGEXES } from 'src/common/constants';
import { ServiceEnum } from 'src/common/enums';
import { TServiceFormValidation } from '../types';

export const SERVICE_FORM_VALIDATION: TServiceFormValidation = {
  [ServiceEnum.natal_chart]: [
    {
      fieldName: 'fullName',
      validator: (name: string): boolean => REGEXES.VALID_NAME.test(name),
      errorMessage: 'Invalid full name',
      fieldTip: 'Enter your full name',
    },
    {
      fieldName: 'birthDate',
      validator: (birthDate: string): boolean => {
        if (!REGEXES.BIRTH_DATE.test(birthDate)) return false;
        const birthDateISO = new Date(birthDate.split('/').reverse().join('-'));
        return birthDateISO.toString() !== 'Invalid Date';
      },
      errorMessage: 'Invalid birth date',
      fieldTip: 'Enter your birth date',
    },
    {
      fieldName: 'birthTime',
      validator: (birthTime: string): boolean =>
        REGEXES.BIRTH_TIME.test(birthTime),
      errorMessage: 'Invalid birth time',
      fieldTip: 'Enter your birth time',
    },
  ],
  [ServiceEnum.synastry]: [
    {
      fieldName: 'fullName',
      validator: (name: string): boolean => REGEXES.VALID_NAME.test(name),
      errorMessage: 'Invalid full name',
      fieldTip: 'Enter first potential partner name',
    },
    {
      fieldName: 'birthDate',
      validator: (birthDate: string): boolean => {
        if (!REGEXES.BIRTH_DATE.test(birthDate)) return false;
        const birthDateISO = new Date(birthDate.split('/').reverse().join('-'));
        return birthDateISO.toString() !== 'Invalid Date';
      },
      errorMessage: 'Invalid birth date',
      fieldTip: 'Enter first potential partner birth date',
    },
    {
      fieldName: 'birthTime',
      validator: (birthTime: string): boolean =>
        REGEXES.BIRTH_TIME.test(birthTime),
      errorMessage: 'Invalid first potential partner birth time',
      fieldTip: 'Enter first potential partner birth time',
    },
    {
      fieldName: 'fullName',
      validator: (name: string): boolean => REGEXES.VALID_NAME.test(name),
      errorMessage: 'Invalid full name',
      fieldTip: 'Enter second potential partner name',
    },
    {
      fieldName: 'birthDate',
      validator: (birthDate: string): boolean => {
        if (!REGEXES.BIRTH_DATE.test(birthDate)) return false;
        const birthDateISO = new Date(birthDate.split('/').reverse().join('-'));
        return birthDateISO.toString() !== 'Invalid Date';
      },
      errorMessage: 'Invalid birth date',
      fieldTip: 'Enter second potential partner birth date',
    },
    {
      fieldName: 'birthTime',
      validator: (birthTime: string): boolean =>
        REGEXES.BIRTH_TIME.test(birthTime),
      errorMessage: 'Invalid second potential partner birth time',
      fieldTip: 'Enter second potential partner birth time',
    },
  ],
};
