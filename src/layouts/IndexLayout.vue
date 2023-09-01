<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-img src="/public/icons/logo_app.jpeg" width="20px"/>
          Acueducto
        </q-toolbar-title>
        <q-btn flat :to="{ path: '/' }" icon="route"/>
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
</script>
