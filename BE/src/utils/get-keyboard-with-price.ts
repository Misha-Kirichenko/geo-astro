import { LangEnum } from 'src/common/enums';
import { IServiceItem } from 'src/common/interfaces';
import { BUY, CACHED_PROMO_APPLIED } from 'src/tg-bot/constants';
import { ServicesEventEnum } from 'src/tg-bot/enums';
import { Context } from 'telegraf';

export const getKeyBoardWithPrice = async (
  ctx: Context,
  service: IServiceItem,
  discountPercent?: number,
) => {
  const chosenLang = ctx.session.lang || LangEnum.EN;

  let priceString = `${service.price}ლ`;

  if (discountPercent) {
    const priceWithPromo =
      service.price - (service.price * discountPercent) / 100;
    priceString = `${BUY[chosenLang]}: ❌ ${service.price}ლ / ✅ ${priceWithPromo}ლ `;
    await ctx.reply(CACHED_PROMO_APPLIED[chosenLang]);
  }

  await ctx.reply(
    `<b>${service.name}</b>\n\n<i>${service.description}</i>\n\n`,
    {
      parse_mode: 'HTML' as const,
      reply_markup: {
        inline_keyboard: discountPercent
          ? [
              [
                {
                  text: priceString,
                  callback_data: `${ServicesEventEnum.service_form}:${service.slug}:0`,
                },
              ],
              [
                {
                  text: '⬅️',
                  callback_data: ServicesEventEnum.service_menu,
                },
              ],
            ]
          : [
              [
                {
                  text: priceString,
                  callback_data: `${ServicesEventEnum.service_form}:${service.slug}:0`,
                },
                {
                  text: '⬅️',
                  callback_data: ServicesEventEnum.service_menu,
                },
              ],
            ],
      },
    },
  );
};
