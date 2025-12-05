export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container py-10 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">Уютный ремонт</h3>
          <p className="text-sm text-muted-foreground">Товары для ремонта и уюта дома.</p>
        </div>
        <div>
          <div className="font-medium mb-2">Меню</div>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li><a href="/catalog">Каталог</a></li>
            <li><a href="/promotions">Акции</a></li>
            <li><a href="/contacts">Контакты</a></li>
            <li><a href="/about">Доставка и оплата</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-2">Контакты</div>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>+7 (910) 774-52-30</li>
            <li>cozyrenovations@yandex.ru</li>
            <li>Владимир, Опольевская улица, 1, корп. 29</li>
            <li>Каждый день с 9:00 до 18:00</li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-2">Правовая информация</div>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li><a href="#">Реквизиты</a></li>
            <li><a href="#">Политика конфиденциальности</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 text-xs text-muted-foreground">© {new Date().getFullYear()} Уютный ремонт</div>
      </div>
    </footer>
  );
}
