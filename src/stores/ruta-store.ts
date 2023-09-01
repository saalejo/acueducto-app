import { defineStore } from 'pinia';

export const useRutaStore = defineStore('ruta', {
  state: () => ({
    ruta: [],
  }),
  getters: {
    obtener: (state) => state.ruta,
  },
  actions: {
    modificar(ruta: any) {
      this.ruta = ruta;
    },
  },
});
