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
        emits: ["close-modal", "reset-search", "set-search"],
        methods: {
            applyChanges() {
                this.$emit("set-search", this.searchedText);
                this.$parent.updateData();
                this.$emit("close-modal");
            },
            resetSearch() {
                this.$emit("reset-search");
                this.$parent.updateData();
                this.$emit("close-modal");
            }
        },
        mounted() {
            this.searchedText = this.text;
            this.$refs.name.focus();
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
                        ref="name"
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