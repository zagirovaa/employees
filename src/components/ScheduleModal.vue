<script>
    import { Query } from "appwrite";
    import { database, getAllEmployees } from "../api.js";
    import conf from "../config.js";
    import {
        getCurrentYear, getCurrentMonthNumber, getDayNameByDate, getDaysCount,
        getListOfMonths, getListOfYears, getMonthNameByNumber,
        getMonthNumberByName, addPadForDigits, splitArray
    } from "../helpers.js";
    import BaseModal from "./BaseModal.vue";

    export default {
        components: { BaseModal },
        data() {
            return {
                columns: ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"],
                columnNumbers: [1, 2, 3, 4, 5, 6, 7],
                currentMonth: 0,
                currentYear: 0,
                employMonth: 0,
                employYear: 0,
                employees: [],
                maxDays: 0,
                months: [],
                offDays: 0,
                rowNumbers: [1, 2, 3, 4, 5, 6],
                selectedMonthNumber: 0,
                selectedMonthName: "",
                selectedName: "",
                selectedYear: 0,
                sickDays: 0,
                table: [],
                title: "Пропуски",
                vacationDays: 0,
                years: [],
                workingDays: 0
            }
        },
        emits: ["close-modal"],
        methods: {
            changeCellColors(cellNumber) {
                const cell = this.getCellByDayNumber(cellNumber);
                if (cell.classList.contains("has-background-info")) {
                    cell.classList.replace(
                        "has-background-info",
                        "has-background-warning"
                    );
                    cell.classList.replace("has-text-white", "has-text-dark");
                } else if (cell.classList.contains("has-background-warning")) {
                    cell.classList.replace(
                        "has-background-warning",
                        "has-background-danger"
                    );
                    cell.classList.replace("has-text-dark", "has-text-white");
                } else if (cell.classList.contains("has-background-danger")) {
                    cell.classList.remove("has-background-danger");
                    cell.classList.remove("has-text-white");
                } else {
                    cell.classList.add("has-background-info");
                    cell.classList.add("has-text-white");
                }
            },
            async changeDayStatus(row, column) {
                const cellNumber = this.getCellNumber(row, column);
                if (cellNumber != "") {
                    const holidays = this.getHolidays();
                    const selectedDate = this.getSelectedDate(cellNumber);
                    const dayName = getDayNameByDate(selectedDate);
                    const currentStates = await this.getStates();
                    if (!holidays.includes(dayName)) {
                        const state = currentStates.filter((state, index) => {
                            return new Date(state.date).getDate() == cellNumber;
                        });
                        if (state.length > 0) {
                            switch (state[0].status) {
                                case "Выходной":
                                    await database.updateDocument(
                                        conf.global.databaseID,
                                        conf.collections.states,
                                        state[0].$id,
                                        JSON.stringify({ status: "Отпускной" })
                                    );
                                    this.offDays--;
                                    this.vacationDays++;
                                    break;
                                case "Отпускной":
                                    await database.updateDocument(
                                        conf.global.databaseID,
                                        conf.collections.states,
                                        state[0].$id,
                                        JSON.stringify({ status: "Больничный" })
                                    );
                                    this.vacationDays--;
                                    this.sickDays++;
                                    break;
                                case "Больничный":
                                    await database.deleteDocument(
                                        conf.global.databaseID,
                                        conf.collections.states,
                                        state[0].$id
                                    );
                                    this.sickDays--;
                                    this.workingDays++;
                                    break;
                            }
                        } else {
                            await database.createDocument(
                                conf.global.databaseID,
                                conf.collections.states,
                                "unique()",
                                JSON.stringify({
                                    employee_id: this.getCurrentEmployee().$id,
                                    date: selectedDate,
                                    status: "Выходной"
                                })
                            );
                            this.workingDays--;
                            this.offDays++;
                        }
                        this.changeCellColors(cellNumber);
                    }
                }
            },
            getCellNumber(row, column) {
                return this.table[row - 1][column - 1];
            },
            getCellByDayNumber(number) {
                const cell = document.querySelector(
                    `.modal-card table td[value="${number}"]`
                );
                return cell;
            },
            getCurrentEmployee() {
                for (let item of this.employees) {
                    if (item.full_name.includes(this.selectedName)) {
                        return item;
                    }
                }
            },
            async getEmployees() {
                this.employees = await getAllEmployees(true);
                this.selectedName = this.employees[0].full_name;
                this.getYears();
            },
            getEmployMonth() {
                return new Date(
                    this.getCurrentEmployee().date_of_employment
                ).getMonth() + 1;
            },
            getEmployYear() {
                return new Date(
                    this.getCurrentEmployee().date_of_employment
                ).getFullYear();
            },
            getDays() {
                this.selectedMonthNumber = getMonthNumberByName(
                    this.selectedMonthName
                );
                this.maxDays = getDaysCount(
                    this.selectedYear,
                    this.selectedMonthNumber
                );
                this.getTable();
                this.initCellColors();
            },
            getHolidays() {
                return JSON.parse(
                    localStorage.getItem("holidays")
                ) || conf.settings.holidays || [];
            },
            getMonths() {
                const monthName = getMonthNameByNumber(
                    this.currentMonth
                );
                if (this.currentYear == this.employYear) {
                    this.months = getListOfMonths(
                        this.employMonth - 1, this.currentMonth - 1
                    );
                } else if (this.selectedYear == this.employYear) {
                    this.months = getListOfMonths(
                        this.employMonth - 1, 11
                    );
                } else if (this.selectedYear == this.currentYear) {
                    this.months = getListOfMonths(
                        0, this.currentMonth - 1
                    );
                } else {
                    this.months = getListOfMonths(0, 11);
                }
                if (this.months.includes(monthName)) {
                    this.selectedMonthName = monthName;
                } else {
                    this.selectedMonthName = this.months[0];
                }
                this.getDays();
            },
            getSelectedDate(day) {
                return `
                    ${this.selectedYear}-${addPadForDigits(
                        this.selectedMonthNumber
                    )}-${addPadForDigits(day)}
                `.trim();
            },
            async getStates() {
                const employeeId = this.getCurrentEmployee().$id;
                const startDate = this.getSelectedDate(1);
                const endDate = this.getSelectedDate(this.maxDays);
                const query = [
                    Query.equal("employee_id", employeeId),
                    Query.greaterThanEqual("date", startDate),
                    Query.lessThanEqual("date", endDate)
                ];
                const result = await database.listDocuments(
                    conf.global.databaseID,
                    conf.collections.states,
                    query
                );
                return result.total > 0 ? result.documents : [];
            },
            getTable() {
                let dayNumber = new Date(this.getSelectedDate(1)).getDay();
                // Week starts from Monday not Sunday
                dayNumber = (dayNumber == 0) ? 7 : dayNumber;
                let tempTable = [];
                if (dayNumber > 1) {
                    for (let i = 0; i < dayNumber - 1; i++) {
                        tempTable.push("");
                    }
                }
                for (let i = dayNumber - 1; i < ((dayNumber - 1) + this.maxDays); i++) {
                    if (dayNumber > 1) {
                        tempTable.push(i - (dayNumber - 2));
                    } else {
                        tempTable.push(i + 1);
                    }
                }
                for (let i = this.maxDays + dayNumber - 1; i < 42; i++) {
                    tempTable.push("");
                }
                this.table = splitArray(tempTable, 7);
            },
            getYears() {
                this.employYear = this.getEmployYear();
                this.employMonth = this.getEmployMonth();
                this.years = getListOfYears(this.employYear);
                this.selectedYear = this.currentYear;
                this.getMonths();
            },
            async initCellColors() {
                this.resetCellsColors();
                this.resetDaysCounts();
                const holidays = this.getHolidays();
                const currentStates = await this.getStates();
                // Set colors for holidays
                for (let day = 1; day <= this.maxDays; day++) {
                    const currentCell = this.getCellByDayNumber(day);
                    const dayName = getDayNameByDate(
                        this.getSelectedDate(day)
                    );
                    if (holidays.includes(dayName)) {
                        currentCell.classList.add("has-background-info");
                        currentCell.classList.add("has-text-white");
                        this.offDays++;
                    } else {
                        this.workingDays++;
                    }
                }
                // Get day status for selected employee
                // and paint cell accordingly
                currentStates.forEach(state => {
                    const stateDay = new Date(state.date).getDate();
                    const currentCell = this.getCellByDayNumber(stateDay);
                    switch (state.status) {
                        case "Выходной":
                            currentCell.classList.add(
                                "has-background-info"
                            );
                            currentCell.classList.add("has-text-white");
                            this.offDays++;
                            break;
                        case "Отпускной":
                            currentCell.classList.add(
                                "has-background-warning"
                            );
                            currentCell.classList.add("has-text-dark");
                            this.vacationDays++;
                            break;
                        case "Больничный":
                            currentCell.classList.add(
                                "has-background-danger"
                            );
                            currentCell.classList.add("has-text-white");
                            this.sickDays++;
                            break;
                    }
                });
            },
            resetCellsColors() {
                const cells = document.querySelectorAll(".modal-card table td");
                for (let cell of cells)  {
                    cell.className = "";
                }
            },
            resetDaysCounts() {
                this.workingDays = 0;
                this.offDays = 0;
                this.vacationDays = 0;
                this.sickDays = 0;
            },
            rowIsVisible(row) {
                if (row >= 0) {
                    for (let i = 0; i < this.table[row].length; i++) {
                        if (this.table[row][i] != "") {
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        mounted() {
            this.getEmployees();
            this.currentYear = getCurrentYear();
            this.currentMonth = getCurrentMonthNumber();
        }
    }
</script>

<template>
    <BaseModal
        :title="title"
        @close-modal="$emit('close-modal')">
        <template v-slot:body>
            <section class="modal-card-body">
                <div class="field is-grouped">
                    <p class="control is-expanded">
                        <label class="label">Сотрудник:</label>
                        <span class="select is-fullwidth">
                            <select
                                v-model="selectedName"
                                @click="getYears">
                                <option
                                    :key="index"
                                    v-for="(employee, index) in employees">
                                    {{ employee.full_name }}
                                </option>
                            </select>
                        </span>
                    </p>
                    <p class="control">
                        <label class="label">Год:</label>
                        <span class="select is-fullwidth">
                            <select
                                v-model="selectedYear"
                                @click="getMonths">
                                <option
                                    :key="index"
                                    v-for="(year, index) in years">
                                    {{ year }}
                                </option>
                            </select>
                        </span>
                    </p>
                    <p class="control">
                        <label class="label">Месяц:</label>
                        <span class="select is-fullwidth">
                            <select
                                v-model="selectedMonthName"
                                @click="getDays">
                                <option
                                    :key="index"
                                    v-for="(month, index) in months">
                                    {{ month }}
                                </option>
                            </select>
                        </span>
                    </p>
                </div>
                <table
                    class="table is-fullwidth is-bordered mt-5 mb-4"
                    id="schedule">
                    <thead>
                        <tr class="has-background-light">
                            <th
                                class="has-text-centered"
                                :key="index"
                                v-for="(name, index) in columns">
                                {{ name }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template
                            :key="row"
                            v-for="row in table.length">
                            <tr
                                class="has-text-centered"
                                v-if="rowIsVisible(row - 1)">
                                <td
                                    :key="getCellNumber(row, column)"
                                    :value="getCellNumber(row, column)"
                                    v-for="column in 7"
                                    @click="changeDayStatus(row, column)">
                                    {{ getCellNumber(row, column) }}
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="field is-grouped">
                    <div class="control">
                        <div class="tags has-addons">
                            <span class="tag is-white border-light">
                                Рабочий
                            </span>
                            <span class="tag is-light">
                                {{ workingDays }}
                            </span>
                        </div>
                    </div>
                    <div class="control">
                        <div class="tags has-addons">
                            <span class="tag is-info border-info">
                                Выходной
                            </span>
                            <span class="tag is-info is-light">
                                {{ offDays }}
                            </span>
                        </div>
                    </div>
                    <div class="control">
                        <div class="tags has-addons">
                            <span class="tag is-warning border-warning">
                                Отпускной
                            </span>
                            <span class="tag is-warning is-light">
                                {{ vacationDays }}
                            </span>
                        </div>
                    </div>
                    <div class="control">
                        <div class="tags has-addons">
                            <span class="tag is-danger border-danger">
                                Больничный
                            </span>
                            <span class="tag is-danger is-light">
                                {{ sickDays }}
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </template>
    </BaseModal>
</template>