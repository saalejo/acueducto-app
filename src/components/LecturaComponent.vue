<template>
  <div class="q-pa-md" v-if="ruta && selected">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ ruta.vereda }}</div>
        <div class="text-subtitle2">{{ ruta.codigo }}</div>
        <div class="text-subtitle2">{{ ruta.fecha }}</div>
        <div class="text-subtitle2"></div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <div class="text-h6"></div>
          </div>
          <div class="col-4 q-pa-sm">
            <q-input outlined v-model="selected.consumo.ruta" label="Ruta" readonly/>
          </div>
          <div class="col-8 q-pa-sm">
            <q-select outlined v-model="sector" :options="sectores" label="Sector"/>
          </div>
          <div class="col-4 q-pa-sm">
            <q-input outlined v-model="selected.cliente.codcte" label="Codigo" readonly/>
          </div>
          <div class="col-8 q-pa-sm">
            <q-input outlined v-model="selected.cliente.nomcte" label="Nombre" readonly/>
          </div>
          <div class="col-4 q-pa-sm">
            <q-input outlined v-model="selected.cliente.estrato" label="Estrato" readonly/>
          </div>
          <div class="col-8 q-pa-sm">
            <q-input outlined v-model="selected.cliente.telcte" label="Telefono" readonly/>
          </div>
          <q-space/>
          <div class="col-4 q-pa-sm" @click="modal = true">
            <q-input outlined v-model="selected.consumo.lecant" label="Anterior lectura" readonly/>
          </div>
          <div class="col-8 q-pa-sm">
            <q-input mask="#####.#" outlined v-model="selected.lectura" label="Lectura"/>
          </div>
          <div class="col-12 q-pa-sm">
            <div v-if="consumo >= 0" class="text-subtitle2 float-right">
              Consumo: {{ consumo }}
            </div>
            <div v-else class="text-subtitle2 float-right text-red">
              Consumo: {{ consumo }}
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator dark />
      <q-card-actions align="right">
        <q-btn
          flat
          @click="siguiente(-1)"
          v-if="ruta.lecturas.indexOf(selected) > 0">
          Anterior
        </q-btn>
        <q-btn
          flat
          @click="siguiente(1)"
          v-if="ruta.lecturas.indexOf(selected) < ruta.lecturas.length - 1">
          Siguiente
        </q-btn>
        <q-btn
          flat
          @click="terminar()"
          v-if="ruta.lecturas.indexOf(selected) == ruta.lecturas.length - 1">
          Finalizar
        </q-btn>
      </q-card-actions>
    </q-card>
    <q-dialog v-model="modal"><historial-component :modal="modal"/></q-dialog>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">
            El consumo es nagativo!
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Continuar" color="primary" v-close-popup @click="next(dirTemp)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useRutaStore } from 'stores/ruta-store';
  import { useLecturaStore } from 'stores/lectura-store';
  import { useSectoresStore } from 'stores/sectores-store';
  import { api } from 'boot/axios';
  import HistorialComponent from 'components/HistorialComponent.vue';
  const modal = ref(false);
  const confirm = ref(false);
  const dirTemp = ref(1);
  const storeRuta = useRutaStore();
  const storeLectura = useLecturaStore();
  const storeSectores = useSectoresStore();
  const ruta = ref(computed(() => storeRuta.obtener));
  const selected = ref(computed(() => storeLectura.obtener));
  const sectores = ref(computed(() => storeSectores.obtener));
  const sector = ref(sectores.value[0]);
  const consumo = ref(computed(() => Number(selected.value.lectura) - Number(selected.value.consumo.lecant)));
  
  const compare = (a: any, b: any) => {
    if (a.consumo.sector < b.consumo.sector) {
      return -1;
    }
    if (a.consumo.sector > b.consumo.sector) {
      return 1;
    }
    return 0;
  }
  watch(sector, (value) => {
    const element = ruta.value.lecturas.find((e: any) => e.consumo.sector == sector.value);
    storeLectura.modificar(element);
  });

  const next = (direccion: number) => {
    const lectura = ruta.value.lecturas.find((l: any) => l.id == selected.value.id)
    const index = ruta.value.lecturas.indexOf(lectura);
    const nextElement = ruta.value.lecturas[index + direccion];
    storeRuta.modificar(ruta.value);
    storeLectura.modificar(nextElement || selected.value);
    sector.value = nextElement.consumo.sector;
  };

  const siguiente = (direccion: number) => {
    if (consumo.value < 1) {
      confirm.value = true;
      dirTemp.value = direccion;
    } else {
      next(direccion);
    }
  };

  const terminar = () => {
    const url = '/lecturas_guardar/'
    const abstract = (l: any) => {
      return { id: l.id, 'lectura': l.lectura }
    }
    const data = {
      ruta_id: ruta.value.id,
      lecturas: ruta.value.lecturas.map(abstract)
    }
    api.post(url, data).then((response: any) => {
      storeRuta.modificar(null);
      storeLectura.modificar(null);
    }).catch((error: any) => {
      console.log(error);
    });
  };
</script>
