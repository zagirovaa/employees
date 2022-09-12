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
]

const dayNames = [
    "Воскресение",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота"
]

function yearsRange(start, stop) {
    const listOfNumbers = [];
    for (let val = start; val <= stop; val++) {
        listOfNumbers.push(val);
    }
    return listOfNumbers;
}

export function padForDigits(num) {
    return num.toString().padStart(2, "0");
}

export function sortEmployees(employees) {
    return employees.sort(
        (a, b) => a.full_name < b.full_name ? -1 :
        (a.full_name > b.full_name ? 1 : 0)
    );
}

export function getCurrentDate() {
    const date = new Date();
    return [
        date.getFullYear(),
        padForDigits(date.getMonth() + 1),
        padForDigits(date.getDate()),
    ].join("-");
}

export function getCurrentYear() {
    const currDate = new Date();
    return currDate.getFullYear();
}

export function getCurrentMonthNumber() {
    const currDate = new Date();
    return currDate.getMonth() + 1;
}

export function getMonthNameByNumber(monthNumber) {
    return monthNames[monthNumber - 1];
}

export function getMonthNumberByName(monthName) {
    for (let item = 0; 11; item++) {
        if (monthNames[item] === monthName ) {
            return item + 1;
        }
    }
}

export function getCurrentMonthName() {
    return getMonthNameByNumber(getCurrentMonthNumber());
}

export function getListOfYears(year) {
    const listOfYears = [];
    const currentYear = getCurrentYear();
    if (currentYear === year) {
        listOfYears.push(currentYear) ;
    } else if (currentYear > year) {
        listOfYears.push(...yearsRange(year, currentYear));
    }
    return listOfYears;
}

export function getListOfMonths(start, stop) {
    const listOfMonths = [];
    for (let value = start; value <= stop; value++) {
        listOfMonths.push(monthNames[value]);
    }
    return listOfMonths;
}

export function getDaysCount(year, month) {
    return new Date(year, month, 0).getDate();
}

export function getDayNameByDate(date) {
    const currentDate = new Date(date);
    return dayNames[currentDate.getDay()]
}

export function getDayNumberByName(dayName) {
    for (let dayNumber in dayNames) {
        if (dayNames[dayNumber] == dayName) {
            return dayNumber;
        }
    }
}

export function splitArray(array, size) {
    let newArray = [];
    for (let i = 0; i < array.length; i += size) {
        const chunk = array.slice(i, i + size);
        newArray.push(chunk);
    }
    return newArray;
}
