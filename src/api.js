import { Account, Client, Databases, Query } from "appwrite";
import conf from "./config.js";

const client = new Client();
client
    .setEndpoint(conf.global.endPoint)
    .setProject(conf.global.projectID)
    .setSelfSigned();

export const account = new Account(client);
export const database = new Databases(client, conf.global.databaseID);

export async function getAllEmployees(workingOnly) {
    const query = [];
    if (workingOnly) {
        query.push(Query.equal("status", "Работает"));
    }
    const result = await database.listDocuments(
        conf.global.databaseID,
        conf.collections.employees,
        query
    );
    return result.total > 0 ? result.documents : [];
}

export async function getEmployeesCount() {
    const result = await database.listDocuments(
        conf.global.databaseID,
        conf.collections.employees
    )
    return result.total;
}

export async function getSettings() {
    const settings = {};
    const result = await database.listDocuments(
        conf.global.databaseID,
        conf.collections.settings
    );
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
    conf.holidays;
}

export async function getSettingID(key) {
    const settings = await getSettings();
    return settings[key] ? settings[key].id : undefined;
}

export async function getLimit() {
    const settings = await getSettings();
    return settings["limit"] ? Number(settings["limit"].value) : 20;
}