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
        emits: ["close-modal", "show-notify"],
        methods: {
            async applyChanges() {
                if (this.currentCatalog.name !== "") {
                    if (await this.hasNoDublicateName()) {
                        if (this.title === "Добавить") {
                            await database.createDocument(
                                this.collection,
                                "unique()",
                                JSON.stringify(this.currentCatalog)
                            );
                            this.$emit("close-modal");
                            this.$emit("show-notify", {
                                text: "Добавлен элемент справочника.",
                                type: "success"
                            });
                        } else if (this.title === "Изменить") {
                            await database.updateDocument(
                                this.collection,
                                this.currentCatalog.$id,
                                JSON.stringify(this.currentCatalog)
                            );
                            this.$emit("close-modal");
                            this.$emit("show-notify", {
                                text: "Изменен элемент справочника.",
                                type: "success"
                            });
                        }
                    } else {
                        this.$emit("show-notify", {
                            text: "Элемент с подобным именем уже существует.",
                            type: "warning"
                        });
                    }
                } else {
                    this.$emit("show-notify", {
                        text: "Обязательное поле не заполнено.",
                        type: "warning"
                    });
                }
            },
            async hasNoDublicateName() {
                const query = [
                    Query.equal("name", this.currentCatalog.name)
                ];
                const result = await database.listDocuments(
                    this.collection,
                    query
                );
                return result.total === 0 ? true: false;
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