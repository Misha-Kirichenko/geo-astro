import { IServiceKeyboard } from 'src/tg-bot/interface';
import { SERVICE_NAMES } from '../common/constants/service-names.constants';
import { LangEnum } from 'src/common/enums';

// export const getServicesKeyboard = (lang: LangEnum) => {
//   const serviceList = SERVICE_NAMES[lang];
//   console.log('list', serviceList);
//   return serviceList.map((service) => [
//     {
//       text: service.name,
//       callback_data: `sd:aa`,
//     },
//   ]);
// };

export const getServicesKeyboard = (lang: LangEnum) => {
  const serviceList = SERVICE_NAMES[lang as keyof typeof SERVICE_NAMES];
  const serviceKeyboardButtons: IServiceKeyboard[][] = [];
  let row: IServiceKeyboard[] = [];
  for (let i = 0; i < serviceList.length; i++) {
    const serviceObj = {
      text: serviceList[i].name,
      callback_data: `service:${i}`,
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
