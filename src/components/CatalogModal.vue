<script>
    import { Query } from "appwrite";

    import { database } from "../api.js";
    import conf from "../config.js";

    import BaseActions from "./BaseActions.vue";
    import BaseModal from "./BaseModal.vue";

    export default {
        components: { BaseActions, BaseModal },
        computed: {
            catalogName() {
                switch (this.type) {
                    case "jobs":
                        return "job_title";
                        break;
                    case "reasons":
                        return "reason_for_dismissal";
                        break;
                }
            },
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
                actionTitle: "",
                actionVisible: false,
                catalog: {},
                currentButton: 0,
                catalogs: [],
                selectedRow: -1
            }
        },
        emits: ["close-modal"],
        methods: {
            addCatalog() {
                this.catalog = { name: "" };
                this.actionTitle = "Добавить";
                this.actionVisible = true;
            },
            async catalogIsNotUsed(index) {
                const query = [
                    Query.equal(
                        this.catalogName,
                        this.catalogs[index].name
                    )
                ];
                const result = await database.listDocuments(
                    conf.global.databaseID,
                    conf.collections.employees,
                    query
                );
                return result.total === 0 ? true: false;
            },
            deleteAllCatalogs() {
                const self = this;
                if (this.catalogs.length > 0) {
                    this.catalogs.forEach(async (title, index) => {
                        await self.deleteCatalog(index);
                    });
                    this.$root.showNotify({
                        text: "Все элементы справочника удалены",
                        type: "success"
                    });
                }
            },
            async deleteCatalog(index) {
                if (await this.catalogIsNotUsed(index)) {
                    await database.deleteDocument(
                        conf.global.databaseID,
                        this.collection, 
                        this.catalogs[index].$id
                    );
                    this.updateData();
                    return true;
                }
                return false;
            },
            editCatalog() {
                this.catalog = this.catalogs[this.selectedRow];
                this.actionTitle = "Изменить";
                this.actionVisible = true;
            },
            async removeCatalog(index) {
                if (await this.deleteCatalog(index)) {
                    this.$root.showNotify({
                        text: "Элемент справочника удален",
                        type: "success"
                    });
                } else {
                    this.$root.showNotify({
                        text: "Элемент справочника привязан к сотруднику",
                        type: "warning"
                    });
                }
            },
            async updateData() {
                const result = await database.listDocuments(
                    conf.global.databaseID,
                    this.collection,
                    [Query.orderAsc("name")]
                );
                this.catalogs = result.documents;
                // When adding first item it must be set active
                // cause it is the only one in the list
                if (this.catalogs.length > 0 && this.selectedRow === -1) {
                    this.selectedRow = 0;
                }
                // When item is deleted previous one
                // has to become active if there is any
                if (this.selectedRow > this.catalogs.length - 1) {
                    this.selectedRow = this.catalogs.length - 1;
                }
                // When the last item is removed none is active
                if (this.catalogs.length === 0) {
                    this.selectedRow = -1
                }
            }
        },
        mounted() {
            this.updateData();
        },
        props: {
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
                            Записей: {{ catalogs.length }}
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
        @close-modal="actionVisible = false"/>
</template>