import { Query } from "appwrite";

export const columnNames = {
    "":             "",
    "Дата приема":  "date_of_employment",
    "ФИО":          "full_name",
    "Должность":    "job_title",
    "Оклад":        "salary",
    "Статус":       "status"
};

const dayNames = [
    "Воскресение",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота"
];

const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
];

export function addPadForDigits(num) {
    return num.toString().padStart(2, "0");
}

export function convertToQueries(filters) {
    return filters.map(filter => {
        if (filter.field === "Оклад") {
            filter.value = Number(filter.value);
        }
        switch (filter.condition) {
            case "=":
                return Query.equal(
                    columnNames[filter.field],
                    filter.value
                )
                break;
            case "≠":
                return Query.notEqual(
                    columnNames[filter.field],
                    filter.value
                )
                break;
            case ">":
                return Query.greaterThan(
                    columnNames[filter.field],
                    filter.value
                )
                break;
            case "<":
                return Query.lessThan(
                    columnNames[filter.field],
                    filter.value
                )
                break;
            case "≥":
                return Query.greaterThanEqual(
                    columnNames[filter.field],
                    filter.value
                )
                break;
            case "≤":
                return Query.lessThanEqual(
                    columnNames[filter.field],
                    filter.value
                )
                break;
        }
    });
}

export function getCurrentDate() {
    const date = new Date();
    return [
        date.getFullYear(),
        addPadForDigits(date.getMonth() + 1),
        addPadForDigits(date.getDate()),
    ].join("-");
}

export function getCurrentMonthName() {
    return getMonthNameByNumber(getCurrentMonthNumber());
}

export function getCurrentMonthNumber() {
    const currDate = new Date();
    return currDate.getMonth() + 1;
}

export function getCurrentYear() {
    const currDate = new Date();
    return currDate.getFullYear();
}

export function getDayNameByDate(date) {
    const currentDate = new Date(date);
    return dayNames[currentDate.getDay()]
}

export function getDayNumberByName(dayName) {
    return dayNames.indexOf(dayName);
}

export function getDaysCount(year, month) {
    return new Date(year, month, 0).getDate();
}

export function getListOfMonths(start, stop) {
    return monthNames.filter((element, index) => {
        return index >= start && index <= stop;
    }) 
}

export function getListOfYears(year) {
    const currentYear = getCurrentYear();
    if (currentYear > year) return [...getRangeOfYears(year, currentYear)];
    return currentYear;
}

export function getMonthNameByNumber(monthNumber) {
    return monthNames[monthNumber - 1];
}

export function getMonthNumberByName(monthName) {
    return monthNames.indexOf(monthName) + 1;
}

function getRangeOfYears(start, stop) {
    const listOfNumbers = [];
    for (let val = start; val <= stop; val++) {
        listOfNumbers.push(val);
    }
    return listOfNumbers;
}

export function splitArray(array, size) {
    let splittedArray = [];
    for (let i = 0; i < array.length; i += size) {
        const arrayChunk = array.slice(i, i + size);
        splittedArray.push(arrayChunk);
    }
    return splittedArray;
}
