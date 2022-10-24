<script>
    import { sortColumns } from "../helpers.js";

    export default {
        computed: {
            columns() {
                return sortColumns;
            }
        },
        emits: ["row-click", "sort-column"],
        props: {
            direction: {
                required: true,
                type: String
            },
            employees: {
                required: true,
                type: Array
            },
            selectedRow: {
                required: true,
                type: [Number, String]
            },
            sortedColumn: {
                required: true,
                type: String
            }
        }
    }
</script>

<template>
    <table class="table is-fullwidth is-bordered is-hoverable">
        <thead class="has-background-light">
            <tr>
                <th
                    class="has-text-centered"
                    :class="{ 'has-text-link': value === sortedColumn }"
                    :key="key"
                    v-for="(value, key) in columns"
                    @click="$emit('sort-column', key)">
                    <span>{{ key }}</span>
                    <template v-if="key !== '' && value === sortedColumn">
                        <span class="ml-2" v-if="direction === 'ASC'">⮟</span>
                        <span class="ml-2" v-else>⮝</span>
                    </template>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr
                class="has-text-centered"
                :class="{
                    'has-text-white': selectedRow === index,
                    'has-background-link': selectedRow === index
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