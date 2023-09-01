import { defineStore } from 'pinia';

export const useRutasStore = defineStore('rutas', {
  state: () => ({
    rutas: null,
  }),
  getters: {
    obtener: (state) => state.rutas || [],
  },
  actions: {
    modificar(rutas:any) {
      this.rutas = rutas;
    },
  },
  persist: true,
});
