<template>
    <router-view/>
</template>

<script lang="ts" setup>
import initTheme from '@/logic/theme'
initTheme()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
    font-family: 'Lato', sans-serif;
    -webkit-font-smoothing: antialiased;
}
</style>