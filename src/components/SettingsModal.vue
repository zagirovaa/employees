<script>
    import conf from "../config.js";
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
                title: "Настройки"
            }
        },
        emits: ["close-modal"],
        methods: {
            async applyChanges() {
                localStorage.setItem("holidays", JSON.stringify(this.holidays));
                this.$emit("close-modal");
                this.$root.showNotify({
                    text: "Настройки сохранены",
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
            getHolidays() {
                return JSON.parse(
                    localStorage.getItem("holidays")
                ) || conf.settings.holidays || [];
            }
        },
        mounted() {
            this.holidays = this.getHolidays();
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