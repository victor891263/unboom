<template>
    <div class="overflow-x-auto rounded border border-gray-300 dark:border-gray-700">
        <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead class="bg-gray-100 dark:bg-gray-800">
                <tr class="animate-pulse text-gray-500 text-sm">
                    <th class="whitespace-nowrap p-3.5 font-normal text-left"><div class="w-12 h-4 bg-gray-300 dark:bg-gray-600"/></th>
                    <th class="whitespace-nowrap p-3.5 font-normal text-left"><div class="w-16 h-4 bg-gray-300 dark:bg-gray-600"/></th>
                    <th class="whitespace-nowrap p-3.5 font-normal text-left"><div class="w-14 h-4 bg-gray-300 dark:bg-gray-600"/></th>
                </tr>
            </thead>
                <tbody class="divide-y divide-gray-300 dark:divide-gray-700">
                    <tr v-for="(a, i) in arr" class="animate-pulse" :key="i">
                        <td class="whitespace-nowrap px-3.5 py-4 text-indigo-600 dark:text-indigo-400"><div class="w-40 h-5 bg-gray-200 dark:bg-gray-700"/></td>
                        <td class="whitespace-nowrap px-3.5 py-4 text-indigo-600 dark:text-indigo-400"><div class="w-14 h-5 bg-gray-200 dark:bg-gray-700"/></td>
                        <td class="whitespace-nowrap px-3.5 py-4"><div class="w-28 h-5 bg-gray-200 dark:bg-gray-700"/></td>
                    </tr>
                </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import createArray from "@/logic/createArray";
const arr = createArray(6)
</script>