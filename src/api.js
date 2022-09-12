import { Account, Client, Databases } from "appwrite";


const EMAIL = "test@netcon.pro";
const PASSWORD = "11111111";

const END_POINT = "http://localhost/v1";

const PROJECT_ID = "62d14f7a52973db50040";
const DATABASE_ID ="62d14fe7da7ae3d3a437";

export const EMPLOYEES_COL_ID = "62d15adca365e871a654";
export const JOBS_COL_ID = "62d15002f14d9b2accd0";
export const REASONS_COL_ID = "62d151c1197064a173b1";
export const SETS_COL_ID = "630880867803a0d3e7d3";
export const STATES_COL_ID = "630b4f6caf52194e911b";

const DEFAULT_HOLIDAYS = ["Суббота", "Воскресение"];

const client = new Client();
client.setEndpoint(END_POINT).setProject(PROJECT_ID);

const account = new Account(client);
const auth = account.get();
auth.then(user => {
    console.log(`User ${user.name} is logged in.`);
}, error => {
    const acct = account.createEmailSession(EMAIL, PASSWORD);
    acct.then(function (user) {
        console.log(`User ${user.name} is logged in.`);
    }, function (error) {
        console.log(error);
    });
});

export const database = new Databases(client, DATABASE_ID);

export async function getAllEmployees() {
    const result = await database.listDocuments(
        EMPLOYEES_COL_ID, [], 100, 0, "", "after", ["full_name"], ["ASC"]
    );
    return result.total > 0 ? result.documents : [];
}

export async function getEmployeesCount() {
    const result = await database.listDocuments(EMPLOYEES_COL_ID);
    return result.total;
}

export async function getSettings() {
    const settings = {};
    const result = await database.listDocuments(SETS_COL_ID);
    if (result.total > 0) {
        for (let setting of result.documents) {
            settings[setting.key] = {};
            settings[setting.key].id = setting.$id;
            settings[setting.key].value = setting.value;
        }
    }
    return settings;
}

export async function getHolidays() {
    const settings = await getSettings();
    return settings["holidays"] ? 
    settings["holidays"].value.split(",") : 
    DEFAULT_HOLIDAYS;
}

export async function getSettingID(key) {
    const settings = await getSettings();
    return settings[key] ? settings[key].id : undefined;
}

export async function getLimit() {
    const settings = await getSettings();
    return settings["limit"] ? Number(settings["limit"].value) : 20;
}