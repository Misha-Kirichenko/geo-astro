export const REGEXES = {
  GLOBAL_REGEXES: {
    IS_DATE_STRING: /^\d{4}-\d{2}-\d{2}$/,
  },
  FORM_DATA_REGEXES: {
    VALID_NAME:
      /^(?:[a-z]+(?: [a-z]+)?|[ა-ჰ]+(?: [ა-ჰ]+)?|[а-яё]+(?: [а-яё]+)?)$/iu,
    BIRTH_DATE: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
    BIRTH_TIME: /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/,
  },
};
