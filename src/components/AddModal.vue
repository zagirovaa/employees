<script>
    import { Query } from "appwrite";

    import { database } from "../api.js";
    import conf from "../config.js";
    import { getCurrentDate } from "../helpers.js";
    
    import BaseModal from "./BaseModal.vue";

    export default {
        components: { BaseModal },
        data() {
            return {
                employee: {
                    date_of_employment: getCurrentDate(),
                    full_name: "",
                    job_title: "",
                    salary: 0,
                    status: "Работает"
                },
                jobs: [],
                title: "Добавить"
            }
        },
        emits: ["close-modal"],
        methods: {
            async applyChanges() {
                if (this.employee.full_name !== "" &&
                    this.employee.salary > 0) {
                    await database.createDocument(
                        conf.global.databaseID,
                        conf.collections.employees,
                        "unique()",
                        JSON.stringify({
                            date_of_employment: this.employee.date_of_employment,
                            full_name: this.employee.full_name,
                            job_title: this.employee.job_title,
                            salary: this.employee.salary,
                            status: this.employee.status
                        })
                    );
                    this.$parent.updateData();
                    this.$emit("close-modal");
                    this.$root.showNotify({
                        text: "Добавлен новый сотрудник",
                        type: "success"
                    });
                } else {
                    this.$root.showNotify({
                        text: "Не все обязательные поля заполнены",
                        type: "warning"
                    });
                }
            },
            async getJobTitles() {
                const result = await database.listDocuments(
                    conf.global.databaseID,
                    conf.collections.jobs,
                    [Query.orderAsc("name")]
                );
                this.jobs = result.documents;
                this.employee.job_title = this.jobs[0].name;
            }
        },
        mounted() {
            this.getJobTitles();
            this.$refs.name.focus();
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
                            ref="name"
                            type="text"
                            v-model.trim="employee.full_name">
                    </p>
                </div>
                <div class="field is-grouped">
                    <p class="control is-expanded">
                        <label class="label">Должность:</label>
                        <span class="select is-fullwidth">
                            <select
                                v-model.trim="employee.job_title">
                                <option
                                    :key="index"
                                    :value="job.name"
                                    v-for="(job, index) in jobs">
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
            </section>
        </template>
        <template v-slot:footer>
            <footer class="modal-card-foot">
                <button
                    class="button is-link"
                    @click="applyChanges">
                    Применить
                </button>
            </footer>
        </template>
    </BaseModal>
</template>