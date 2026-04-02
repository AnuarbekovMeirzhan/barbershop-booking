import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "services": "Services",
        "barbers": "Barbers",
        "book": "Book Appointment"
      },
      "hero": {
        "subtitle": "The Gentlemen's Grooming Lounge",
        "title": "Refine Your Style,<br />Define Your Presence.",
        "desc": "Experience the ultimate in men's grooming. Precision cuts, classic shaves, and an atmosphere of pure luxury.",
        "book_btn": "Book Now",
        "services_btn": "Our Services"
      },
      "services": {
        "title": "Our Services",
        "subtitle": "Masterful Grooming",
        "s1_title": "Signature Haircut",
        "s1_desc": "Precision cut, tailored to your head shape and personal style.",
        "s2_title": "Classic Beard Trim",
        "s2_desc": "Sculpting and conditioning to keep your beard looking sharp.",
        "s3_title": "Luxury Wet Shave",
        "s3_desc": "Traditional hot towel shave with premium lather and straight razor.",
        "s4_title": "Hair & Scalp Treatment",
        "s4_desc": "Revitalizing treatment to nourish the scalp and strengthen hair."
      },
      "barbers": {
        "title": "The Masters",
        "subtitle": "Meet Our Experts",
        "book": "Book",
        "b1_role": "Master Barber",
        "b2_role": "Senior Barber",
        "b3_role": "Beard Specialist",
        "b1_name": "James Rockford",
        "b2_name": "William Sterling",
        "b3_name": "Arthur Pendelton"
      },
      "booking": {
        "title": "Reserve Your Seat",
        "subtitle": "Secure your appointment in a few easy steps.",
        "step1": "Barber",
        "step2": "Service",
        "step3": "Date",
        "step4": "Time",
        "select_barber": "Select a Barber",
        "select_service": "Select a Service",
        "select_date": "Select a Date",
        "select_time": "Select a Time Slot",
        "any_available": "Any Available",
        "btn_back": "Back",
        "btn_continue": "Continue",
        "btn_confirm": "Confirm Booking",
        "success_title": "Booking Confirmed!",
        "success_desc_1": "Your appointment with",
        "success_desc_2": "for a",
        "success_desc_3": "is set for",
        "success_desc_4": "at",
        "book_another": "Book Another"
      },
      "footer": {
        "bio": "Elevating men's grooming to an art form. Join us for a truly premium experience.",
        "explore": "Explore",
        "home": "Home",
        "contact": "Contact & Hours",
        "rights": "Luxe Barbershop. All rights reserved."
      }
    }
  },
  ru: {
    translation: {
      "nav": {
        "services": "Услуги",
        "barbers": "Мастера",
        "book": "Записаться"
      },
      "hero": {
        "subtitle": "Мужской зал премиум класса",
        "title": "Подчеркни свой стиль,<br />Заяви о себе.",
        "desc": "Испытайте безупречный уровень мужского груминга. Точные стрижки, классическое бритье и атмосфера истинной роскоши.",
        "book_btn": "Записаться",
        "services_btn": "Наши услуги"
      },
      "services": {
        "title": "Наши услуги",
        "subtitle": "Мастерский груминг",
        "s1_title": "Фирменная стрижка",
        "s1_desc": "Точная стрижка, подобранная под форму головы и личный стиль.",
        "s2_title": "Классическое оформление бороды",
        "s2_desc": "Моделирование и уход для сохранения четких контуров Вашей бороды.",
        "s3_title": "Роскошное влажное бритье",
        "s3_desc": "Традиционное бритье опасной бритвой с горячим полотенцем премиум-класса.",
        "s4_title": "Уход за волосами и кожей головы",
        "s4_desc": "Восстанавливающий уход для питания кожи головы и укрепления волос."
      },
      "barbers": {
        "title": "Мастера",
        "subtitle": "Наши эксперты",
        "book": "К",
        "b1_role": "Мастер-барбер",
        "b2_role": "Старший барбер",
        "b3_role": "Специалист по бороде",
        "b1_name": "Джеймс Рокфорд",
        "b2_name": "Уильям Стерлинг",
        "b3_name": "Артур Пенделтон"
      },
      "booking": {
        "title": "Забронировать место",
        "subtitle": "Запишитесь на прием за несколько простых шагов.",
        "step1": "Мастер",
        "step2": "Услуга",
        "step3": "Дата",
        "step4": "Время",
        "select_barber": "Выберите мастера",
        "select_service": "Выберите услугу",
        "select_date": "Выберите дату",
        "select_time": "Выберите время",
        "any_available": "Любой свободный",
        "btn_back": "Назад",
        "btn_continue": "Продолжить",
        "btn_confirm": "Подтвердить запись",
        "success_title": "Запись подтверждена!",
        "success_desc_1": "Ваша запись к мастеру",
        "success_desc_2": "на услугу",
        "success_desc_3": "назначена на",
        "success_desc_4": "в",
        "book_another": "Записаться еще раз"
      },
      "footer": {
        "bio": "Возведение мужского груминга в ранг искусства. Присоединяйтесь к нам для по-настоящему премиального опыта.",
        "explore": "Навигация",
        "home": "Главная",
        "contact": "Контакты и время работы",
        "rights": "Luxe Barbershop. Все права защищены."
      }
    }
  },
  kk: {
    translation: {
      "nav": {
        "services": "Қызметтер",
        "barbers": "Шеберлер",
        "book": "Жазылу"
      },
      "hero": {
        "subtitle": "Ерлерге арналған премиум салон",
        "title": "Өз стиліңді тап,<br />Тұлғаңды көрсет.",
        "desc": "Ерлер күтімінің ең жоғары деңгейін сезініңіз. Дәл шаш үлгілері, классикалық қырыну және нағыз сән-салтанат атмосферасы.",
        "book_btn": "Қазір жазылу",
        "services_btn": "Біздің қызметтер"
      },
      "services": {
        "title": "Біздің қызметтер",
        "subtitle": "Шеберлер күтімі",
        "s1_title": "Фирмалық шаш үлгісі",
        "s1_desc": "Бас пішіміңіз бен жеке стиліңізге бейімделген дәл шаш үлгісі.",
        "s2_title": "Классикалық сақал күтімі",
        "s2_desc": "Сақалыңызды мінсіз ұстау үшін мүсіндеу және күтім жасау.",
        "s3_title": "Сәнді ылғалды қырыну",
        "s3_desc": "Мінсіз көбік пен ыстық сүлгімен дәстүрлі ұстарамен қырыну.",
        "s4_title": "Шаш және бас терісіне күтім",
        "s4_desc": "Бас терісін нәрлендіруге және шашты қатайтуға арналған емдік шара."
      },
      "barbers": {
        "title": "Шеберлер",
        "subtitle": "Біздің сарапшылар",
        "book": "Шебер",
        "b1_role": "Бас шебер",
        "b2_role": "Аға шебер",
        "b3_role": "Сақал маманы",
        "b1_name": "Джеймс Рокфорд",
        "b2_name": "Уильям Стерлинг",
        "b3_name": "Артур Пенделтон"
      },
      "booking": {
        "title": "Орын брондау",
        "subtitle": "Бірнеше қарапайым қадаммен жазылыңыз.",
        "step1": "Шебер",
        "step2": "Қызмет",
        "step3": "Күн",
        "step4": "Уақыт",
        "select_barber": "Шеберді таңдаңыз",
        "select_service": "Қызметті таңдаңыз",
        "select_date": "Күнді таңдаңыз",
        "select_time": "Уақытты таңдаңыз",
        "any_available": "Кез келген бос",
        "btn_back": "Артқа",
        "btn_continue": "Жалғастыру",
        "btn_confirm": "Жазылуды растау",
        "success_title": "Жазылу расталды!",
        "success_desc_1": "Сіздің шебер",
        "success_desc_2": "қызмет",
        "success_desc_3": "уақыты",
        "success_desc_4": "сағат",
        "book_another": "Қайта жазылу"
      },
      "footer": {
        "bio": "Ерлер күтімін өнер деңгейіне көтеру. Нағыз премиум тәжірибе алу үшін бізге қосылыңыз.",
        "explore": "Навигация",
        "home": "Басты бет",
        "contact": "Байланыс және жұмыс уақыты",
        "rights": "Luxe Barbershop. Барлық құқықтар қорғалған."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
