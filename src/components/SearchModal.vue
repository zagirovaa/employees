<script>
    import BaseModal from "./BaseModal.vue";

    export default {
        components: { BaseModal },
        data() {
            return {
                searchedText: "",
                title: "Поиск"
            }
        },
        emits: ["close-modal", "reset-search", "set-search", "show-notify"],
        methods: {
            applyChanges() {
                if (this.searchedText !== "") {
                    this.$emit("set-search", this.searchedText);
                    this.$emit("close-modal");
                } else {
                    this.$emit("show-notify", {
                        text: "Не задана искомая строка.",
                        type: "warning"
                    });
                }
            },
            resetSearch() {
                this.$emit("reset-search");
                this.$emit("close-modal");
            }
        },
        mounted() {
            this.searchedText = this.text
        },
        props: {
            text: {
                required: true,
                type: String
            }
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
                <p class="control">
                    <label class="label">
                        Введите искомые слова:
                    </label>
                    <input
                        class="input"
                        type="text"
                        v-model.trim="searchedText">
                </p>
            </section>
        </template>
        <template v-slot:footer>
            <footer class="modal-card-foot">
                <button
                    class="button"
                    :disabled="text === ''"
                    @click="resetSearch">
                    Сбросить
                </button>
                <button
                    class="button is-link"
                    :disabled="searchedText === ''"
                    @click="applyChanges">
                    Применить
                </button>
            </footer>
        </template>
    </BaseModal>
</template>