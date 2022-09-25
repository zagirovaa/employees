<script>
    import { Query } from "appwrite";
    import * as api from "../api.js";
    import conf from "../config.js";

    import BaseModal from "./BaseModal.vue";

    const DIGIT_CONDITIONS = ["=", "≠", ">", "<", "≥", "≤"];
    const BOOL_CONDITIONS = ["=", "≠"];
    const STATE_VALUES = ["Работает", "Уволен", "Уволился"];

    export default {
        components: { BaseModal },
        computed: {
            conditions() {
                this.selectedValue = "";
                switch (this.selectedField) {
                    case "Дата приема":
                        this.selectedCondition = DIGIT_CONDITIONS[0];
                        return DIGIT_CONDITIONS;
                        break;
                    case "Должность":
                        this.selectedCondition = BOOL_CONDITIONS[0];
                        this.selectValues = this.jobTitles;
                        this.selectedValue = this.selectValues[0];
                        return BOOL_CONDITIONS;
                        break;
                    case "Оклад":
                        this.selectedCondition = DIGIT_CONDITIONS[0];
                        return DIGIT_CONDITIONS;
                        break;
                    case "Статус":
                        this.selectedCondition = BOOL_CONDITIONS[0];
                        this.selectValues = STATE_VALUES;
                        this.selectedValue = this.selectValues[0];
                        return BOOL_CONDITIONS;
                        break;
                }
            },
            jobTitles() {
                return this.jobs.map(job => {
                    return job.name;
                });
            },
            inputType() {
                return this.selectedField === "Дата приема" ? "date" : "number";
            }
        },
        data() {
            return {
                fields: ["Дата приема", "Должность", "Оклад", "Статус"],
                filters: [],
                jobs: [],
                selectedField: "Дата приема",
                selectedCondition: "",
                selectedValue: "",
                selectValues: [],
                title: "Фильтрация"
            }
        },
        emits: ["close-modal", "reset-filter", "set-filter", "show-notify"],
        methods: {
            addFilter() {
                if (this.filters.length < conf.filters.count) {
                    if (this.selectedValue !== "") {
                        this.filters.push({
                            field: this.selectedField,
                            condition: this.selectedCondition,
                            value: this.selectedValue
                        });
                        this.selectedValue = "";
                    } else {
                        this.$emit("show-notify", {
                            text: "Обязательное поле не заполнено.",
                            type: "warning"
                        });
                    }
                } else {
                    this.$emit("show-notify", {
                        text: "Превышено максимальное количество фильтров.",
                        type: "warning"
                    });
                }
            },
            applyChanges() {
                if (this.filters.length > 0) {
                    this.$emit("set-filter", this.filters);
                    this.$emit("close-modal");
                } else {
                    this.$emit("show-notify", {
                        text: "Не добавлены необходимые фильтры.",
                        type: "warning"
                    })
                }
            },
            async getJobTitles() {
                const result = await api.database.listDocuments(
                    conf.collections.jobs,
                    [], 100, 0, undefined, "after", ["name"], ["ASC"]
                );
                if (result.total > 0) {
                    this.jobs = result.documents;
                } else {
                    this.$emit("show-notify", {
                        text: "Не удалось загрузить справочник должностей.",
                        type: "warning"
                    });
                }
            },
            resetFilter() {
                this.$emit("reset-filter");
                this.$emit("close-modal");
            }
        },
        mounted() {
            this.getJobTitles();
            this.filters = [...this.queries];
        },
        props: {
            queries: {
                required: true,
                type: Array
            }
        }
    }
</script>

<template>
    <BaseModal
        :title="title"
        @close-modal="$emit('close-modal')">
        <template v-slot:body>
            <section class="modal-card-body">
                <div class="field is-grouped">
                    <p class="control">
                        <span class="select is-fullwidth">
                            <select
                                v-model="selectedField">
                                <option
                                    :key="index"
                                    v-for="(field, index) in fields">
                                    {{ field }}
                                </option>
                            </select>
                        </span>
                    </p>
                    <p class="control">
                        <span class="select is-fullwidth">
                            <select
                                v-model="selectedCondition">
                                <option
                                    :key="index"
                                    v-for="(condition, index) in conditions">
                                    {{ condition }}
                                </option>
                            </select>
                        </span>
                    </p>
                    <p
                        class="control is-expanded"
                        v-if="this.selectedField === 'Должность' ||
                              this.selectedField === 'Статус'">
                        <span class="select is-fullwidth">
                            <select
                                v-model.trim="selectedValue">
                                <option
                                    :key="index"
                                    v-for="(value, index) in selectValues">
                                    {{ value }}
                                </option>
                            </select>
                        </span>
                    </p>
                    <p
                        class="control is-expanded"
                        v-else>
                        <input
                            class="input is-fullwidth"
                            :type="inputType"
                            v-model.trim="selectedValue">
                    </p>
                    <p class="control">
                        <button
                            class="button"
                            @click="addFilter">
                            <span class="icon material-icons">add</span>
                        </button>
                    </p>
                </div>
                <table
                    class="table is-bordered is-narrow is-fullwidth mt-4"
                    id="filter">
                    <thead>
                        <tr class="has-background-light">
                            <th class="has-text-centered">ПОЛЕ</th>
                            <th class="has-text-centered">УСЛОВИЕ</th>
                            <th class="has-text-centered">ЗНАЧЕНИЕ</th>
                            <th class="has-text-centered"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            :key="index"
                            v-for="(filter, index) in filters">
                            <td class="has-text-centered">
                                {{ filter.field }}
                            </td>
                            <td class="has-text-centered">
                                {{ filter.condition }}
                            </td>
                            <td class="has-text-centered">
                                {{ filter.value }}
                            </td>
                            <td class="has-text-centered">
                                <button
                                    class="button is-white"
                                    @click="filters.splice(index, 1)">
                                    <span class="icon material-icons">
                                        delete
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </template>
        <template v-slot:footer>
            <footer class="modal-card-foot">
                <button
                    class="button"
                    :disabled="queries.length === 0"
                    @click="resetFilter">
                    Сбросить
                </button>
                <button
                    class="button is-link"
                    :disabled="filters.length === 0"
                    @click="applyChanges">
                    Применить
                </button>
            </footer>
        </template>
    </BaseModal>
</template>