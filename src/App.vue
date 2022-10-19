<script>
    import { Query } from "appwrite";
    import {
        database, getAllEmployees, getEmployeesCount, getLimit, getSettingID
    } from "./api.js";
    import conf from "./config.js";
    import { sortColumns } from "./helpers.js";

    import AddModal from "./components/AddModal.vue";
    import BaseNavbar from "./components/BaseNavbar.vue";
    import BaseNotify from "./components/BaseNotify.vue";
    import BaseTable from "./components/BaseTable.vue";
    import CatalogModal from "./components/CatalogModal.vue";
    import DismissModal from "./components/DismissModal.vue";
    import EditModal from "./components/EditModal.vue";
    import FilterModal from "./components/FilterModal.vue";
    import HelpModal from "./components/HelpModal.vue";
    import ScheduleModal from "./components/ScheduleModal.vue";
    import SearchModal from "./components/SearchModal.vue";
    import SettingsModal from "./components/SettingsModal.vue";

    const FIELD_NAMES = {
        "Дата приема": "date_of_employment",
        "Должность": "job_title",
        "Оклад": "salary",
        "Статус": "status"
    }

    export default {
        components: {
            AddModal,
            BaseNavbar,
            BaseNotify,
            BaseTable,
            CatalogModal,
            DismissModal,
            EditModal,
            FilterModal,
            HelpModal,
            ScheduleModal,
            SearchModal,
            SettingsModal
        },
        computed: {
            allEmployees() {
                this.updateData();
                return this.employees;
            },
            currentEmployee() {
                if (this.selectedRow >= 0) {
                    return this.employees[this.selectedRow];
                }
            },
            currentFilter() {
                let query = [];
                const limit = Query.limit(this.rowsPerPage);
                const offset = Query.offset(this.offset);
                query = [
                    ...this.filterQuery,
                    this.order,
                    limit,
                    offset
                ];
                if (this.searchedText !== "") {
                    query.push(this.searchedText);
                }
                return query;
            },
            filtered() {
                return this.filterQuery.length > 0 && this.searchedText === "";
            },
            order() {
                if (this.sortDirection === "ASC") {
                    return Query.orderAsc(this.sortColumn);
                }
                return Query.orderDesc(this.sortColumn);
            },
            searched() {
                return this.searchedText !== "";
            }
        },
        data() {
            return {
                addModalVisible: false,
                catalogModalVisible: false,
                catalogTitle: "",
                catalogType: "",
                currentPage: 0,
                dismissModalVisible: false,
                editModalVisible: false,
                employees: [],
                filterModalVisible: false,
                filterQuery: [],
                helpModalVisible: false,
                offset: 0,
                pagesCount: 0,
                rowsPerPage: 20,
                scheduleModalVisible: false,
                searchedText: "",
                searchModalVisible: false,
                selectedRow: -1,
                settingsModalVisible: false,
                sortColumn: "full_name",
                sortDirection: "ASC"
            }
        },
        methods: {
            async addEmployee() {
                const jobs = await database.listDocuments(
                    conf.global.databaseID,
                    conf.collections.jobs
                );
                if (jobs.total === 0) {
                    this.$root.showNotify({
                        text: "Справочник должностей пуст.",
                        type: "warning"
                    })
                } else {
                    this.addModalVisible = true;
                }
            },
            async changeLimit(limit) {
                const document_id = await getSettingID("limit");
                if (document_id) {
                    database.updateDocument(
                        conf.global.databaseID,
                        conf.collections.settings,
                        document_id,
                        JSON.stringify({value: limit.toString()})
                    );
                }
                this.rowsPerPage = limit;
                this.updateData();
            },
            changePage(page) {
                switch (page) {
                    case "first":
                        this.currentPage = 1;
                        break;
                    case "previous":
                        if (this.currentPage > 1) {
                            this.currentPage--;
                        };
                        break;
                    case "next":
                        if (this.currentPage < this.pagesCount) {
                            this.currentPage++;
                        };
                        break;
                    case "last":
                        this.currentPage = this.pagesCount;
                        break;
                }
            },
            async clearEmployees() {
                const employees = await getAllEmployees();
                employees.forEach(async employee => {
                    await this.deleteEmployee(employee.$id);
                });
                this.$root.showNotify({
                    text: "Все сотрудники удалены.",
                    type: "success"
                });
            },
            convertToQueries(filters) {
                return filters.map(filter => {;
                    if (filter.field === "Оклад") {
                        filter.value = Number(filter.value);
                    }
                    switch (filter.condition) {
                        case "=":
                            return Query.equal(
                                FIELD_NAMES[filter.field],
                                filter.value
                            )
                            break;
                        case "≠":
                            return Query.notEqual(
                                FIELD_NAMES[filter.field],
                                filter.value
                            )
                            break;
                        case ">":
                            return Query.greaterThan(
                                FIELD_NAMES[filter.field],
                                filter.value
                            )
                            break;
                        case "<":
                            return Query.lessThan(
                                FIELD_NAMES[filter.field],
                                filter.value
                            )
                            break;
                        case "≥":
                            return Query.greaterThanEqual(
                                FIELD_NAMES[filter.field],
                                filter.value
                            )
                            break;
                        case "≤":
                            return Query.lessThanEqual(
                                FIELD_NAMES[filter.field],
                                filter.value
                            )
                            break;
                    }
                });
            },
            async deleteEmployee(employee_id) {
                const query = [Query.equal("employee_id", employee_id)];
                await database.deleteDocument(
                    conf.global.databaseID,
                    conf.collections.employees,
                    employee_id
                );
                if (this.employees.length === 0) {
                    this.selectedRow = -1
                }
                const result = await database.listDocuments(
                    conf.global.databaseID,
                    conf.collections.states,
                    query
                );
                result.documents.forEach(document => {
                    this.deleteState(document.$id);
                })
                
            },
            async deleteState(state_id) {
                await database.deleteDocument(
                    conf.global.databaseID,
                    conf.collections.states,
                    state_id
                );
            },
            async dismissEmployee() {
                if (this.currentEmployee.status === "Работает") {
                    const reasons = await database.listDocuments(
                        conf.global.databaseID,
                        conf.collections.reasons
                    );
                    if (reasons.total === 0) {
                        this.$root.showNotify({
                            text: "Справочник причин увольнения пуст.",
                            type: "warning"
                        })
                    } else {
                        this.dismissModalVisible = true;
                    }
                } else {
                    this.$root.showNotify({
                        text: "Сотрудник уже уволен или уволился.",
                        type: "warning"
                    });
                }
            },
            async editEmployee() {
                const jobs = await database.listDocuments(
                    conf.global.databaseID,
                    conf.collections.jobs
                );
                if (jobs.total === 0) {
                    this.$root.showNotify({
                        text: "Справочник должностей пуст.",
                        type: "warning"
                    });
                } else if (this.currentEmployee.status !== "Работает") {
                    const reasons = await database.listDocuments(
                        conf.global.databaseID,
                        conf.collections.reasons
                    );
                    if (reasons.total === 0) {
                        this.$root.showNotify({
                            text: "Справочник причин увольнения пуст.",
                            type: "warning"
                        });
                    } else {
                        this.editModalVisible = true;
                    }
                } else {
                    this.editModalVisible = true;
                }
            },
            editSchedule() {
                if (this.workingEmployeeExist()) {
                    this.scheduleModalVisible = true;
                } else {
                    this.$root.showNotify({
                        text: "Работающие сотрудники не обнаружены.",
                        type: "warning"
                    });
                }
            },
            invertSortDirection() {
                this.sortDirection = (this.sortDirection == "ASC") ?
                "DESC" : "ASC";
            },
            itemClick(shortcut) {
                switch (shortcut) {
                    case "Alt + A":
                        this.addEmployee();
                        break;
                    case "Alt + E":
                        this.editEmployee();
                        break;
                    case "Alt + D":
                        this.removeEmployee();
                        break;
                    case "Alt + C":
                        this.clearEmployees();
                        break;
                    case "Alt + F":
                        this.dismissEmployee();
                        break;
                    case "Alt + M":
                        this.editSchedule();
                        break;
                    case "Alt + J":
                        this. showJobsCatalog();
                        break;
                    case "Alt + R":
                        this.showReasonsCatalog();
                        break;
                }
            },
            loadFilter(){
                return JSON.parse(localStorage.getItem("filter")) || [];
            },
            loadSearch() {
                return JSON.parse(localStorage.getItem("search")) || "";
            },
            removeEmployee() {
                this.deleteEmployee(this.currentEmployee.$id);
                this.$root.showNotify({
                    text: "Сотрудник удален.",
                    type: "success"
                });
            },
            resetFilter() {
                localStorage.removeItem("filter");
                this.filterQuery.length = 0;
                this.updateData();
            },
            resetSearch() {
                localStorage.removeItem("search");
                this.searchedText = "";
                this.filterQuery.pop();
                this.updateData();
            },
            setFilter(filters) {
                localStorage.setItem("filter", JSON.stringify(filters));
                this.filterQuery = this.convertToQueries(filters);
                this.updateData();
            },
            setSearch(searchedText) {
                localStorage.setItem("search", JSON.stringify(searchedText));
                this.searchedText = Query.search(
                    "full_name",
                    searchedText.split(" ")
                );
                this.updateData();
            },
            async setRowsPerPage() {
                this.rowsPerPage = await getLimit();
            },
            showJobsCatalog() {
                this.catalogTitle = "Должности";
                this.catalogType = "jobs";
                this.catalogModalVisible = true;
            },
            showFilter() {
                if (this.employees.length === 0) {
                    if (this.filterQuery.length > 0) {
                        this.filterModalVisible = true;
                    }
                } else {
                    this.filterModalVisible = true;
                }
            },
            showReasonsCatalog() {
                this.catalogTitle = "Причины увольнения";
                this.catalogType = "reasons";
                this.catalogModalVisible = true;
            },
            showSearch() {
                if (this.employees.length === 0) {
                    if (this.filterQuery.length > 0) {
                        this.searchModalVisible = true;
                    }
                } else {
                    this.searchModalVisible = true;
                }
            },
            sortByColumnName(columnName) {
                if (this.sortColumn === sortColumns[columnName]) {
                    this.invertSortDirection();
                }
                switch (columnName) {
                    case "Дата приема":
                        this.sortColumn = "date_of_employment";
                        break;
                    case "ФИО":
                        this.sortColumn = "full_name";
                        break;
                    case "Должность":
                        this.sortColumn = "job_title";
                        break;
                    case "Оклад":
                        this.sortColumn = "salary";
                        break;
                    case "Статус":
                        this.sortColumn = "status";
                        break;
                }
            },
            async updateData() {
                const employeesCount = await getEmployeesCount();
                const result = await database.listDocuments(
                    conf.global.databaseID,
                    conf.collections.employees,
                    this.currentFilter
                );
                if (result.total > 0) {
                    this.employees = result.documents;
                    if (this.currentPage == 0) {
                        this.currentPage = 1;
                    };
                    // Make first added row selected
                    if (this.selectedRow == -1) {
                        this.selectedRow = 0;
                    };
                    // When rows per page value is changed and new value is
                    // less than previous one, last row has to be selected
                    if (this.selectedRow > this.employees.length - 1) {
                        this.selectedRow = this.employees.length - 1;
                    };
                    this.pagesCount = parseInt(
                        employeesCount / this.rowsPerPage
                    );
                    if (employeesCount % this.rowsPerPage > 0) {
                        this.pagesCount++;
                    };
                    if (this.currentPage > this.pagesCount) {
                        this.currentPage = this.pagesCount;
                    }
                    this.offset = (this.currentPage - 1) * this.rowsPerPage;
                } else {
                    this.currentPage = 0;
                    this.pagesCount = 0;
                    this.employees = [];
                }
            },
            workingEmployeeExist() {
                for (let employee of this.employees) {
                    if (employee.status === "Работает") {
                        return true;
                    }
                }
                return false;
            }
        },
        mounted() {
            document.addEventListener("keydown", (event) => {
                const e = event || window.event;
                const altPressed = e.altKey;
                if (altPressed) {
                    this.itemClick(`Alt + ${e.key.toUpperCase()}`);
                }
            });
            this.filterQuery = this.convertToQueries(this.loadFilter());
            if (this.loadSearch() !== "") {
                this.searchedText = Query.search(
                    "full_name",
                    this.loadSearch().split(" ")
                );
            }
            this.setRowsPerPage();
            this.updateData();
        }
    }
