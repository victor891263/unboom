<template>
    <div class="fixed bottom-0 left-0 w-full dark:bg-gray-900">
        <div class="bg-red-50 py-4 px-6 pt-3 dark:bg-red-900/50">
            <div class="grid grid-cols-[1.25rem_auto] items-start gap-2 text-red-700 dark:text-red-300">
                <div class="pt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <p>{{msg}}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
    msg: string
}>();
</script>