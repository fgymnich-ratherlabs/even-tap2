module.exports = {
    i18n: {
      locales: ['en', 'es'], // Idiomas soportados
      defaultLocale: 'en',    // Idioma por defecto
      localeDetection: false,  // Detectar el idioma automáticamente
      cookieName : 'i18next',
      defaultNS: 'translation',
      getOptions:  (lng = 'en', ns = 'translation') => {
        return {
          // debug: true,
          supportedLngs: ['en', 'es'],
          defaultLocale: 'en',
          lng,
          fallbackNS: 'translation',
          defaultNS: 'translation',
          ns
        }
      }

    },
};