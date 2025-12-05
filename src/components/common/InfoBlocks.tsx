export default function InfoBlocks() {
  return (
    <section aria-labelledby="info-blocks" className="container mt-16 grid gap-6 md:grid-cols-3">
      <div className="rounded-lg border p-6">
        <h3 className="font-semibold mb-2">Доставка и оплата</h3>
        <p className="text-sm text-muted-foreground">Быстрая доставка по городу и области, удобные способы оплаты.</p>
      </div>
      <div className="rounded-lg border p-6">
        <h3 className="font-semibold mb-2">Почему мы</h3>
        <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
          <li>Проверенные бренды</li>
          <li>Честные цены</li>
          <li>Поддержка и консультации</li>
        </ul>
      </div>
      <div className="rounded-lg border p-6">
        <h3 className="font-semibold mb-2">Отзывы клиентов</h3>
        <p className="text-sm text-muted-foreground">“Быстро оформили, привезли в срок. Рекомендую!”</p>
      </div>
    </section>
  );
}
