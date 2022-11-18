<script>
    import conf from "../config.js";

    import BaseModal from "./BaseModal.vue";

    export default {
        components: { BaseModal },
        data() {
            return {
                countNumbers: [5, 10, 15, 20, 25, 50, 100],
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
                rowsCount: 0,
                title: "Настройки"
            }
        },
        emits: ["change-limit", "close-modal"],
        methods: {
            async applyChanges() {
                localStorage.setItem("holidays", JSON.stringify(this.holidays));
                localStorage.setItem(
                    "records",
                    JSON.stringify(this.rowsCount)
                );
                this.$emit("change-limit", this.rowsCount);
                this.$emit("close-modal");
                this.$root.showNotify({
                    text: "Настройки сохранены",
                    type: "success"
                });
            },
            changeHoliday(day) {
                if (this.holidays.includes(day)) {
                    this.holidays.splice(this.holidays.indexOf(day), 1);
                } else {
                    this.holidays.push(day);
                }
            },
            getHolidays() {
                return JSON.parse(
                    localStorage.getItem("holidays")
                ) || conf.settings.holidays || [];
            },
            getRowsCount() {
                return JSON.parse(
                    localStorage.getItem("records")
                ) || conf.settings.records || 20;
            }
        },
        mounted() {
            this.holidays = this.getHolidays();
            this.rowsCount = this.getRowsCount();
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
                <label class="label mt-5">
                    Количество записей:
                </label>
                <div class="field is-grouped">
                    <div
                        class="control"
                        :key="index"
                        v-for="(count, index) in countNumbers">
                        <div class="tags has-addons">
                            <span
                                class="tag is-clickable"
                                :class="{ 'is-dark': rowsCount === count }"
                                @click="rowsCount = count">
                                {{ count }}
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