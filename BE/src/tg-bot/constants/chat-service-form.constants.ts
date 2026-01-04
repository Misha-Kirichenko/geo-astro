import { LangEnum } from 'src/common/enums';

export const FILL_FORM = {
  [LangEnum.EN]:
    'Please fill in the fields according to the instructions below ✏️⬇️ ',
  [LangEnum.RU]: 'Пожалуйста заполните поля по инструкции ниже ✏️⬇️ ',
  [LangEnum.GE]:
    'გთხოვთ შეავსოთ ველები ქვემოთაღნიშნული ინსტრუქციის მიხედვით ✏️⬇️ ',
};

export const SERVICE_FORM_MESSAGES = {
  fullName: {
    error: {
      [LangEnum.EN]: `You have entered the name incorrectly 😢.\nPlease enter it again 🔄`,
      [LangEnum.RU]: `Вы неправильно ввели имя 😢.\nПожалуйста, введите его заново 🔄`,
      [LangEnum.GE]: `თქვენ არასწორედ შეიყვანეთ სახელი 😢.\nგთხოვთ შეიყვანოთ ხელახლა 🔄`,
    },
    fieldTip: {
      [LangEnum.EN]: `📝 Please, enter the full name (letters and spaces only)`,
      [LangEnum.RU]: `📝 Пожалуйста, введите имя (только буквы и пробелы)`,
      [LangEnum.GE]: `📝 გთხოვთ შეიყვანოთ სახელი (მხოლოდ ასოები და გამოტოვება)`,
    },
  },

  birthDate: {
    error: {
      [LangEnum.EN]: `The birth date was entered incorrectly 😢.\nPlease enter it again 🔄`,
      [LangEnum.RU]: `Дата рождения введена неправильно 😢.\nПожалуйста, введите её заново 🔄`,
      [LangEnum.GE]: `დაბადების თარიღი არასწორადაა შეყვანილი 😢.\nგთხოვთ შეიყვანოთ ხელახლა 🔄`,
    },
    fieldTip: {
      [LangEnum.EN]: `📅 Please, enter your birth date (DD/MM/YYYY)`,
      [LangEnum.RU]: `📅 Пожалуйста, введите дату рождения (ДД/ММ/ГГГГ)`,
      [LangEnum.GE]: `📅 გთხოვთ შეიყვანოთ დაბადების თარიღი (DD/MM/YYYY)`,
    },
  },

  birthTime: {
    error: {
      [LangEnum.EN]: `The birth time was entered incorrectly 😢.\nPlease enter it again 🔄`,
      [LangEnum.RU]: `Время рождения введено неправильно 😢.\nПожалуйста, введите его заново 🔄`,
      [LangEnum.GE]: `დაბადების დრო არასწორადაა შეყვანილი 😢.\nგთხოვთ შეიყვანოთ ხელახლა 🔄`,
    },
    fieldTip: {
      [LangEnum.EN]: `⏰ Please, enter your birth time (HH:MM)`,
      [LangEnum.RU]: `⏰ Пожалуйста, введите время рождения (ЧЧ:ММ)`,
      [LangEnum.GE]: `⏰ გთხოვთ შეიყვანოთ დაბადების დრო (HH:MM)`,
    },
  },

  firstPartner: {
    fullName: {
      error: {
        [LangEnum.EN]: `The first partner’s name was entered incorrectly 😢.\nPlease enter it again 🔄`,
        [LangEnum.RU]: `Имя первого партнёра введено неправильно 😢.\nПожалуйста, введите его заново 🔄`,
        [LangEnum.GE]: `პირველი პარტნიორის სახელი არასწორადაა შეყვანილი 😢.\nგთხოვთ შეიყვანოთ ხელახლა 🔄`,
      },
      fieldTip: {
        [LangEnum.EN]: `📝 Enter the first partner’s full name (letters and spaces only)`,
        [LangEnum.RU]: `📝 Введите имя первого партнёра (только буквы и пробелы)`,
        [LangEnum.GE]: `📝 შეიყვანეთ პირველი პარტნიორის სახელი (მხოლოდ ასოები და გამოტოვება)`,
      },
    },

    birthDate: {
      error: {
        [LangEnum.EN]: `The first partner’s birth date was entered incorrectly 😢.\nPlease enter it again 🔄`,
        [LangEnum.RU]: `Дата рождения первого партнёра введена неправильно 😢.\nПожалуйста, введите её заново 🔄`,
        [LangEnum.GE]: `პირველი პარტნიორის დაბადების თარიღი არასწორადაა შეყვანილი 😢.\nგთხოვთ შეიყვანოთ ხელახლა 🔄`,
      },
      fieldTip: {
        [LangEnum.EN]: `📅 Enter the first partner’s birth date (DD/MM/YYYY)`,
        [LangEnum.RU]: `📅 Введите дату рождения первого партнёра (ДД/ММ/ГГГГ)`,
        [LangEnum.GE]: `📅 შეიყვანეთ პირველი პარტნიორის დაბადების თარიღი (DD/MM/YYYY)`,
      },
    },

    birthTime: {
      error: {
        [LangEnum.EN]: `The first partner’s birth time was entered incorrectly 😢.\nPlease enter it again 🔄`,
        [LangEnum.RU]: `Время рождения первого партнёра введено неправильно 😢.\nПожалуйста, введите его заново 🔄`,
        [LangEnum.GE]: `პირველი პარტნიორის დაბადების დრო არასწორადაა შეყვანილი 😢.\nგთხოვთ შეიყვანოთ ხელახლა 🔄`,
      },
      fieldTip: {
        [LangEnum.EN]: `⏰ Enter the first partner’s birth time (HH:MM)`,
        [LangEnum.RU]: `⏰ Введите время рождения первого партнёра (ЧЧ:ММ)`,
        [LangEnum.GE]: `⏰ შეიყვანეთ პირველი პარტნიორის დაბადების დრო (HH:MM)`,
      },
    },
  },

  secondPartner: {
    fullName: {
      error: {
        [LangEnum.EN]: `The second partner’s name was entered incorrectly 😢.\nPlease enter it again 🔄`,
        [LangEnum.RU]: `Имя второго партнёра введено неправильно 😢.\nПожалуйста, введите его заново 🔄`,
        [LangEnum.GE]: `მეორე პარტნიორის სახელი არასწორადაა შეყვანილი 😢.\nგთხოვთ შეიყვანოთ ხელახლა 🔄`,
      },
      fieldTip: {
        [LangEnum.EN]: `📝 Enter the second partner’s full name (letters and spaces only)`,
        [LangEnum.RU]: `📝 Введите имя второго партнёра (только буквы и пробелы)`,
        [LangEnum.GE]: `📝 შეიყვანეთ მეორე პარტნიორის სახელი (მხოლოდ ასოები და გამოტოვება)`,
      },
    },

    birthDate: {
      error: {
        [LangEnum.EN]: `The second partner’s birth date was entered incorrectly 😢.\nPlease enter it again 🔄`,
        [LangEnum.RU]: `Дата рождения второго партнёра введена неправильно 😢.\nПожалуйста, введите её заново 🔄`,
        [LangEnum.GE]: `მეორე პარტნიორის დაბადების თარიღი არასწორადაა შეყვანილი 😢.\nგთხოვთ შეიყვანოთ ხელახლა 🔄`,
      },
      fieldTip: {
        [LangEnum.EN]: `📅 Enter the second partner’s birth date (DD/MM/YYYY)`,
        [LangEnum.RU]: `📅 Введите дату рождения второго партнёра (ДД/ММ/ГГГГ)`,
        [LangEnum.GE]: `📅 შეიყვანეთ მეორე პარტნიორის დაბადების თარიღი (DD/MM/YYYY)`,
      },
    },

    birthTime: {
      error: {
        [LangEnum.EN]: `The second partner’s birth time was entered incorrectly 😢.\nPlease enter it again 🔄`,
        [LangEnum.RU]: `Время рождения второго партнёра введено неправильно 😢.\nПожалуйста, введите его заново 🔄`,
        [LangEnum.GE]: `მეორე პარტნიორის დაბადების დრო არასწორადაა შეყვანილი 😢.\nგთხოვთ შეიყვანოთ ხელახლა 🔄`,
      },
      fieldTip: {
        [LangEnum.EN]: `⏰ Enter the second partner’s birth time (HH:MM)`,
        [LangEnum.RU]: `⏰ Введите время рождения второго партнёра (ЧЧ:ММ)`,
        [LangEnum.GE]: `⏰ შეიყვანეთ მეორე პარტნიორის დაბადების დრო (HH:MM)`,
      },
    },
  },
};
