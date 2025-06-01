export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-28 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Контакты</h1>
            <p className="text-xl text-gray-600">Свяжитесь с нами любым удобным способом</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 border-2 border-black">
              <svg className="h-5 w-5 text-black mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Адрес</h3>
              <p className="text-gray-600">
                224030, Республика Беларусь,<br />
                г. Брест, Советская ул., 97
              </p>
            </div>

            <div className="text-center p-6 border-2 border-black">
              <svg className="h-5 w-5 text-black mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Телефоны</h3>
              <p className="text-gray-600">
                +375 (29) 777-77-77<br />
                +375 (33) 888-88-88
              </p>
            </div>

            <div className="text-center p-6 border-2 border-black">
              <svg className="h-5 w-5 text-black mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">example@panda.by</p>
            </div>
          </div>

          <div className="border-2 border-black p-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2384.3192486817403!2d23.683876776900946!3d52.09602037123684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47210bde976ff2e5%3A0x5d1cfb394e8a69d4!2z0YPQuy4g0KHQvtCy0LXRgtGB0LrQsNGPIDk3LCDQkdGA0LXRgdGC!5e0!3m2!1sru!2sby!4v1701234567890!5m2!1sru!2sby"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}