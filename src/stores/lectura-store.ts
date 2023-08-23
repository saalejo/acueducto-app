import { defineStore } from 'pinia';

export const useLecturaStore = defineStore('lectura', {
  state: () => ({
    lectura: null,
  }),
  getters: {
    obtener: (state) => state.lectura,
  },
  actions: {
    modificar(lectura: any) {
      this.lectura = lectura;
    },
  },
  persist: true,
});
