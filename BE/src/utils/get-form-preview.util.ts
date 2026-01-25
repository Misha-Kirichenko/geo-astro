import { LangEnum, ServiceEnum } from 'src/common/enums';
import { TFullFormData, TPartialForms } from 'src/tg-bot/types';

export const getFormPreviewUtil = (
  type: ServiceEnum,
  formData: TFullFormData | TPartialForms,
  lang: LangEnum,
): string => {
  const vocabulary: Record<LangEnum, Record<string, string>> = {
    [LangEnum.EN]: {
      fullName: '👤 Full name',
      birthDate: '🎂 Birth date',
      birthTime: '⏰ Your birth Time',
      partner1: '🅰️ First partner',
      partner2: '🅱️ Second partner',
    },
    [LangEnum.GE]: {
      fullName: '👤 სახელი',
      birthDate: '🎂 დაბადების თარიღი',
      birthTime: '⏰ დაბადების დრო',
      partner1: '🅰 პირველი პარტნიორი',
      partner2: '🅱 მეორე პარტნიორი',
    },
    [LangEnum.RU]: {
      fullName: '👤 Имя',
      birthDate: '🎂 Дата рождения',
      birthTime: '⏰ Время рождения',
      partner1: '🅰 Первый партнёр',
      partner2: '🅱 Второй партнёр',
    },
  };

  const getFormDataFieldsStringFromEntries = (
    entries: Array<[string, string]>,
  ): string => {
    const formDataFields = entries.map(([fieldName, fieldValue]) => {
      const label = vocabulary[lang]?.[fieldName] ?? fieldName;
      const value = fieldValue == null ? '—' : String(fieldValue);
      return `${label}: ${value}`;
    });

    return formDataFields.join('\n\n');
  };

  let formDataFinalString = '';

  const formDataHeading: Record<LangEnum, string> = {
    [LangEnum.EN]: '📋 Your form',
    [LangEnum.RU]: '📋 Ваша анкета',
    [LangEnum.GE]: '📋 თქვენი ანკეტა',
  };

  formDataFinalString += formDataHeading[lang] + '\n\n\n\n';

  if (type === ServiceEnum.synastry) {
    formDataFinalString += vocabulary[lang].partner1 + '\n';

    const firstFormEntries = Object.entries(formData.form1) as Array<
      [string, string]
    >;
    const firstFormString =
      getFormDataFieldsStringFromEntries(firstFormEntries);
    formDataFinalString += '\n' + firstFormString;

    const secondPartnerFormFilled = Boolean(Object.keys(formData.form2).length);

    if (secondPartnerFormFilled) {
      formDataFinalString += '\n\n' + vocabulary[lang].partner2 + '\n';

      const secondFormEntries = Object.entries(formData.form2) as Array<
        [string, string]
      >;

      const secondFormString =
        getFormDataFieldsStringFromEntries(secondFormEntries);

      formDataFinalString += '\n' + secondFormString;
    }
  } else {
    const formDataFieldsEntries = Object.entries(formData.form1) as Array<
      [string, string]
    >;

    const formDataFields = getFormDataFieldsStringFromEntries(
      formDataFieldsEntries,
    );

    formDataFinalString += formDataFields;
  }

  return formDataFinalString;
};
