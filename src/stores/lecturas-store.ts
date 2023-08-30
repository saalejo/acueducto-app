import { defineStore } from 'pinia';

export const useLecturasStore = defineStore('lecturas', {
  state: () => ({
    lecturas: [],
  }),
  getters: {
    obtener: (state) => state.lecturas,
  },
  actions: {
    modificar(lecturas: any) {
      this.lecturas = lecturas;
    },
  },
  persist: true,
});
