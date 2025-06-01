export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-28 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">О компании Панда</h1>
            <p className="text-xl text-gray-600">Лидер в производстве и продаже одежды с 2000 года</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Наша история</h2>
              <p className="text-gray-600 mb-4">
                ОДО «Панда» начала свою деятельность в 2000 году. За это время компания прошла путь
                от небольшого производства до одного из крупнейших производителей одежды в Беларуси.
              </p>
              <p className="text-gray-600 mb-4">
                Сегодня «Панда» — это современное предприятие, оснащенное передовым оборудованием
                и использующее инновационные технологии в производстве.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Наши преимущества</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Собственное производство в Беларуси</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Контроль качества на всех этапах производства</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Современное оборудование и технологии</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Широкий ассортимент продукции</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-black mb-2">25</div>
                <p className="text-gray-600">лет на рынке</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-black mb-2">1000+</div>
                <p className="text-gray-600">довольных клиентов</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-black mb-2">500+</div>
                <p className="text-gray-600">моделей одежды</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}