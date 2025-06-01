export default function ReturnPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-28 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Возврат товара</h1>
            <p className="text-xl text-gray-600">Информация об условиях возврата</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="border-2 border-black p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Условия возврата</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Возврат товара возможен в течение 14 дней после получения</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Товар должен быть в неношеном состоянии</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Сохранены все бирки и упаковка</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Наличие документа, подтверждающего покупку</span>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-black p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Способы возврата</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>В магазине по адресу: Брест, Советская ул., 97</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Почтовым отправлением</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div className="border-2 border-black p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Процесс возврата</h3>
                <div className="space-y-6 text-gray-600">
                  <div>
                    <h4 className="font-semibold mb-2">1. Оформление заявки</h4>
                    <p>
                      Заполните заявление на возврат товара, указав причину возврата
                      и предпочтительный способ возврата денежных средств.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">2. Проверка товара</h4>
                    <p>
                      Наши специалисты проверят состояние товара и соответствие
                      условиям возврата в течение 1-2 рабочих дней.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">3. Возврат денежных средств</h4>
                    <p>
                      После подтверждения возврата деньги будут возвращены тем же
                      способом, которым была произведена оплата, в течение 7 рабочих дней.
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-semibold">Важно:</p>
                    <p>
                      При возврате товара по почте, расходы на пересылку
                      оплачиваются покупателем.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}