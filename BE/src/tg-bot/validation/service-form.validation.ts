import { REGEXES } from 'src/common/constants';
import { LangEnum, ServiceEnum } from 'src/common/enums';
import { TServiceFormValidation } from '../types';
import { SERVICE_FORM_MESSAGES } from '../constants';

export const SERVICE_FORM_VALIDATION = (
  lang: LangEnum,
): TServiceFormValidation => ({
  [ServiceEnum.natal_chart]: [
    {
      fieldName: 'fullName',
      validator: (name: string): boolean =>
        REGEXES.FORM_DATA_REGEXES.VALID_NAME.test(name),
      errorMessage: SERVICE_FORM_MESSAGES.fullName.error[lang],
      fieldTip: SERVICE_FORM_MESSAGES.fullName.fieldTip[lang],
    },
    {
      fieldName: 'birthDate',
      validator: (birthDate: string): boolean => {
        if (!REGEXES.FORM_DATA_REGEXES.BIRTH_DATE.test(birthDate)) return false;
        const birthDateISO = new Date(birthDate.split('/').reverse().join('-'));
        return birthDateISO.toString() !== 'Invalid Date';
      },
      errorMessage: SERVICE_FORM_MESSAGES.birthDate.error[lang],
      fieldTip: SERVICE_FORM_MESSAGES.birthDate.fieldTip[lang],
    },
    {
      fieldName: 'birthTime',
      validator: (birthTime: string): boolean =>
        REGEXES.FORM_DATA_REGEXES.BIRTH_TIME.test(birthTime),
      errorMessage: SERVICE_FORM_MESSAGES.birthTime.error[lang],
      fieldTip: SERVICE_FORM_MESSAGES.birthTime.fieldTip[lang],
    },
  ],

  [ServiceEnum.synastry]: [
    {
      fieldName: 'fullName',
      validator: (name: string): boolean =>
        REGEXES.FORM_DATA_REGEXES.VALID_NAME.test(name),
      errorMessage: SERVICE_FORM_MESSAGES.firstPartner.fullName.error[lang],
      fieldTip: SERVICE_FORM_MESSAGES.firstPartner.fullName.fieldTip[lang],
    },
    {
      fieldName: 'birthDate',
      validator: (birthDate: string): boolean => {
        if (!REGEXES.FORM_DATA_REGEXES.BIRTH_DATE.test(birthDate)) return false;
        const birthDateISO = new Date(birthDate.split('/').reverse().join('-'));
        return birthDateISO.toString() !== 'Invalid Date';
      },
      errorMessage: SERVICE_FORM_MESSAGES.firstPartner.birthDate.error[lang],
      fieldTip: SERVICE_FORM_MESSAGES.firstPartner.birthDate.fieldTip[lang],
    },
    {
      fieldName: 'birthTime',
      validator: (birthTime: string): boolean =>
        REGEXES.FORM_DATA_REGEXES.BIRTH_TIME.test(birthTime),
      errorMessage: SERVICE_FORM_MESSAGES.firstPartner.birthTime.error[lang],
      fieldTip: SERVICE_FORM_MESSAGES.firstPartner.birthTime.fieldTip[lang],
    },
    {
      fieldName: 'fullName',
      validator: (name: string): boolean =>
        REGEXES.FORM_DATA_REGEXES.VALID_NAME.test(name),
      errorMessage: SERVICE_FORM_MESSAGES.secondPartner.fullName.error[lang],
      fieldTip: SERVICE_FORM_MESSAGES.secondPartner.fullName.fieldTip[lang],
    },
    {
      fieldName: 'birthDate',
      validator: (birthDate: string): boolean => {
        if (!REGEXES.FORM_DATA_REGEXES.BIRTH_DATE.test(birthDate)) return false;
        const birthDateISO = new Date(birthDate.split('/').reverse().join('-'));
        return birthDateISO.toString() !== 'Invalid Date';
      },
      errorMessage: SERVICE_FORM_MESSAGES.secondPartner.birthDate.error[lang],
      fieldTip: SERVICE_FORM_MESSAGES.secondPartner.birthDate.fieldTip[lang],
    },
    {
      fieldName: 'birthTime',
      validator: (birthTime: string): boolean =>
        REGEXES.FORM_DATA_REGEXES.BIRTH_TIME.test(birthTime),
      errorMessage: SERVICE_FORM_MESSAGES.secondPartner.birthTime.error[lang],
      fieldTip: SERVICE_FORM_MESSAGES.secondPartner.birthTime.fieldTip[lang],
    },
  ],
});
