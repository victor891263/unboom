<template>
    <div class="h-screen flex flex-col items-center px-6 text-gray-700 dark:text-gray-300">
        <BoardComponent v-if="rowCount && columnCount" :rowCount="rowCount" :columnCount="columnCount" :bombCount="bombCount" />
        <div v-else class="max-w-sm my-auto text-center">
            <h2 class="mb-5 font-extrabold text-9xl text-gray-400 dark:text-gray-600">404</h2>
            <p class="text-2xl font-bold tracking-tight text-black md:text-3xl dark:text-white">Page not found</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import BoardComponent from '@/components/BoardComponent.vue'

const route = useRoute()
const rowCount = Number(route.query.row as unknown as string)
const columnCount = Number(route.query.column as unknown as string)
const bombCount = Math.floor((rowCount * columnCount) / 6)
</script>