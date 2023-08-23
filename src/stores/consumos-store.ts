import { defineStore } from 'pinia';

export const useRutaStore = defineStore('consumos', {
  state: () => ({
    consumos: [],
  }),
  getters: {
    obtener: (state) => state.consumos,
  },
  actions: {
    modificar(consumos: any) {
      this.consumos = consumos;
    },
  },
  persist: true,
});
