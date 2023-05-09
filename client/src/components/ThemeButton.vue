<template>
    <button @click="toggleTheme">
        <SunIcon class="w-6 h-6 dark:hidden" />
        <MoonIcon class="w-6 h-6 hidden dark:block" />
    </button>
</template>

<script lang="ts" setup>
import SunIcon from '@/icons/SunIcon.vue'
import MoonIcon from '@/icons/MoonIcon.vue'

function toggleTheme() {
    if (localStorage.getItem('theme') === 'dark') localStorage.setItem('theme', 'light');
    else localStorage.setItem('theme', 'dark');
    window.dispatchEvent(new Event('storage'));
}
</script>