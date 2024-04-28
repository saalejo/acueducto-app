<template>
  <div class="q-pa-md" v-if="ruta && selected">
    <q-card>
      <q-card-section>
        <div class="row">
          <div class="col-6 text-h6">
            {{ ruta.vereda }}
          </div>
          <div class="col-6 text-subtitle2">
            Avance:
            {{ ((avance.length / ruta.lecturas.length) * 100).toFixed(2) }}%
          </div>
          <div class="col-6 text-subtitle2">
            {{ ruta.fecha }}
          </div>
          <div class="col-6 text-subtitle2">
            Terminado: {{ avance.length }} / {{ ruta.lecturas.length }}
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <div class="text-h6"></div>
          </div>
          <div class="col-4 q-pa-sm">
            <q-input
              outlined
              v-model="selected.consumo.ruta"
              label="Ruta"
              readonly
            />
          </div>
          <div class="col-8 q-pa-sm">
            <q-select
              outlined
              v-model="sector"
              :options="sectores"
              label="Sector"
            />
          </div>
          <template v-if="selected.cliente">
            <div class="col-4 q-pa-sm">
              <q-input
                outlined
                v-model="selectedCode"
                :value="selected.cliente.codcte"
                label="Codigo"
                @change="buscarUsuario"
              />
            </div>
            <div class="col-8 q-pa-sm">
              <q-input
                outlined
                v-model="selected.cliente.nomcte"
                label="Nombre"
                readonly
              />
            </div>
            <div class="col-4 q-pa-sm">
              <q-input
                outlined
                v-model="selected.cliente.estrato"
                label="Estrato"
                readonly
              />
            </div>
            <div class="col-8 q-pa-sm">
              <q-input
                outlined
                v-model="selected.cliente.telcte"
                label="Telefono"
                readonly
              />
            </div>
            <div class="col-12 q-pa-sm">
              <q-input
                outlined
                v-model="selected.observacion"
                label="Observaciones"
              />
            </div>
          </template>
          <q-space />
          <div class="col-4 q-pa-sm" @click="modal = true">
            <q-input
              outlined
              v-model="selected.consumo.lecact"
              label="Anterior lectura"
            />
          </div>
          <div class="col-8 q-pa-sm">
            <q-input
              type="number"
              outlined
              v-model="selected.lectura"
              label="Lectura"
            />
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
        <q-btn flat @click="confirmEnd = true"> Terminar </q-btn>
        <q-btn flat @click="confirmSave = true"> Enviar </q-btn>
        <q-btn
          flat
          @click="siguiente(-1)"
          v-if="ruta.lecturas.indexOf(selected) > 0"
        >
          Anterior
        </q-btn>
        <q-btn
          flat
          @click="siguiente(1)"
          v-if="ruta.lecturas.indexOf(selected) < ruta.lecturas.length - 1"
        >
          Siguiente
        </q-btn>
      </q-card-actions>
    </q-card>
    <q-dialog v-model="modal"><historial-component :modal="modal" /></q-dialog>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm"> El consumo es nagativo! </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Continuar"
            color="primary"
            v-close-popup
            @click="next(dirTemp)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmSave">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="info" color="primary" text-color="white" />
          <span class="q-ml-sm"> ENVIAR LECTURAS QUE SE HAN REGISTRADO </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="secondary" v-close-popup />
          <q-btn
            flat
            label="Enviar"
            color="primary"
            v-close-popup
            @click="guardar()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmEnd">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">
            ¿ESTA SEGURO DE TERMINAR Y HACER CIERRE DE LECTURAS?
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="secondary" v-close-popup />
          <q-btn
            flat
            label="Terminar"
            color="primary"
            v-close-popup
            @click="guardar(true)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRutaStore } from 'stores/ruta-store';
import { useLecturaStore } from 'stores/lectura-store';
import { useSectoresStore } from 'stores/sectores-store';
import { api } from 'boot/axios';
import HistorialComponent from 'components/HistorialComponent.vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useRutasStore } from 'src/stores/rutas-store';
import { errorMessage } from 'src/boot/messages';

const $q = useQuasar();
const router = useRouter();
const modal = ref(false);
const confirm = ref(false);
const confirmSave = ref(false);
const confirmEnd = ref(false);
const dirTemp = ref(1);
const storeRuta = useRutaStore();
const storeRutas = useRutasStore();
const storeLectura = useLecturaStore();
const storeSectores = useSectoresStore();
const ruta = ref(computed(() => storeRuta.obtener));
const rutas = ref(computed(() => storeRutas.obtener));
const selected = ref(computed(() => storeLectura.obtener));
const sectores = ref(computed(() => storeSectores.obtener));
const selectedCode = ref('');
const sector = ref(sectores.value[0]);
const consumo = ref(
  computed(
    () => Number(selected.value.lectura) - Number(selected.value.consumo.lecact)
  )
);

onMounted(() => {
  if (Array.isArray(ruta.value)) {
    router.push({ path: '/' });
  }
  selectedCode.value = selected.value.cliente.codcte;
});

watch(sector, () => {
  const element = ruta.value.lecturas.find(
    (e: any) => e.consumo.sector == sector.value
  );
  storeLectura.modificar(element);
});

const avance = ref(
  computed(() => {
    if (ruta.value) {
      return ruta.value.lecturas.filter(
        (e: any) =>
          typeof Number(e.lectura) == 'number' && Number(e.lectura) > 0
      );
    } else {
      return 0;
    }
  })
);

const next = (direccion: number) => {
  const lectura = ruta.value.lecturas.find(
    (l: any) => l.id == selected.value.id
  );
  const index = ruta.value.lecturas.indexOf(lectura);
  const nextElement = ruta.value.lecturas[index + direccion];
  ruta.value.next = nextElement;
  storeRuta.modificar(ruta.value);
  storeLectura.modificar(nextElement || selected.value);
  sector.value = nextElement.consumo.sector;
  selectedCode.value = nextElement.cliente.codcte;
};

const siguiente = (direccion: number) => {
  if (consumo.value < 0) {
    confirm.value = true;
    dirTemp.value = direccion;
  } else {
    next(direccion);
  }
};

const buscarUsuario = () => {
  const lectura = ruta.value.lecturas.find(
    (l: any) => l.cliente && l.cliente.codcte == selectedCode.value
  );
  if (lectura) {
    storeLectura.modificar(lectura);
    storeRuta.modificar(ruta.value);
    sector.value = lectura.consumo.sector;
  }
};

const guardar = (terminar = false) => {
  if (ruta.value) {
    $q.loading.show();
    const url = '/guardar_ruta/';
    const abstract = (l: any) => {
      return {
        id: l.id,
        lectura: l.lectura,
        lectura_anterior: l.consumo.lecact,
        observacion: l.observacion,
      };
    };
    const data = {
      terminar: terminar,
      ruta_id: ruta.value.id,
      lecturas: ruta.value.lecturas.map(abstract),
    };
    api
      .post(url, data)
      .then((response: any) => {
        if (terminar) {
          console.log(response);
          storeRuta.modificar(null);
          storeLectura.modificar(null);
          router.push({ path: '/ruta' });
        }
      })
      .catch(() => {
        $q.notify(errorMessage);
      })
      .finally(() => {
        $q.loading.hide();
      });
  }
};
</script>
