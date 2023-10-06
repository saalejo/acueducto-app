<template>
  <div v-if="selected">
    <q-card>
      <q-card-section class="items-center">
        <div class="row">
          <div class="q-pa-md">
            <q-list bordered separator>
              <q-item clickable v-ripple>
                <q-item-section class="text-h6">Historial consumo</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ selected.consumo.conenero }}</q-item-label>
                  <q-item-label caption>Enero</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ selected.consumo.confebrero }}</q-item-label>
                  <q-item-label caption>Febrero</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ selected.consumo.conmarzo }}</q-item-label>
                  <q-item-label caption>Marzo</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ selected.consumo.conabril }}</q-item-label>
                  <q-item-label caption>Abril</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ selected.consumo.conmayo }}</q-item-label>
                  <q-item-label caption>Mayo</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ selected.consumo.conjunio }}</q-item-label>
                  <q-item-label caption>Junio</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ selected.consumo.conjulio }}</q-item-label>
                  <q-item-label caption>Julio</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ selected.consumo.conagosto }}</q-item-label>
                  <q-item-label caption>Agosto</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ selected.consumo.conseptiem }}</q-item-label>
                  <q-item-label caption>Septiembre</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ selected.consumo.conoctubre }}</q-item-label>
                  <q-item-label caption>Octubre</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ selected.consumo.connoviemb}}</q-item-label>
                  <q-item-label caption>Noviembre</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ selected.consumo.condiciemb }}</q-item-label>
                  <q-item-label caption>Diciembre</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Aceptar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useLecturaStore } from 'stores/lectura-store';
  const storeLectura = useLecturaStore();
  const selected = ref(computed(() => storeLectura.obtener));
</script>
