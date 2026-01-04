import { LangEnum, ServiceEnum } from '../enums';

export const SERVICES: Record<
  LangEnum,
  { name: string; description: string; slug: ServiceEnum; price: number }[]
> = {
  [LangEnum.EN]: [
    {
      name: '🪐 Natal Chart',
      slug: ServiceEnum.natal_chart,
      description:
        'A detailed map of your birth chart, showing planetary positions at birth.',
      price: 50,
    },
    {
      name: '👩‍❤️‍👨 Synastry',
      slug: ServiceEnum.synastry,
      description:
        'Compare your birth chart with a partner to explore compatibility.',
      price: 70,
    },
    {
      name: '🃏 Tarot cart (for 1 month)',
      slug: ServiceEnum.tarot_1mo,
      description: 'Get monthly guidance through a personalized Tarot reading.',
      price: 100,
    },
    {
      name: '🃏 Tarot cart (for 1 week)',
      slug: ServiceEnum.tarot_1w,
      description: 'Receive weekly Tarot insights and guidance for your week.',
      price: 30,
    },
  ],
  [LangEnum.GE]: [
    {
      name: '🪐 ნატალური რუკა',
      slug: ServiceEnum.natal_chart,
      description:
        'დეტალური რუკა თქვენი დაბადების წამიდან პლანეტების მდებარეობით.',
      price: 50,
    },
    {
      name: '👩‍❤️‍👨 სინასტრია',
      slug: ServiceEnum.synastry,
      description:
        'შეადარეთ თქვენი დაბადების რუკა პარტნიორთან, რათა გაიგოთ შესაბამისობა.',
      price: 70,
    },
    {
      name: '🃏 ტაროს კარტი (1 თვის)',
      slug: ServiceEnum.tarot_1mo,
      description: 'მიღეთ 1 თვის პერსონალური ტაროს რუკის რჩევები.',
      price: 100,
    },
    {
      name: '🃏 ტაროს კარტი (1 კვირის)',
      slug: ServiceEnum.tarot_1w,
      description: 'მიღეთ 1 კვირის რჩევები ტაროს კარტებისგან.',
      price: 30,
    },
  ],
  [LangEnum.RU]: [
    {
      name: '🪐 Натальная карта',
      slug: ServiceEnum.natal_chart,
      description:
        'Подробная карта рождения с расположением планет на момент рождения.',
      price: 50,
    },
    {
      name: '👩‍❤️‍👨 Синастрия',
      slug: ServiceEnum.synastry,
      description:
        'Сравните свои натальные карты с партнером для изучения совместимости.',
      price: 70,
    },
    {
      name: '🃏 Карты таро (на 1 месяц)',
      slug: ServiceEnum.tarot_1mo,
      description: 'Получите персональные советы на месяц с помощью Таро.',
      price: 100,
    },
    {
      name: '🃏 Карты таро (на 1 неделю)',
      slug: ServiceEnum.tarot_1w,
      description: 'Рекомендации и предсказания на неделю с помощью Таро.',
      price: 30,
    },
  ],
};
