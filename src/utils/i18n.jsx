import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const savedLang = localStorage.getItem('lang') || 'uz'

i18n.use(initReactI18next).init({
  resources: {
    uz: {
      translation: {
        /* =====================
           MAIN SITE
        ====================== */
        universities: 'Universitetlar',
        directions: 'Yo‘nalishlar',
        news: 'Yangiliklar',
        online_test: 'Onlayn test',
        articles: 'Maqolalar',
        languages: 'Til',
        contact: 'Aloqa',
        profile: 'Profil',
        login: 'Kirish',

        header_title:
          'Oʻzbekiston oliy o‘quv yurtlari uchun darsliklar va kurslar bazasi.',
        header_text_prefix: 'Saytimizda universitetlar o‘z ',
        header_text_highlight:
          'yo‘nalishlari, fanlari va adabiyotlarini joylashtirishlari',
        header_text_suffix:
          ', shuningdek, darsliklar va talabalar statistikasi bilan kuzatib borishlariz mumkin.',
        search_placeholder: 'Universitet nomini qidiring...',
        search_button: 'Qidirish',

        categories: 'Kategoriyalar',
        phone_label: 'Telefon',
        email_label: 'Email',
        address_label: 'Manzil',
        all_rights_reserved: 'Barcha huquqlar himoyalangan.',

        statistics_title: 'Bizning statistikamiz raqamlarda',
        students: 'Talabalar',

        universities_stats_title: 'Universitetlar statistikasi',
        unauthorized: 'Foydalanuvchi tizimga kirmagan',
        loading_stats: 'Statistika yuklanmoqda...',
        error_stats: 'Xatolik: {{error}}',
        no_data: 'Ma’lumotlar mavjud emas',
        download_excel: 'Statistikani yuklab olish (Excel)',
        university: 'Universitet',
        directions_stats: 'Yo‘nalishlar',
        subjects: 'Fanlar',
        literature: 'Adabiyotlar',
        accessibility_percent: 'Foiz mavjudlik',

        admin_cabinet: 'Admin kabineti',
        admins: 'Adminlar',
        kafedras: 'Kafedralar',
        logout: 'Chiqish',

        English: 'Ingliz',
        Russian: 'Rus',
        Uzbek: "O'zbek",

        /* =====================
           UNIVERSAL BUTTONS
        ====================== */
        add: 'Qo‘shish',
        save: 'Saqlash',
        edit: 'Tahrirlash',
        delete: 'O‘chirish',
        back: 'Orqaga',
        cancel: 'Bekor qilish',

        /* =====================
           TABLE / FORM TEXTS
        ====================== */
        unattached: 'Biriktirilmagan',
        all_univers: 'Barcha universitetlar',
        all_subjects: 'Barcha fanlar',

        kafedra: 'Kafedra',
        kafedra_name: 'Kafedra nomi',
        action: 'Amal',

        email: 'Email',
        role: 'Rol',
        owner: 'Egalik qiluvchi',
        superadmin: 'Superadmin',

        title: 'Adabiyot nomi',
        kind: 'O‘quv adabiyoti turi',
        language: 'Adabiyot tili',
        font: 'Yozuvi',
        year: 'Yil',
        file: 'Fayl',
        available: 'Mavjud',
        actions: 'Amallar',
        download: 'Yuklab olish',

        author: 'Muallif',
        publisher: 'Nashriyot',
        printed_count: 'Bosma etilgan soni',
        attach_file: 'Fayl biriktirish',
        literatures: 'Adabiyotlar',

        directions_name: 'Yo‘nalish nomi',
        course: 'Kurs',
        students_count: 'Talabalar soni',

        cipher: 'Shifr',
        subject: 'Fan',
        add_more: 'Yana qo‘shish',

        region: 'Hudud',
        location: 'Joylashuv',

        exit: 'Chiqish',
      },
    },

    /* =====================
          RUSSIAN
    ====================== */
    ru: {
      translation: {
        universities: 'Университеты',
        directions: 'Направления',
        news: 'Новости',
        online_test: 'Онлайн тест',
        articles: 'Статьи',
        languages: 'Язык',
        contact: 'Контакты',
        profile: 'Профиль',
        login: 'Войти',

        header_title:
          'База учебников и курсов для высших учебных заведений Узбекистана.',
        header_text_prefix: 'На нашем сайте университеты могут размещать свои ',
        header_text_highlight: 'направления, предметы и учебники',
        header_text_suffix: ', а также отслеживать статистику студентов.',
        search_placeholder: 'Поиск университета...',
        search_button: 'Поиск',

        categories: 'Категории',
        phone_label: 'Телефон',
        email_label: 'Email',
        address_label: 'Адрес',
        all_rights_reserved: 'Все права защищены.',

        statistics_title: 'Наша статистика в цифрах',
        students: 'Студенты',

        universities_stats_title: 'Статистика университетов',
        unauthorized: 'Пользователь не авторизован',
        loading_stats: 'Загрузка статистики...',
        error_stats: 'Ошибка: {{error}}',
        no_data: 'Данные отсутствуют',
        download_excel: 'Скачать статистику (Excel)',
        university: 'Университет',
        directions_stats: 'Направления',
        subjects: 'Предметы',
        literature: 'Литература',
        accessibility_percent: '% Доступности',

        admin_cabinet: 'Админ кабинет',
        admins: 'Админы',
        kafedras: 'Кафедры',
        logout: 'Выйти',

        English: 'Английский',
        Russian: 'Русский',
        Uzbek: 'Узбекский',

        /* BUTTONS */
        add: 'Добавить',
        save: 'Сохранить',
        edit: 'Редактировать',
        delete: 'Удалить',
        back: 'Назад',
        cancel: 'Отмена',

        /* FORMS / TABLES */
        unattached: 'Не прикреплено',
        all_univers: 'Все университеты',
        all_subjects: 'Все предметы',

        kafedra: 'Кафедра',
        kafedra_name: 'Название кафедры',
        action: 'Действия',

        email: 'Email',
        role: 'Роль',
        owner: 'Владелец',
        superadmin: 'Суперадмин',

        title: 'Название',
        kind: 'Тип',
        language: 'Язык',
        font: 'Шрифт',
        year: 'Год',
        file: 'Файл',
        available: 'Имееться',
        actions: 'Действия',
        download: 'Скачать',

        author: 'Автор',
        publisher: 'Издательство',
        printed_count: 'Количество напечатанных',
        attach_file: 'Прикрепить файл',
        literatures: 'Литература',

        name: 'Название',
        directions_name: 'Название направления',
        course: 'Курс',
        students_count: 'Количество студентов',

        cipher: 'Шифр',
        subject: 'Предмет',
        add_more: 'Добавить ещё',

        region: 'Область',
        location: 'Локация',

        exit: 'Выход',
      },
    },

    /* =====================
          ENGLISH
    ====================== */
    en: {
      translation: {
        universities: 'Universities',
        directions: 'Directions',
        news: 'News',
        online_test: 'Online Test',
        articles: 'Articles',
        languages: 'Languages',
        contact: 'Contact',
        profile: 'Profile',
        login: 'Login',

        header_title:
          'Database of textbooks and courses for higher education in Uzbekistan.',
        header_text_prefix: 'On our site, universities can add their ',
        header_text_highlight: 'departments, subjects, and textbooks',
        header_text_suffix: ', and also track student statistics.',
        search_placeholder: 'Search university...',
        search_button: 'Search',

        categories: 'Categories',
        phone_label: 'Phone',
        email_label: 'Email',
        address_label: 'Address',
        all_rights_reserved: 'All rights reserved.',

        statistics_title: 'Our statistics in numbers',
        students: 'Students',

        universities_stats_title: 'Universities Statistics',
        unauthorized: 'User not authorized',
        loading_stats: 'Loading statistics...',
        error_stats: 'Error: {{error}}',
        no_data: 'No data available',
        download_excel: 'Download statistics (Excel)',
        university: 'University',
        directions_stats: 'Directions',
        subjects: 'Subjects',
        literature: 'Literature',
        accessibility_percent: 'Accessibility %',

        admin_cabinet: 'Admin cabinet',
        admins: 'Admins',
        kafedras: 'Departments',

        English: 'English',
        Russian: 'Russian',
        Uzbek: 'Uzbek',

        /* BUTTONS */
        add: 'Add',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        back: 'Back',
        cancel: 'Cancel',

        /* TABLE/FORMS */
        unattached: 'Unattached',
        all_univers: 'All universities',
        all_subjects: 'All subjects',

        kafedra: 'Department',
        kafedra_name: 'Department name',
        action: 'Action',

        email: 'Email',
        role: 'Role',
        owner: 'Owner',
        superadmin: 'Superadmin',

        title: 'Title',
        kind: 'Kind',
        language: 'Language',
        font: 'Font',
        year: 'Year',
        file: 'File',
        available: 'Available',
        actions: 'Actions',
        download: 'Download',

        author: 'Author',
        publisher: 'Publisher',
        printed_count: 'Printed count',
        attach_file: 'Attach file',
        literatures: 'Literatures',

        name: 'Name',
        directions_name: 'Direction name',
        course: 'Course',
        students_count: 'Students count',

        cipher: 'Cipher',
        subject: 'Subject',
        add_more: 'Add more',

        region: 'Region',
        location: 'Location',

        exit: 'Exit',
      },
    },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
