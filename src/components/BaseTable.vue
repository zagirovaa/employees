<script>
    import { columnNames } from "../helpers.js";

    export default {
        computed: {
            columns() {
                return columnNames;
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
    <table
        class="table is-fullwidth is-bordered is-hoverable is-clickable
                has-sticky-header">
        <thead>
            <tr>
                <th
                    class="has-text-centered has-background-light"
                    :class="{ 'has-text-link': value === sortedColumn }"
                    :key="key"
                    v-for="(value, key) in columns"
                    @click="$emit('sort-column', value)">
                    <span>{{ key }}</span>
                    <template v-if="key !== 'N' && value === sortedColumn">
                        <span
                            class="material-icons"
                            v-if="direction === 'ASC'">
                            expand_more
                        </span>
                        <span class="material-icons" v-else>expand_less</span>
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
                <td>{{ index + 1 }}</td>
                <td>{{ employee.date_of_employment }}</td>
                <td>{{ employee.full_name }}</td>
                <td>{{ employee.job_title }}</td>
                <td>{{ employee.salary }}</td>
                <td>{{ employee.phone }}</td>
                <td>{{ employee.date_of_birth }}</td>
                <td>{{ employee.status }}</td>
            </tr>
        </tbody>
    </table>
</template>
