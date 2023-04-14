<template>
    <div class="h-screen flex flex-col items-center px-6 text-gray-700 dark:text-gray-300">
        <div class="max-w-xl w-full h-screen flex flex-col justify-center">
            <h1 class="mb-5 text-center font-bold text-2xl text-black dark:text-white">Leaderboard</h1>
            <div id="scoreboard" class="overflow-auto rounded-md border border-gray-200 dark:border-gray-700">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th v-for="(k, index) in Object.keys(scores[0])" class="whitespace-nowrap px-4 py-2.5 text-left font-normal capitalize text-gray-500 dark:text-gray-400" :key="index">{{ k }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="(s, index) in scores" :key="index">
                            <td v-for="(v, index) in Object.values(s)" class="whitespace-nowrap px-4 py-3" :class="index === 0 && 'font-semibold'" :key="index">{{ v }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="mt-6 flex items-center justify-center gap-3">
                <ThemeButton />
                <a>
                    <svg class="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z"></path></svg>
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ThemeButton from "@/components/ThemeButton.vue"
const scores = [
    {
        name: 'xxREAPERxx',
        duration: '03:47',
        difficulty: '😠',
        date: new Date(2023, 2, 21).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    },
    {
        name: 'Steve80349',
        duration: '06:29',
        difficulty: '😠',
        date: new Date(2023, 2, 25).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    },
    {
        name: 'rapperkaunglay',
        duration: '07:11',
        difficulty: '😠',
        date: new Date(2023, 2, 19).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    }
]
</script>

<style>
#scoreboard::-webkit-scrollbar {
    height: 0;
    width: 0;
}
</style>