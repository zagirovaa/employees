<script>
    import { database } from "../api.js";
    import { getHolidays } from "../api.js";
    import { getSettingID } from "../api.js";
    import { SETS_COL_ID } from "../api.js";

    import BaseModal from "./BaseModal.vue";

    export default {
        components: { BaseModal },
        data() {
            return {
                days: [
                    "Понедельник",
                    "Вторник",
                    "Среда",
                    "Четверг",
                    "Пятница",
                    "Суббота",
                    "Воскресение"
                ],
                holidays: [],
                settings: {},
                title: "Настройки"
            }
        },
        emits: ["close-modal", "show-notify"],
        methods: {
            async applyChanges() {
                await this.saveHolidays();
                this.$emit("close-modal");
                this.$emit("show-notify",  {
                    text: "Настройки сохранены.",
                    type: "success"
                });
            },
            changeHoliday(day) {
                if (this.holidays.includes(day)) {
                    const index = this.holidays.indexOf(day);
                    this.holidays.splice(index, 1);
                } else {
                    this.holidays.push(day);
                }
            },
            async getSettings() {
                this.holidays = await getHolidays();
            },
            async saveHolidays() {
                const document_id = await getSettingID("holidays");
                if (document_id) {
                    await database.updateDocument(
                        SETS_COL_ID,
                        document_id,
                        {
                            value: this.holidays.join(",")
                        }
                    );
                }
            }
        },
        mounted() {
            this.getSettings();
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
                <label class="label">Выходные дни:</label>
                <div class="field is-grouped">
                    <div
                        class="control"
                        :key="index"
                        v-for="(day, index) in days">
                        <div class="tags has-addons">
                            <span
                                class="tag is-clickable"
                                :class="{ 'is-dark': holidays.includes(day) }"
                                @click="changeHoliday(day)">
                                {{ day }}
                            </span>
                        </div>
                    </div>
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