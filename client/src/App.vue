<template>
    <router-view/>
</template>

<script lang="ts" setup>
import initTheme from '@/logic/theme'
initTheme()
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    * {
        -webkit-font-smoothing: antialiased;
    }
}
</style>