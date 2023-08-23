import { defineStore } from 'pinia';

export const useBusquedaStore = defineStore('busqueda', {
  state: () => ({
    ruta: '',
  }),
  getters: {
    obtener: (state) => state,
  },
  actions: {
    modificar(ruta: string) {
      this.ruta = ruta;
    },
  },
  persist: true,
});
