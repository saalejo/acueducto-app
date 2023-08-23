import { defineStore } from 'pinia';

export const useSectoresStore = defineStore('sectores', {
  state: () => ({
    sectores: [],
  }),
  getters: {
    obtener: (state) => state.sectores,
  },
  actions: {
    modificar(sectores: any) {
      this.sectores = sectores;
    },
  },
  persist: true,
});
