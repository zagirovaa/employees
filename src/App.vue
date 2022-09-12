<script>
    import { Query } from "appwrite";

    import { database } from "./api.js";
    import { getAllEmployees } from "./api.js";
    import { getEmployeesCount } from "./api.js";
    import { getLimit } from "./api.js";
    import { getSettingID } from "./api.js";

    import AddModal from "./components/AddModal.vue";
    import BaseNavbar from "./components/BaseNavbar.vue";
    import BaseNotify from "./components/BaseNotify.vue";
    import BaseTable from "./components/BaseTable.vue";
    import CatalogModal from "./components/CatalogModal.vue";
    import DismissModal from "./components/DismissModal.vue";
    import EditModal from "./components/EditModal.vue";
    import HelpModal from "./components/HelpModal.vue";
    import ScheduleModal from "./components/ScheduleModal.vue";
    import SettingsModal from "./components/SettingsModal.vue";

    const EMPLOYEES_COL_ID = "62d15adca365e871a654";
    const STATES_COL_ID = "630b4f6caf52194e911b";
    const SETS_COL_ID = "630880867803a0d3e7d3";

    export default {
        components: {
            AddModal,
            BaseNavbar,
            BaseNotify,
            BaseTable,
            CatalogModal,
            DismissModal,
            EditModal,
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
                catalogVisible: false,
                catalogTitle: "",
                catalogType: "",
                currentPage: 0,
                dismissModalVisible: false,
                editModalVisible: false,
                employees: [],
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
                sortColumns: {
                    "Дата приема": "date_of_employment",
                    "ФИО": "full_name",
                    "Должность": "job_title",
                    "Оклад": "salary",
                    "Статус": "status"
                },
                sortDirection: "ASC"
            }
        },
        methods: {
            addEmployee() {
                this.addModalVisible = true;
            },
            async changeLimit(limit) {
                const document_id = await getSettingID("limit");
                if (document_id) {
                    database.updateDocument(
                        SETS_COL_ID,
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
                    const employees = await getAllEmployees();
                    employees.forEach(employee => {
                        this.deleteEmployee(employee.$id);
                    });
                    this.showNotify({
                        text: "Все сотрудники удалены.",
                        type: "success"
                    });
                }
            },
            async deleteEmployee(employee_id) {
                const query = [Query.equal("employee_id", employee_id)];
                await database.deleteDocument(
                    EMPLOYEES_COL_ID,
                    employee_id
                );
                if (this.employees.length == 0) {
                    this.selectedRow = -1
                }
                const result = await database.listDocuments(
                    STATES_COL_ID,
                    query
                );
                result.documents.forEach(document => {
                    this.deleteState(document.$id);
                })
                
            },
            async deleteState(state_id) {
                await database.deleteDocument(
                    STATES_COL_ID,
                    state_id
                );
            },
            dismissEmployee() {
                if (this.employees.length > 0) {
                    if (this.currentEmployee.status === "Работает") {
                        this.dismissModalVisible = true;
                    }
                }
            },
            editEmployee() {
                if (this.selectedRow >= 0) {
                    this.editModalVisible = true;
                }
            },
            editSchedule() {
                if (this.employees.length > 0 && this.workingEmployeeExist()) {
                    this.scheduleModalVisible = true;
                }
            },
            invertSortDirection() {
                this.sortDirection = (this.sortDirection == "ASC") ? "DESC" : "ASC";
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
                this.rowsPerPage = await getLimit();
            },
            showJobsCatalog() {
                this.catalogTitle = "Должности";
                this.catalogType = "jobs";
                this.catalogVisible = true;
            },
            showReasonsCatalog() {
                this.catalogTitle = "Причины увольнения";
                this.catalogType = "reasons";
                this.catalogVisible = true;
            },
            showNotify(data) {
                this.notify.text = data.text;
                this.notify.type = data.type;
                this.notify.visible = true;
                setTimeout(() => {
                    this.notify.visible = false;
                }, this.notify.timeout);
            },
            sortByColumnName(columnName) {
                if (this.sortColumn == this.sortColumns[columnName]) {
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
                if (employeesCount > 0) {
                    const result = await database.listDocuments(
                        EMPLOYEES_COL_ID,
                        [],
                        this.rowsPerPage,
                        this.offset,
                        "",
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
            @change-limit="changeLimit"
            @change-page="changePage"
            @item-click="itemClick"
            @show-help="helpModalVisible = true"
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
            v-if="catalogVisible"
            @close-modal="catalogVisible = false"
            @show-notify="showNotify"/>
        <ScheduleModal
            v-if="scheduleModalVisible"
            @close-modal="scheduleModalVisible = false"
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