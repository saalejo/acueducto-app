<template>
  <div class=" col q-pa-md">
    <div class="row fixed-bottom-right">
      <div class="col q-pa-md">
        <q-btn
          @click="buscar"
          icon="refresh"
          round color="primary"/>        
      </div>
    </div>
    <q-list bordered separator>
      <q-item clickable v-ripple
        v-for="ruta in rutas" :key="ruta.id"
        @click="seleccionar(ruta)">
        <q-item-section>
          <q-item-label>{{ ruta.vereda }}</q-item-label>
          <q-item-label caption>{{ ruta.fecha }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useConfiguracionStore } from 'stores/configuracion-store';
  import { useRutaStore } from 'stores/ruta-store';
  import { useRutasStore } from 'stores/rutas-store';
  import { useLecturaStore } from 'stores/lectura-store';
  import { useSectoresStore } from 'stores/sectores-store';
  import { api } from 'boot/axios';
  import { useRouter } from 'vue-router'
  import { useQuasar } from 'quasar'

  const $q = useQuasar()
  const router = useRouter()
  const storeConfiguracion = useConfiguracionStore();
  const storeRuta = useRutaStore();
  const storeRutas = useRutasStore();
  const storeLectura = useLecturaStore();
  const storeSectores= useSectoresStore();
  const configuracion = ref(computed(() => storeConfiguracion.obtener));
  const rutas = ref(computed(() => storeRutas.obtener));
  const sectores = ref([]);
  const buscar = () => {
    if (configuracion.value.token) {
      $q.loading.show();
      const url = '/ruta_simple/?dispositivo__codigo=' + configuracion.value.token;
      api.get(url).then((response: any) => {
        storeRutas.modificar(response.data);
      }).catch((error: any) => {
        console.log(error);
      }).finally(() => {
        $q.loading.hide()
      });
    }
  }

  const seleccionar = (rutap: any) => {
    $q.loading.show();
    const url = '/rutas/' + rutap.id;
    api.get(url).then((response: any) => {
      const ruta = response.data;
      if (ruta) {
        storeRuta.modificar(ruta);
        storeLectura.modificar(ruta.lecturas[0]);
        ruta.lecturas.forEach((element: any) => {
          if (!sectores.value.includes(element.consumo.sector)) {
            sectores.value = sectores.value.concat([element.consumo.sector]);
          }
        });
        storeSectores.modificar(sectores.value);
        router.push({ path: '/ruta' })
      }
    }).catch((error: any) => {
      console.log(error);
    }).finally(() => {
      $q.loading.hide()
    });
  }
  onMounted(buscar)
</script>
