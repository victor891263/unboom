<template>
    <div class="fixed bottom-4 right-4 w-72 border rounded-lg p-6 bg-white dark:border-gray-700 dark:bg-gray-900">

        <div class="relative">
            <input class="w-full bg-gray-800 outline-0 rounded py-2 px-3 focus:border-indigo-600 dark:focus:border-indigo-400 dark:border-gray-700 dark:placeholder:text-gray-600" type="text" name="name" placeholder="What's your name?" />
            <div class="absolute top-0 right-0 h-full flex items-center pr-2">
                <button class="">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {defineProps} from "vue";

const props = defineProps<{
    closeBox: () => void
}>()
</script>