import { defineStore } from 'pinia';
import { Configuracion } from 'src/components/models';

export const useConfiguracionStore = defineStore('configuracion', {
  state: () => ({
    api_uri: '',
    token: '',
  }),
  getters: {
    obtener: (state) => state
  },
  actions: {
    modificar(el: Configuracion) {
      this.api_uri = el.api_uri;
      this.token = el.token;
    },
  },
  persist: true,
});
