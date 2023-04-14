<template>
    <div class="h-screen flex flex-col items-center px-6 text-gray-700 dark:text-gray-300">
        <BoardComponent v-if="difficulty" :rowCount="difficulty.size" :columnCount="difficulty.size" :bombCount="difficulty.bombCount" :emoji="difficulty.emoji" />
        <div v-else class="max-w-sm my-auto text-center">
            <h2 class="mb-8 font-extrabold text-9xl text-gray-400 dark:text-gray-600">404</h2>
            <p class="text-2xl font-bold tracking-tight text-black md:text-3xl dark:text-white">Page not found</p>
            <p class="mt-4 mb-8">Sorry, it looks like the page you are looking for doesn't exist or has been moved.</p>
            <router-link to="/" class="px-5 py-2.5 font-semibold rounded bg-indigo-600 text-white dark:bg-indigo-400 dark:text-black">Go back home</router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import BoardComponent from '@/components/BoardComponent.vue'

const route = useRoute()
const difficulties = [
    {
        title: 'Easy',
        emoji: '😃',
        size: 5,
        bombCount: 3
    },
    {
        title: 'Medium',
        emoji: '🙂',
        size: 10,
        bombCount: 16
    },
    {
        title: 'Hard',
        emoji: '😐',
        size: 15,
        bombCount: 38
    },
    {
        title: 'Extreme',
        emoji: '😠',
        size: 20,
        bombCount: 66
    }
]
const difficulty = difficulties[route.query.difficulty as unknown as number]
</script>