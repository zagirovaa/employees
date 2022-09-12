<script>
    import { database } from "../api.js";
    import { EMPLOYEES_COL_ID } from "../api.js";
    import { JOBS_COL_ID } from "../api.js";
    import { REASONS_COL_ID } from "../api.js";

    import { getCurrentDate } from "../helpers.js";

    import BaseModal from "./BaseModal.vue";

    export default {
        components: { BaseModal },
        computed: {
            isDismissed() {
                return ["Уволен", "Уволился"].includes(this.employee.status);
            }
        },
        data() {
            return {
                employee: {},
                jobs: [],
                mainTabIsActive: true,
                reasons: [],
                title: "Изменить",
            }
        },
        emits: ["close-modal", "show-notify"],
        methods: {
            async applyChanges() {
                if (
                    this.employee.full_name !== "" &&
                    this.employee.salary > 0 &&
                    this.employee.job_title !== "") {
                    await database.updateDocument(
                        EMPLOYEES_COL_ID,
                        this.employee.$id,
                        JSON.stringify(this.employee)
                    );
                    this.$emit("close-modal");
                    this.$emit(
                        "show-notify",
                        {
                            text: "Данные сотрудника изменены.",
                            type: "success"
                        }
                    )
                } else {
                    this.$emit(
                        "show-notify",
                        {
                            text: "Не все обязательные поля заполнены.",
                            type: "warning"
                        }
                    )
                }
            },
            async getJobTitles() {
                const result = await database.listDocuments(
                    JOBS_COL_ID, [], 100, 0, "", "after", ["name"], ["ASC"]
                );
                if (result.total > 0) {
                    this.jobs = result.documents;
                } else {
                    this.$emit(
                        "show-notify",
                        {
                            text: "Не удалось загрузить справочник должностей.",
                            type: "warning"
                        }
                    )
                }
            },
            async getDismissReasons() {
                const result = await database.listDocuments(
                    REASONS_COL_ID, [], 100, 0, "", "after", ["name"], ["ASC"]
                );
                if (result.total > 0) {
                    this.reasons = result.documents;
                } else {
                    this.$emit(
                        "show-notify",
                        {
                            text: "Не удалось загрузить справочник причин.",
                            type: "warning"
                        }
                    )
                }
            }
        },
        mounted() {
            this.getJobTitles();
            this.getDismissReasons();
            this.employee = this.document;
        },
        props: {
            document: Object
        }
    }
</script>

<template>
    <BaseModal
        :title="title"
        @apply-changes="applyChanges"
        @close-modal="$emit('close-modal')">
        <template v-slot:body>
            <section class="modal-card-body">
                <div class="field is-grouped">
                    <p class="control">
                        <label class="label">Дата приема:</label>
                        <input
                            class="input"
                            type="date"
                            v-model="employee.date_of_employment">
                    </p>
                    <p class="control is-expanded">
                        <label class="label">ФИО:</label>
                        <input
                            class="input is-fullwidth"
                            type="text"
                            v-model.trim="employee.full_name">
                    </p>
                </div>
                <div class="field is-grouped">
                    <p class="control is-expanded">
                        <label class="label">Должность:</label>
                        <span class="select is-fullwidth">
                            <select
                                v-model="employee.job_title">
                                <option
                                    :key="job.$id"
                                    :value="job.name"
                                    v-for="job in jobs">
                                    {{ job.name }}
                                </option>
                            </select>
                        </span>
                    </p>
                    <p class="control">
                        <label class="label">Оклад:</label>
                        <input
                            class="input"
                            type="number"
                            v-model="employee.salary">
                    </p>
                </div>
                <div class="field">
                    <label class="label">Паспорт:</label>
                    <p class="control">
                        <input
                            class="input"
                            type="text"
                            v-model.trim="employee.passport">
                    </p>
                </div>
                <div class="field">
                    <label class="label">Адрес:</label>
                    <p class="control">
                        <input
                            class="input"
                            type="text"
                            v-model.trim="employee.address">
                    </p>
                </div>
                <div
                    class="field is-grouped"
                    :class="{ 'mb-0': !isDismissed }">
                    <p class="control">
                        <label class="label">Дата рождения:</label>
                        <input
                            class="input"
                            type="date"
                            v-model="employee.date_of_birth">
                    </p>
                    <p class="control is-expanded">
                        <label class="label">Телефон:</label>
                        <input
                            class="input is-fullwidth"
                            type="number"
                            v-model="employee.phone">
                    </p>
                </div>
                <div class="field is-grouped">
                    <p class="control" v-if="isDismissed">
                        <label class="label">Дата увольнения:</label>
                        <input
                            class="input"
                            type="date"
                            v-model="employee.date_of_dismissal">
                    </p>
                    <p class="control is-expanded" v-if="isDismissed">
                        <label class="label">Статус:</label>
                        <span class="select is-fullwidth">
                            <select
                                v-model="employee.status">
                                <option value="Уволился" selected>
                                    Уволился
                                </option>
                                <option value="Уволен">
                                    Уволен
                                </option>
                            </select>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control is-expanded" v-if="isDismissed">
                        <label class="label">Причина увольнения:</label>
                        <span class="select is-fullwidth">
                            <select
                                v-model="employee.reason_for_dismissal">
                                <option
                                    :key="reason.$id"
                                    :value="reason.name"
                                    v-for="reason in reasons">
                                    {{ reason.name }}
                                </option>
                            </select>
                        </span>
                    </p>
                </div>
            </section>
        </template>
        <template v-slot:footer>
            <footer class="modal-card-foot">
                <button class="button is-link" @click="applyChanges">
                    Применить
                </button>
            </footer>
        </template>
    </BaseModal>
</template>