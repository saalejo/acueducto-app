import { defineStore } from 'pinia';

export const useRutaStore = defineStore('ruta', {
  state: () => ({
    ruta: null,
  }),
  getters: {
    obtener: (state) => state.ruta,
  },
  actions: {
    modificar(ruta) {
      this.ruta = ruta;
    },
  },
  persist: true,
});
