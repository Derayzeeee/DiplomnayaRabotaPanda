export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-28 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Доставка</h1>
            <p className="text-xl text-gray-600">Информация о способах доставки</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8">
              <div className="border-2 border-black p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Курьерская доставка</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Доставка по Беларуси - 5 BYN</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Доставка осуществляется с 10:00 до 21:00</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Бесплатная доставка при заказе от 200 BYN</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-black p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Самовывоз</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Бесплатно из магазина по адресу: Брест, Советская 97</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Время работы: Пн-Пт с 9:00 до 18:00</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div className="border-2 border-black p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Условия доставки</h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    При оформлении заказа вы можете выбрать удобный для вас способ доставки.
                    Стоимость доставки рассчитывается автоматически в зависимости от выбранного
                    способа и суммы заказа.
                  </p>
                  <h4 className="font-semibold">Сроки доставки:</h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>По Беларуси - на следующий рабочий день</li>
                    <li>Самовывоз - в течение дня после подтверждения заказа</li>
                  </ul>
                  <p>
                    Перед доставкой курьер свяжется с вами для уточнения времени доставки.
                    При самовывозе статус заказа в профиле уведомит вас о готовности заказа.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}