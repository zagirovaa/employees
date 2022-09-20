<script>
    import { Query } from "appwrite";
    import * as api from "./api.js";
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
    import SettingsModal from "./components/SettingsModal.vue";

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
            SettingsModal
        },
        computed: {
            currentEmployee() {
                if (this.selectedRow >= 0) {
                    return this.employees[this.selectedRow];
                }
            },
            getEmployees() {
                this.updateData();
                return this.employees;
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
                notify: {
                    text: "",
                    timeout: 3000,
                    type: "",
                    visible: false
                },
                offset: 0,
                pagesCount: 0,
                rowsPerPage: 20,
                selectedRow: -1,
                settingsModalVisible: false,
                scheduleModalVisible: false,
                sortColumn: "full_name",
                sortDirection: "ASC"
            }
        },
        methods: {
            async addEmployee() {
                const jobs = await api.database.listDocuments(
                    conf.collections.jobs,
                    [], 100, 0, undefined, "after", ["name"], ["ASC"]
                );
                if (jobs.total === 0) {
                    this.showNotify({
                        text: "Справочник должностей пуст.",
                        type: "warning"
                    })
                } else {
                    this.addModalVisible = true;
                }
            },
            changeFilter() {
                this.filterModalVisible = !this.filtered;
            },
            async changeLimit(limit) {
                const document_id = await api.getSettingID("limit");
                if (document_id) {
                    api.database.updateDocument(
                        conf.collections.settings,
                        document_id,
                        {
                            value: String(limit)
                        }
                    );
                }
                this.rowsPerPage = limit;
                this.updateData();
            },
            changePage(page) {
                if (this.pagesCount > 0) {
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
                }
            },
            async clearEmployees() {
                if (this.employees.length > 0) {
                    const employees = await api.getAllEmployees();
                    employees.forEach(async employee => {
                        await this.deleteEmployee(employee.$id);
                    });
                    this.showNotify({
                        text: "Все сотрудники удалены.",
                        type: "success"
                    });
                }
            },
            async deleteEmployee(employee_id) {
                const query = [Query.equal("employee_id", employee_id)];
                await api.database.deleteDocument(
                    conf.collections.employees,
                    employee_id
                );
                if (this.employees.length === 0) {
                    this.selectedRow = -1
                }
                const result = await api.database.listDocuments(
                    conf.collections.states,
                    query
                );
                result.documents.forEach(document => {
                    this.deleteState(document.$id);
                })
                
            },
            async deleteState(state_id) {
                await api.database.deleteDocument(
                    conf.collections.states,
                    state_id
                );
            },
            async dismissEmployee() {
                if (this.employees.length > 0) {
                    if (this.currentEmployee.status === "Работает") {
                        const reasons = await api.database.listDocuments(
                            conf.collections.reasons,
                            [], 100, 0, undefined, "after", ["name"], ["ASC"]
                        );
                        if (reasons.total === 0) {
                            this.showNotify({
                                text: "Справочник причин увольнения пуст.",
                                type: "warning"
                            })
                        } else {
                            this.dismissModalVisible = true;
                        }
                    }
                }
            },
            async editEmployee() {
                if (this.employees.length > 0) {
                    const jobs = await api.database.listDocuments(
                        conf.collections.jobs,
                        [], 100, 0, undefined, "after", ["name"], ["ASC"]
                    );
                    if (jobs.total === 0) {
                        this.showNotify({
                            text: "Справочник должностей пуст.",
                            type: "warning"
                        });
                    } else if (this.currentEmployee.status !== "Работает") {
                        const reasons = await api.database.listDocuments(
                            conf.collections.reasons,
                            [], 100, 0, undefined, "after", ["name"], ["ASC"]
                        );
                        if (reasons.total === 0) {
                            this.showNotify({
                                text: "Справочник причин увольнения пуст.",
                                type: "warning"
                            });
                        } else {
                            this.editModalVisible = true;
                        }
                    } else {
                        this.editModalVisible = true;
                    }
                }
            },
            editSchedule() {
                if (this.employees.length > 0 && this.workingEmployeeExist()) {
                    this.scheduleModalVisible = true;
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
            removeEmployee() {
                if (this.employees.length > 0) {
                    this.deleteEmployee(this.currentEmployee.$id);
                    this.showNotify({
                        text: "Сотрудник удален.",
                        type: "success"
                    });
                }
            },
            async setRowsPerPage() {
                this.rowsPerPage = await api.getLimit();
            },
            showJobsCatalog() {
                this.catalogTitle = "Должности";
                this.catalogType = "jobs";
                this.catalogModalVisible = true;
            },
            showFilter() {
                if (this.employees.length > 0) {
                    this.filterModalVisible = true;
                }
            },
            showNotify(data) {
                this.notify.text = data.text;
                this.notify.type = data.type;
                this.notify.visible = true;
                setTimeout(() => {
                    this.notify.visible = false;
                }, this.notify.timeout);
            },
            showReasonsCatalog() {
                this.catalogTitle = "Причины увольнения";
                this.catalogType = "reasons";
                this.catalogModalVisible = true;
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
                const employeesCount = await api.getEmployeesCount();
                if (employeesCount > 0) {
                    const result = await api.database.listDocuments(
                        conf.collections.employees,
                        this.filterQuery,
                        this.rowsPerPage,
                        this.offset,
                        undefined,
                        "after",
                        [this.sortColumn],
                        [this.sortDirection]
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
                        this.offset = (this.currentPage - 1) * this.rowsPerPage;
                    }
                } else {
                    this.currentPage = 0;
                    this.pagesCount = 0;
                    this.employees = [];
                }
            },
            workingEmployeeExist() {
                if (this.employees.length > 0) {
                    for (let employee of this.employees) {
                        if (employee.status === "Работает") {
                            return true;
                        }
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
            this.setRowsPerPage();
        }
    }
</script>

<template>
    <div>
        <BaseNavbar
            :current-page="currentPage"
            :pages-count="pagesCount"
            :rows-per-page="rowsPerPage"
            @change-filter="changeFilter"
            @change-limit="changeLimit"
            @change-page="changePage"
            @item-click="itemClick"
            @show-help="helpModalVisible = true"
            @show-filter="showFilter"
            @show-settings="settingsModalVisible = true"/>
        <BaseTable
            :direction="sortDirection"
            :employees="getEmployees"
            :selected-row="selectedRow"
            :sort-column="sortColumn"
            @row-click="selectedRow = $event"
            @sort-column="sortByColumnName"/>
        <HelpModal
            v-if="helpModalVisible"
            @close-modal="helpModalVisible = false"/>
        <AddModal
            v-if="addModalVisible"
            @close-modal="addModalVisible = false"
            @show-notify="showNotify"/>
        <EditModal
            :document="employees[selectedRow]"
            v-if="editModalVisible"
            @close-modal="editModalVisible = false"
            @show-notify="showNotify"/>
        <DismissModal
            :document="employees[selectedRow]"
            v-if="dismissModalVisible"
            @close-modal="dismissModalVisible = false"
            @show-notify="showNotify"/>
        <CatalogModal
            :title="catalogTitle"
            :type="catalogType"
            v-if="catalogModalVisible"
            @close-modal="catalogModalVisible = false"
            @show-notify="showNotify"/>
        <ScheduleModal
            v-if="scheduleModalVisible"
            @close-modal="scheduleModalVisible = false"
            @show-notify="showNotify"/>
        <FilterModal
            v-if="filterModalVisible"
            @close-modal="filterModalVisible = false"
            @filter="filterQuery = $event"
            @show-notify="showNotify"/>
        <SettingsModal
            v-if="settingsModalVisible"
            @close-modal="settingsModalVisible = false"
            @show-notify="showNotify"/>
        <BaseNotify
            :type="notify.type"
            v-if="notify.visible"
            @close-notify="notify.visible = false">
            {{ notify.text }}
        </BaseNotify>
    </div>
</template>