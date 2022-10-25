<script>
    import { Query } from "appwrite";
    import { database } from "../api.js";
    import conf from "../config.js";
    import BaseModal from "./BaseModal.vue";

    export default {
        components: { BaseModal },
        computed: {
            collection() {
                switch (this.type) {
                    case "jobs":
                        return conf.collections.jobs;
                        break;
                    case "reasons":
                        return conf.collections.reasons;
                        break;
                }
            }
        },
        data() {
            return {
                currentCatalog: {}
            }
        },
        emits: ["close-modal"],
        methods: {
            async applyChanges() {
                if (this.currentCatalog.name === "") {
                    this.$root.showNotify({
                        text: "Обязательное поле не заполнено.",
                        type: "warning"
                    });
                    return;
                }
                if (await this.hasDublicateName()) {
                    this.$root.showNotify({
                        text: "Элемент с подобным именем уже существует.",
                        type: "warning"
                    });
                    return;
                }
                if (this.title === "Добавить") {
                    await database.createDocument(
                        conf.global.databaseID,
                        this.collection,
                        "unique()",
                        {name: this.currentCatalog.name}
                    );
                    this.$emit("close-modal");
                    this.$root.showNotify({
                        text: "Добавлен элемент справочника.",
                        type: "success"
                    });
                    return;
                }
                if (this.title === "Изменить") {
                    await database.updateDocument(
                        conf.global.databaseID,
                        this.collection,
                        this.currentCatalog.$id,
                        {name: this.currentCatalog.name}
                    );
                    this.$emit("close-modal");
                    this.$root.showNotify({
                        text: "Изменен элемент справочника.",
                        type: "success"
                    });
                    return;
                }
            },
            async hasDublicateName() {
                const query = [
                    Query.equal("name", this.currentCatalog.name)
                ];
                const result = await database.listDocuments(
                    conf.global.databaseID,
                    this.collection,
                    query
                );
                return result.total > 0 ? true: false;
            }
        },
        mounted() {
            this.currentCatalog = this.catalog;
            this.$refs.name.focus();
        },
        props: {
            catalog: {
                default() {
                    return {
                        name: ""
                    }
                },
                required: true,
                type: Object
            },
            title: {
                required: true,
                type: String
            },
            type: {
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
                <div class="field">
                    <label class="label">Наименование:</label>
                    <p class="control">
                        <input
                            class="input"
                            ref="name"
                            type="text"
                            v-model.trim="currentCatalog.name">
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