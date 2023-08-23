<template>
  <div>
    <q-btn
      flat
      dense
      round
      icon="settings"
      aria-label="Configuracion"
      @click="modal = true"
      title="Configuracion"
    />
    <q-dialog v-model="modal" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="text-h6">Configuracion</span>
        </q-card-section>
        <q-card-section class="items-center">
          <div class="row">
            <div class="col q-pa-sm">
              <q-input outlined v-model="configuracion.api_uri" label="Api uri" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" v-close-popup @click="save"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useConfiguracionStore } from 'stores/configuracion-store';
  const store = useConfiguracionStore();
  const modal = ref(false);
  const configuracion = ref(computed(() => store.obtener));
  const save = () => {
    store.modificar(configuracion.value);
    window.location.reload();
  }

</script>
