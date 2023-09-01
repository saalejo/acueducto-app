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
        <q-item-section side>
          <q-icon name="done"/>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useConfiguracionStore } from 'stores/configuracion-store';
  import { useRutasStore } from 'stores/rutas-store';
  import { useSectoresStore } from 'stores/sectores-store';
  import { api } from 'boot/axios';
  import { useRouter } from 'vue-router'
  import { useQuasar } from 'quasar'
  import { useRutaStore } from 'src/stores/ruta-store';
  import { useLecturaStore } from 'src/stores/lectura-store';
  import { errorMessage, infoMessage } from 'src/boot/messages'

  const $q = useQuasar()
  const router = useRouter()
  const storeConfiguracion = useConfiguracionStore();
  const storeRuta = useRutaStore();
  const storeRutas = useRutasStore();
  const storeSectores= useSectoresStore();
  const storeLectura = useLecturaStore();
  const configuracion = ref(computed(() => storeConfiguracion.obtener));
  const rutas = ref(computed(() => storeRutas.obtener));
  const ruta = ref(computed(() => storeRuta.obtener));
  const sectores = ref([]);

  const loadLectura = (ruta: any) => {
    if (ruta.rutaStore) {
      storeRuta.modificar(ruta.rutaStore);
      storeLectura.modificar(ruta.rutaStore.lecturas[0]);
      ruta.rutaStore.selected = true;
      ruta.rutaStore.lecturas.forEach((el: any) => {
        if (!sectores.value.includes(el.consumo.sector)) {
          sectores.value = sectores.value.concat([el.consumo.sector]);
        }
      });
      storeSectores.modificar(sectores.value);
      router.push({ path: '/ruta' })
    }
  }

  const consultarRuta = (r: any, load: boolean) => {
    $q.loading.show();
    const url = '/rutas/' + r.id;
    api.get(url).then((response: any) => {
      const ruta = response.data;
      r.rutaStore = ruta;
      storeRutas.modificar(rutas.value);
      if (load) {
        loadLectura(r)
      }
    }).catch(() => {
      $q.notify(errorMessage);
    }).finally(() => {
      $q.loading.hide()
    });
  }

  const buscar = () => {
    if (configuracion.value.token) {
      $q.loading.show();
      const url = '/ruta_simple/?dispositivo__codigo=' + configuracion.value.token;
      api.get(url).then((response: any) => {
        const nuevasRutas = response.data;
        const nuevas = ref([]);
        rutas.value.forEach((r: any) => {
          const existe = nuevasRutas.find((rp: any) => rp.id == r.id);
          if (!existe) {
            rutas.value.splice(rutas.value.indexOf(r), 1)
          }
        });
        nuevasRutas.forEach((r: any) => {
          const existe = rutas.value.find((rp: any) => rp.id == r.id);
          if (!existe) {
            nuevas.value = nuevas.value.concat([r])
            consultarRuta(r, false)
          }
        });
        storeRutas.modificar(nuevas.value.concat(rutas.value));
      }).catch((error) => {
        $q.notify(infoMessage);
      }).finally(() => {
        $q.loading.hide()
      });
    }
  }

  const seleccionar = (rutap: any) => {
    const r = rutas.value.find(r => r.id == rutap.id);
    rutas.value.forEach((rp: any) => rp.selected == false);
    r.selected = true;
    if (r.rutaStore) {
      loadLectura(r)
    } else {
      consultarRuta(r, true);
    }
  }

  onMounted(buscar)
</script>
