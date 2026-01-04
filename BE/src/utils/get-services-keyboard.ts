import { IServiceKeyboard } from 'src/tg-bot/interfaces';
import { SERVICES } from '../common/constants/services.constants';
import { LangEnum } from 'src/common/enums';
import { ServicesEventEnum } from 'src/tg-bot/enums';

export const getServicesKeyboard = (lang: LangEnum) => {
  const serviceList = SERVICES[lang];
  const serviceKeyboardButtons: IServiceKeyboard[][] = [];
  let row: IServiceKeyboard[] = [];
  for (let i = 0; i < serviceList.length; i++) {
    const serviceObj = {
      text: serviceList[i].name,
      callback_data: `${ServicesEventEnum.service_select}:${serviceList[i].slug}`,
    };
    row.push(serviceObj);

    if (row.length == 2) {
      serviceKeyboardButtons.push(row);
      row = [];
    }
  }
  //remaining buttons
  if (row.length) serviceKeyboardButtons.push(row);

  return serviceKeyboardButtons;
};