</script>

<template>
    <div>
        <BaseNavbar
            :current-page="currentPage"
            :filtered="filtered"
            :pages-count="pagesCount"
            :rows-per-page="rowsPerPage"
            :searched="searched"
            @change-limit="changeLimit"
            @change-page="changePage"
            @item-click="itemClick"
            @show-help="helpModalVisible = true"
            @show-filter="showFilter"
            @show-search="showSearch"
            @show-settings="settingsModalVisible = true"/>
        <BaseTable
            :direction="sortDirection"
            :employees="allEmployees"
            :selected-row="selectedRow"
            :sort-column="sortColumn"
            @row-click="selectedRow = $event"
            @sort-column="sortByColumnName"/>
        <HelpModal
            v-if="helpModalVisible"
            @close-modal="helpModalVisible = false"/>
        <AddModal
            v-if="addModalVisible"
            @close-modal="addModalVisible = false"/>
        <EditModal
            :document="employees[selectedRow]"
            v-if="editModalVisible"
            @close-modal="editModalVisible = false"/>
        <DismissModal
            :document="employees[selectedRow]"
            v-if="dismissModalVisible"
            @close-modal="dismissModalVisible = false"/>
        <CatalogModal
            :title="catalogTitle"
            :type="catalogType"
            v-if="catalogModalVisible"
            @close-modal="catalogModalVisible = false"/>
        <ScheduleModal
            v-if="scheduleModalVisible"
            @close-modal="scheduleModalVisible = false"/>
        <SearchModal
            v-if="searchModalVisible"
            :text="loadSearch()"
            @close-modal="searchModalVisible = false"
            @reset-search="resetSearch"
            @set-search="setSearch"/>
        <FilterModal
            v-if="filterModalVisible"
            :queries="loadFilter()"
            @close-modal="filterModalVisible = false"
            @reset-filter="resetFilter"
            @set-filter="setFilter"/>
        <SettingsModal
            v-if="settingsModalVisible"
            @close-modal="settingsModalVisible = false"/>
        <BaseNotify
            :type="$root.notify.type"
            v-if="$root.notify.visible"
            @close-notify="$root.notify.visible = false">
            {{ $root.notify.text }}
        </BaseNotify>
    </div>
</template>