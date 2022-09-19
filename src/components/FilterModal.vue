<script>
    import { Query } from "appwrite";
    import { database } from "../api.js";
    import conf from "../config.js";

    import BaseModal from "./BaseModal.vue";

    const DIGIT_CONDITIONS = ["=", "≠", ">", "<", "≥", "≤"];
    const BOOL_CONDITIONS = ["Равно", "Не равно"];
    const TEXT_CONDITIONS = [
        "Равно",
        "Не равно",
        "Начинается",
        "Заканчивается",
        "Содержит",
        "Не содержит"
    ];

    export default {
        components: { BaseModal },
        computed: {
            conditions() {
                switch (this.selectedField) {
                    case "Дата приема":
                        this.selectedCondition = DIGIT_CONDITIONS[0];
                        return DIGIT_CONDITIONS;
                        break;
                    case "ФИО":
                        this.selectedCondition = TEXT_CONDITIONS[0];
                        return TEXT_CONDITIONS;
                        break;
                    case "Должность":
                        this.selectedCondition = BOOL_CONDITIONS[0];
                        return BOOL_CONDITIONS;
                        break;
                    case "Оклад":
                        this.selectedCondition = DIGIT_CONDITIONS[0];
                        return DIGIT_CONDITIONS;
                        break;
                    case "Статус":
                        this.selectedCondition = BOOL_CONDITIONS[0];
                        return BOOL_CONDITIONS;
                        break;
                }
            }
        },
        data() {
            return {
                fields: ["Дата приема", "ФИО", "Должность", "Оклад", "Статус"],
                filters: [],
                selectedField: "Дата приема",
                selectedCondition: "",
                selectedValue: "",
                title: "Фильтрация"
            }
        },
        emits: ["close-modal", "show-notify"],
        methods: {
            addFilter() {
                if (this.selectedValue !== "") {
                    const filter = {
                        field: this.selectedField,
                        condition: this.selectedCondition,
                        value: this.selectedValue
                    };
                    this.filters.push(filter);
                    this.selectedValue = "";
                } else {
                    this.$emit("show-notify", {
                        text: "Обязательное поле не заполнено.",
                        type: "warning"
                    })
                }
            },
            applyChanges() {
                this.$emit("close-modal");
            },
            deleteFilter(index) {

            },
            resetFilter() {

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
                    <p class="control is-expanded">
                        <input
                            class="input is-fullwidth"
                            type="text"
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
                <button class="button" @click="resetFilter">
                    Сбросить
                </button>
                <button class="button is-link" @click="applyChanges">
                    Применить
                </button>
            </footer>
        </template>
    </BaseModal>
</template>