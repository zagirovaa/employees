<script>
    import { database } from "../api.js";
    
    import BaseActions from "./BaseActions.vue";
    import BaseModal from "./BaseModal.vue";

    const JOBS_COL_ID = "62d15002f14d9b2accd0";
    const REASONS_COL_ID = "62d151c1197064a173b1";

    export default {
        components: { BaseActions, BaseModal },
        computed: {
            catalogs() {
                this.updateData();
                return this.catalogTitles;
            },
            collection() {
                switch (this.type) {
                    case "jobs":
                        return JOBS_COL_ID;
                        break;
                    case "reasons":
                        return REASONS_COL_ID;
                        break;
                }
            }
        },
        data() {
            return {
                actionTitle: "",
                actionVisible: false,
                catalog: {},
                currentButton: 0,
                catalogTitles: [],
                selectedRow: -1
            }
        },
        emits: ["close-modal", "show-notify"],
        methods: {
            addCatalog() {
                this.catalog = { name: "" };
                this.actionTitle = "Добавить";
                this.actionVisible = true;
            },
            deleteAllCatalogs() {
                if (this.catalogTitles.length > 0) {
                    this.catalogTitles.forEach((title, index) => {
                        this.deleteCatalog(index);
                    });
                    this.updateData();
                    this.$emit(
                        "show-notify",
                        {
                            text: "Все элементы справочника удалены.",
                            type: "success"
                        }
                    )
                }
            },
            async deleteCatalog(index) {
                await database.deleteDocument(
                    this.collection, 
                    this.catalogTitles[index].$id
                );
            },
            editCatalog() {
                if (this.selectedRow >= 0) {
                    this.catalog = this.catalogTitles[this.selectedRow];
                    this.actionTitle = "Изменить";
                    this.actionVisible = true;
                }
            },
            async removeCatalog(index) {
                await this.deleteCatalog(index);
                this.updateData();
                this.$emit(
                    "show-notify",
                    {
                        text: "Элемент справочника удален.",
                        type: "success"
                    }
                )
            },
            async updateData() {
                const result = await database.listDocuments(
                    this.collection, [], 100, 0, "", "after", ["name"], ["ASC"]
                );
                this.catalogTitles = result.documents;
                if (this.catalogTitles.length > 0 && this.selectedRow === -1) {
                    this.selectedRow = 0;
                }
                if (this.selectedRow > this.catalogTitles.length - 1) {
                    this.selectedRow = this.catalogTitles.length - 1;
                }
                if (this.catalogTitles.length === 0) {
                    this.selectedRow = -1
                }
            }
        },
        updated() {
            this.updateData();
        },
        props: {
            title: String,
            type: String
        }
    }
</script>

<template>
    <BaseModal
        :title="title"
        @close-modal="$emit('close-modal')">
        <template v-slot:body>
            <section class="modal-card-body">
                <div
                    class="field is-grouped mb-4"
                    @mouseleave="currentButton = 0">
                    <p class="control">
                        <button
                            class="button is-light"
                            @click="addCatalog"
                            @mouseover="currentButton = 1">
                            <span class="icon is-small is-left">
                                <span class="material-icons">add</span>
                            </span>
                            <span v-if="currentButton == 1">Добавить</span>
                        </button>
                    </p>
                    <p class="control">
                        <button
                            class="button is-light"
                            @click="editCatalog"
                            @mouseover="currentButton = 2">
                            <span class="icon is-small is-left">
                                <span class="material-icons">done</span>
                            </span>
                            <span v-if="currentButton == 2">Изменить</span>
                        </button>
                    </p>
                    <p class="control">
                        <button
                            class="button is-light"
                            @click="removeCatalog(selectedRow)"
                            @mouseover="currentButton = 3">
                            <span class="icon is-small is-left">
                                <span class="material-icons">remove</span>
                            </span>
                            <span v-if="currentButton == 3">Удалить</span>
                        </button>
                    </p>
                    <p class="control">
                        <button
                            class="button is-light"
                            @click="deleteAllCatalogs"
                            @mouseover="currentButton = 4">
                            <span class="icon is-small is-left">
                                <span class="material-icons">clear</span>
                            </span>
                            <span v-if="currentButton == 4">Очистить</span>
                        </button>
                    </p>
                    <div class="tags">
                        <span class="tag is-large">
                            Записей: {{ catalogTitles.length }}
                        </span>
                    </div>
                </div>
                <nav class="panel is-shadowless is-radiusless">
                    <a
                        class="panel-block is-radiusless"
                        :class="{
                            'has-text-white': selectedRow === index,
                            'has-background-link': selectedRow === index
                        }"
                        :key="index"
                        @click="selectedRow = index"
                        v-for="(catalog, index) in catalogs">
                        <span class="tag is-light is-link mr-4">
                            {{ index + 1 }}
                        </span>
                        {{ catalog.name }}
                    </a>
                </nav>
            </section>
        </template>
    </BaseModal>
    <BaseActions
        :catalog="catalog"
        :title="actionTitle"
        :type="type"
        v-if="actionVisible"
        @close-modal="actionVisible = false"
        @show-notify="this.$emit('show-notify', $event)"/>
</template>