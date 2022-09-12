<script>
    export default {
        data() {
            return {
                columns: {
                    "": "",
                    "Дата приема": "date_of_employment",
                    "ФИО": "full_name",
                    "Должность": "job_title",
                    "Оклад": "salary",
                    "Статус": "status"
                }
            }
        },
        emits: ["row-click", "sort-column"],
        props: {
            direction: String,
            employees: Array,
            selectedRow: [Number, String],
            sortColumn: String
        }
    }
</script>

<template>
    <table class="table is-fullwidth is-bordered is-hoverable">
        <thead class="has-background-light">
            <tr>
                <th
                    class="has-text-centered"
                    :class="{ 'has-text-link': value == sortColumn }"
                    :key="key"
                    v-for="(value, key) in columns"
                    @click="$emit('sort-column', key)">
                    <span>{{ key }}</span>
                    <template v-if="key !== '' && value === sortColumn">
                        <span class="ml-2" v-if="direction == 'ASC'">⮟</span>
                        <span class="ml-2" v-else>⮝</span>
                    </template>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr
                class="has-text-centered"
                :class="{
                    'has-text-white': selectedRow == index,
                    'has-background-link': selectedRow == index
                }"
                :key="employee.$id"
                v-for="(employee, index) in employees"
                @click="$emit('row-click', index)">
                <td
                    class="has-text-weight-bold">
                    <span class="tag is-light is-link">
                        {{ index + 1 }}
                    </span>
                </td>
                <td>{{ employee.date_of_employment }}</td>
                <td>{{ employee.full_name }}</td>
                <td>{{ employee.job_title }}</td>
                <td>{{ employee.salary }}</td>
                <td>{{ employee.status }}</td>
            </tr>
        </tbody>
    </table>
</template>