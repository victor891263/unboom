<template>
    <div class="h-screen flex flex-col items-center px-6 text-gray-700 dark:text-gray-300">
        <BoardComponent :rowCount="difficulty.size" :columnCount="difficulty.size" :bombCount="difficulty.bombCount" :emoji="difficulty.emoji" />
    </div>
</template>

<script lang="ts" setup>
import BoardComponent from '@/components/BoardComponent.vue'
import {useRoute} from "vue-router";

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
const route = useRoute()
const difficulty = difficulties[route.query.difficulty]
</script>