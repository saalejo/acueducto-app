<template>
  <div>
    <q-btn
      flat
      dense
      round
      icon="route"
      aria-label="Configuracion"
      @click="modal = true"
      title="Ruta"
    />
    <q-dialog v-model="modal" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="text-h6">Busqueda ruta</span>
        </q-card-section>
        <q-card-section class="items-center">
          <div class="row">
            <div class="col q-pa-md">
              <q-input outlined v-model="busqueda.ruta" label="Codigo ruta" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Buscar" color="primary" v-close-popup @click="buscar"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useBusquedaStore } from 'stores/busqueda-store';
  import { useRutaStore } from 'stores/ruta-store';
  import { useLecturaStore } from 'stores/lectura-store';
  import { useSectoresStore } from 'stores/sectores-store';
  import { api } from 'boot/axios';
  const storeBusqueda = useBusquedaStore();
  const storeRuta = useRutaStore();
  const storeLectura = useLecturaStore();
  const storeSectores= useSectoresStore();
  const modal = ref(false);
  const busqueda = ref(computed(() => storeBusqueda.obtener));
  const sectores = ref([]);
  const buscar = () => {
    const url = '/rutas/?codigo=' + busqueda.value.ruta;
    api.get(url).then((response: any) => {
      const ruta = response.data[0];
      if (ruta) {
        storeRuta.modificar(ruta);
        storeLectura.modificar(ruta.lecturas[ruta.lecturas.length -1]);
        ruta.lecturas.forEach((element: any) => {
          if (!sectores.value.includes(element.consumo.sector)) {
            sectores.value = sectores.value.concat([element.consumo.sector]);
          }
        });
        storeSectores.modificar(sectores.value);
      }
    }).catch((error: any) => {
      console.log(error);
    });
  }
</script>
