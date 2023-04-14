<template>
    <div class="fixed top-0 left-0 w-full h-full bg-white dark:bg-gray-900">
        <div class="p-6 flex flex-col h-full">
            <div class="max-w-sm w-full my-auto mx-auto">
                <h1 class="text-2xl font-bold tracking-tight text-black dark:text-white">Submit score</h1>
                <div class="mt-6 text-sm">Name</div>
                <input class="mt-2 w-full bg-transparent outline-0 rounded border py-2 px-3 focus:border-indigo-600 dark:focus:border-indigo-400 dark:border-gray-700 dark:placeholder:text-gray-600" type="text" name="name" placeholder="Must be unique" />
                <div class="mt-4 text-sm">Duration</div>
                <div class="mt-2 w-full bg-gray-100 text-gray-500 rounded border py-2 px-3 dark:bg-gray-800 dark:border-gray-700">06:52</div>
                <div class="mt-8 w-full flex gap-2">
                    <button class="bg-indigo-600 text-white font-semibold py-2 px-3 rounded dark:bg-indigo-400 dark:text-black">Submit</button>
                    <button @click="closeBox" class="bg-indigo-100 text-indigo-600 font-semibold py-2 px-3 rounded dark:bg-gray-800 dark:text-indigo-400">Discard</button>
                </div>
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