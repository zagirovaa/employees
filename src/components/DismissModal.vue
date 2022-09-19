<script>
    import { database } from "../api.js"
    import conf from "../config.js";
    import { getCurrentDate } from "../helpers.js"

    import BaseModal from "./BaseModal.vue"

    export default {
        components: { BaseModal },
        data() {
            return {
                reasons: [],
                employee: {},
                title: "Уволить"
            }
        },
        emits: ["close-modal", "show-notify"],
        methods: {
            async applyChanges() {
                if (this.employee.reason_for_dismissal !== "") {
                    await database.updateDocument(
                        conf.collections.employees,
                        this.employee.$id,
                        JSON.stringify(this.employee)
                    );
                    this.$emit("close-modal");
                    this.$emit("show-notify", {
                        text: "Сотрудник уволен.",
                        type: "success"
                    });
                } else {
                    this.$emit("show-notify", {
                        text: "Обязательное поле не заполнено.",
                        type: "warning"
                    });
                }
            },
            async getDismissReasons() {
                const result = await database.listDocuments(
                    conf.collections.reasons,
                    [], 100, 0, "", "after", ["name"], ["ASC"]
                );
                if (result.total > 0) {
                    this.reasons = result.documents;
                    if (this.reasons.length > 0) {
                        this.employee.reason_for_dismissal = this.reasons[0].name;
                    }
                } else {
                    this.$emit("show-notify", {
                        text: "Не удалось загрузить справочник причин.",
                        type: "warning"
                    });
                }
            }
        },
        mounted() {
            this.employee = this.document;
            this.employee.date_of_dismissal = getCurrentDate();
            this.employee.reason_for_dismissal = "";
            this.employee.status = "Уволился";
            this.getDismissReasons();
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
                        <label class="label">Дата увольнения:</label>
                        <input
                            class="input"
                            type="date"
                            v-model="employee.date_of_dismissal">
                    </p>
                    <p class="control is-expanded">
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
                    <label class="label">Причина увольнения:</label>
                    <p class="control is-expanded">
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
            <footer
                class="modal-card-foot">
                <button
                    class="button is-link"
                    @click="applyChanges">
                    Применить
                </button>
            </footer>
        </template>
    </BaseModal>
</template>