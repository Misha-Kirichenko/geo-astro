import { LangEnum } from 'src/common/enums';
import {
  BACK,
  CACHED_PROMO_APPLIED,
  CONTINUE_FORM_FILL,
  DESCRIPTION,
  FILL_FORM_MENU_TIP,
  FILL_FORM_FROM_SCRATCH,
  SERVICE_PRICES,
} from 'src/tg-bot/constants';
import { ServicesEventEnum } from 'src/tg-bot/enums';
import { IKeyboardWithPriceParams } from 'src/tg-bot/interfaces';

export const getKeyBoardWithPrice = async (
  keyBoardWithPriceParamsObj: IKeyboardWithPriceParams,
) => {
  const { ctx, service, discountPercent, formDataStage } =
    keyBoardWithPriceParamsObj;
  const chosenLang = ctx.session.lang || LangEnum.EN;

  let priceString = `${service.price}ლ`;

  if (discountPercent) {
    const priceWithPromo =
      service.price - (service.price * discountPercent) / 100;
    priceString = `❌ ${service.price}ლ / ✅ ${priceWithPromo}ლ `;
    await ctx.reply(CACHED_PROMO_APPLIED[chosenLang]);
  }

  const keyBoard =
    formDataStage === undefined || formDataStage === 0
      ? [
          [
            {
              text: FILL_FORM_MENU_TIP[chosenLang],
              callback_data: `${ServicesEventEnum.service_form}:${service.slug}:0`,
            },
          ],
          [
            {
              text: BACK[chosenLang],
              callback_data: ServicesEventEnum.service_menu,
            },
          ],
        ]
      : [
          [
            {
              text: FILL_FORM_FROM_SCRATCH[chosenLang],
              callback_data: `${ServicesEventEnum.service_form}:${service.slug}:0`,
            },
          ],
          [
            {
              text: CONTINUE_FORM_FILL[chosenLang],
              callback_data: `${ServicesEventEnum.service_form_fill_continue}:${service.slug}:${formDataStage}`,
            },
          ],
          [
            {
              text: BACK[chosenLang],
              callback_data: ServicesEventEnum.service_menu,
            },
          ],
        ];

  await ctx.reply(
    `<b>${service.name}</b>\n\n<b>${SERVICE_PRICES[chosenLang]}:</b> ${priceString}\n\n<b>${DESCRIPTION[chosenLang]}</b>\n\n<i>${service.description}</i>\n\n`,
    {
      parse_mode: 'HTML' as const,
      reply_markup: {
        inline_keyboard: keyBoard,
      },
    },
  );
};
