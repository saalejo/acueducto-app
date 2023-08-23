<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Acueducto
        </q-toolbar-title>
        <busqueda-component/>
        <configuracion-component/>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ConfiguracionComponent from 'components/ConfiguracionComponent.vue';
import BusquedaComponent from 'components/BusquedaComponent.vue';
</script>
