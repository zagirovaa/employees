import { Account, Client, Databases, Query } from "appwrite";
import conf from "./config.js";

const client = new Client();
client.setEndpoint(conf.global.endPoint).setProject(conf.global.projectID);
export const account = new Account(client);
export const database = new Databases(client, conf.global.databaseID);

export async function deleteState(state_id) {
    await database.deleteDocument(
        conf.global.databaseID,
        conf.collections.states,
        state_id
    );
}

export async function dismissReasonsExist() {
    const result = await database.listDocuments(
        conf.global.databaseID,
        conf.collections.reasons
    );
    return result.total > 0 ? true : false;
}

export async function getEmployees(workingOnly = false, sorted = false) {
    const query = [];
    if (workingOnly) query.push(Query.equal("status", "Работает"));
    if (sorted) query.push(Query.orderAsc("full_name"));
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

export async function getFilteredEmployees(filter) {
    const filteredEmployees = await database.listDocuments(
        conf.global.databaseID,
        conf.collections.employees,
        filter
    );
    return filteredEmployees.documents;
}

export async function jobTitlesExist() {
    const result = await database.listDocuments(
        conf.global.databaseID,
        conf.collections.jobs
    );
    return result.total > 0 ? true : false;
}
