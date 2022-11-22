import { Query } from "appwrite";

export const columnNames = {
    "N":                     "",
    "Дата приема":          "date_of_employment",
    "Фамилия Имя Отчество": "full_name",
    "Должность":            "job_title",
    "Оклад":                "salary",
    "Статус":               "status"
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
                    columnNames[filter.field], filter.value
                );
                break;
            case "≠":
                return Query.notEqual(
                    columnNames[filter.field], filter.value
                );
                break;
            case ">":
                return Query.greaterThan(
                    columnNames[filter.field], filter.value
                );
                break;
            case "<":
                return Query.lessThan(
                    columnNames[filter.field], filter.value
                );
                break;
            case "≥":
                return Query.greaterThanEqual(
                    columnNames[filter.field], filter.value
                );
                break;
            case "≤":
                return Query.lessThanEqual(
                    columnNames[filter.field], filter.value
                );
                break;
        }
    });
}

export function getCurrentDate() {
    const currentDate = new Date();
    return [
        currentDate.getFullYear(),
        addPadForDigits(currentDate.getMonth() + 1),
        addPadForDigits(currentDate.getDate()),
    ].join("-");
}

export function getCurrentMonthName() {
    return getMonthNameByNumber(getCurrentMonthNumber());
}

export function getCurrentMonthNumber() {
    return new Date().getMonth() + 1;
}

export function getCurrentYear() {
    return new Date().getFullYear();
}

export function getDayNameByDate(date) {
    return dayNames[new Date(date).getDay()];
}

export function getDayNumberByName(dayName) {
    return dayNames.indexOf(dayName);
}

export function getDaysCount(year, month) {
    return new Date(year, month, 0).getDate();
}

export function getMonthsRange(start, stop) {
    return monthNames.filter((element, index) => {
        return index >= start && index <= stop;
    }) 
}

export function getYearsRange(year) {
    const currentYear = getCurrentYear();
    if (currentYear > year) return [...getNumbersRange(year, currentYear)];
    return [currentYear];
}

export function getMonthNameByNumber(monthNumber) {
    return monthNames[monthNumber - 1];
}

export function getMonthNumberByName(monthName) {
    return monthNames.indexOf(monthName) + 1;
}

function getNumbersRange(start, stop) {
    return new Array((stop + 1) - start).fill().map(
        (item, index) => index + start
    );
}

export function splitArray(array, size) {
    let splittedArray = [];
    for (let i = 0; i < array.length; i += size) {
        const arrayChunk = array.slice(i, i + size);
        splittedArray.push(arrayChunk);
    }
    return splittedArray;
}
