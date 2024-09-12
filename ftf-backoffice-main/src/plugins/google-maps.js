import VueGoogleMaps from '@fawmi/vue-google-maps';

export default {
  install: (app) => {
    app.use(VueGoogleMaps, {
      load: {
        key: import.meta.env.VITE_APP_GOOGLE_API_KEY,
        libraries: 'places', 
      },
    });
  },
};
