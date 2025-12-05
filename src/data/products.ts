import drill from "@/assets/product-drill.jpg";
import roller from "@/assets/product-roller.jpg";
import faucet from "@/assets/product-faucet.jpg";
import bulb from "@/assets/product-bulb.jpg";
import type { Product } from "@/types";
import drill2 from "@/assets/product-drill-2.jpg";
import roller2 from "@/assets/product-roller-2.jpg";
import faucet2 from "@/assets/product-faucet-2.jpg";
import tiles1 from "@/assets/product-tiles-1.jpg";
import sacks1 from "@/assets/product-sacks-1.jpg";
import bucket1 from "@/assets/product-bucket-1.jpg";

export const products: Product[] = [
  {
    id: "p2",
    title: "Набор валиков для покраски",
    price: 1490,
    brand: "CozyPaint",
    available: true,
    category: "Краски",
    images: [roller, roller2],
    shortDescription: "Чистая и ровная покраска без усилий",
    description:
      "Комплект из валиков разной плотности с удобной ручкой и ванночкой. Подходит для водоэмульсионных и акриловых красок.",
    specs: {
      Материал: "микрофибра",
      Ширина: "180 мм",
      Комплект: "5 предметов",
    },
  },
  {
    id: "p3",
    title: "Смеситель для раковины хром",
    price: 4290,
    brand: "AquaCozy",
    available: false,
    category: "Сантехника",
    images: [faucet, faucet2],
    shortDescription: "Современный дизайн и долговечность",
    description:
      "Однорычажный смеситель с керамическим картриджем, антикоррозийным покрытием и аэратором для экономии воды.",
    specs: {
      Материал: "латунь",
      Покрытие: "хром",
      Гарантия: "3 года",
    },
  },
  {
    id: "p4",
    title: "Ламинат дуб натуральный 32 класс",
    price: 1290,
    brand: "QuickStep",
    available: true,
    category: "Ламинат",
    images: [tiles1, tiles1],
    shortDescription: "Влагостойкий ламинат с фаской",
    description:
      "Ламинат с имитацией натурального дуба, влагостойкая основа HDF, система замков Uniclic.",
    specs: {
      Класс: "32",
      Толщина: "8 мм",
      Размер: "1285×194 мм",
    },
  },
  {
    id: "p5",
    title: "Керамическая плитка \"Мрамор\" 30x30",
    price: 1290,
    brand: "TilePro",
    available: true,
    category: "Отделка",
    images: [tiles1, tiles1],
    shortDescription: "Износостойкая плитка для пола и стен",
    description:
      "Керамическая плитка с матовой поверхностью и рисунком под мрамор. Подходит для ванной, кухни и коридора.",
    specs: {
      Размер: "30×30 см",
      Толщина: "8 мм",
      Поверхность: "матовая",
    },
  },
  {
    id: "p6",
    title: "Обои виниловые на флизелиновой основе",
    price: 1890,
    brand: "Erismann",
    available: true,
    category: "Обои",
    images: [bucket1, bucket1],
    shortDescription: "Рельефные обои под покраску",
    description:
      "Виниловые обои на флизелиновой основе с рельефной фактурой. Подходят под многократную покраску.",
    specs: {
      Ширина: "106 см",
      Длина: "10.05 м",
      Основа: "флизелин",
    },
  },
  {
    id: "p7",
    title: "Натяжной потолок матовый",
    price: 2990,
    brand: "Barrisol",
    available: true,
    category: "Потолки",
    images: [sacks1, sacks1],
    shortDescription: "Экологичное полотно премиум класса",
    description:
      "Матовое потолочное полотно с антибактериальным покрытием. Установка в подарок при заказе от 15 м².",
    specs: {
      Ширина: "до 5 м",
      Фактура: "матовая",
      Гарантия: "12 лет",
    },
  },
  {
    id: "p8",
    title: "Штукатурка гипсовая 30 кг",
    price: 549,
    brand: "WhiteWall",
    available: true,
    category: "Отделка",
    images: [sacks1, roller],
    shortDescription: "Для ровных и гладких стен внутри помещений",
    description:
      "Пластичная, легко наносится и затирается. Обеспечивает идеальную основу под покраску и обои.",
    specs: {
      Основа: "гипс",
      Масса: "30 кг",
    },
  },
  {
    id: "p9",
    title: "Шпаклёвка финишная 20 кг",
    price: 629,
    brand: "FinishPro",
    available: true,
    category: "Отделка",
    images: [sacks1, roller],
    shortDescription: "Тонкий финишный слой под покраску",
    description:
      "Обеспечивает сверхгладкую поверхность, не трескается. Для сухих помещений.",
    specs: {
      Масса: "20 кг",
      Фракция: "тонкая",
    },
  },
  {
    id: "p10",
    title: "Керамогранит 60x60 \"Графит\"",
    price: 1890,
    brand: "TilePro",
    available: true,
    category: "Отделка",
    images: [tiles1, tiles1],
    shortDescription: "Прочный керамогранит для пола",
    description:
      "Низкое водопоглощение и высокая износостойкость. Идеален для прихожих и кухонь.",
    specs: {
      Размер: "60×60 см",
      Поверхность: "матовая",
    },
  },
  {
    id: "p11",
    title: "Плитка керамическая \"Метро\" 10x20",
    price: 890,
    brand: "Golden Tile",
    available: true,
    category: "Плитка",
    images: [bucket1, sacks1],
    shortDescription: "Классическая плитка кабанчик",
    description:
      "Глянцевая керамическая плитка в стиле метро. Идеальна для кухонных фартуков и ванных комнат.",
    specs: {
      Размер: "10×20 см",
      Поверхность: "глянцевая",
      Цвет: "белый",
    },
  },
  {
    id: "p12",
    title: "Дверь межкомнатная экошпон",
    price: 8900,
    brand: "Profil Doors",
    available: true,
    category: "Двери",
    images: [bucket1, roller2],
    shortDescription: "Современная дверь с невидимой коробкой",
    description:
      "Межкомнатная дверь из экошпона с алюминиевой кромкой и скрытыми петлями.",
    specs: {
      Размер: "200×80 см",
      Материал: "экошпон",
      Цвет: "дуб натуральный",
    },
  },
  {
    id: "p13",
    title: "Окно ПВХ двухстворчатое",
    price: 15900,
    brand: "Rehau",
    available: true,
    category: "Окна",
    images: [faucet, faucet2],
    shortDescription: "Энергосберегающие окна с фурнитурой Maco",
    description:
      "Окно ПВХ с двухкамерным стеклопакетом, поворотно-откидной фурнитурой и москитной сеткой.",
    specs: {
      Размер: "1300×1400 мм",
      Профиль: "Rehau Blitz 70",
      Стеклопакет: "4-16-4-16-4",
    },
  },
  {
    id: "p14",
    title: "Паркетная доска дуб селект",
    price: 3290,
    brand: "Barlinek",
    available: true,
    category: "Паркет",
    images: [tiles1, roller],
    shortDescription: "Трёхполосная паркетная доска с лаковым покрытием",
    description:
      "Паркетная доска из массива дуба с лаковым покрытием в 7 слоёв. Система замков 5G.",
    specs: {
      Размер: "2200×207×14 мм",
      Покрытие: "лак матовый",
      Селекция: "рустик",
    },
  },
  {
    id: "p15",
    title: "Керамогранит под дерево 15x60",
    price: 1690,
    brand: "Estima",
    available: true,
    category: "Керамогранит",
    images: [tiles1, sacks1],
    shortDescription: "Керамогранит с текстурой натурального дерева",
    description:
      "Ректифицированный керамогранит с HD-печатью. Подходит для пола и стен.",
    specs: {
      Размер: "15×60 см",
      Поверхность: "структурная",
      Морозостойкость: "да",
    },
  },
  {
    id: "p16",
    title: "Линолеум коммерческий гетерогенный",
    price: 2490,
    brand: "Tarkett",
    available: true,
    category: "Линолиум",
    images: [roller, roller2],
    shortDescription: "Износостойкий линолеум для высоких нагрузок",
    description:
      "Коммерческий линолеум 34 класса с полиуретановым покрытием и антибактериальной защитой.",
    specs: {
      Ширина: "2 м",
      Класс: "34",
      Толщина: "2 мм",
    },
  },
];
