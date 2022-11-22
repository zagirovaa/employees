import { Account, Client, Databases, Query } from "appwrite";

import conf from "./config.js";

const client = new Client();
client.setEndpoint(conf.global.endPoint).setProject(conf.global.projectID);
export const account = new Account(client);
export const database = new Databases(client, conf.global.databaseID);

export async function deleteState(stateId) {
    try {
        await database.deleteDocument(
            conf.global.databaseID,
            conf.collections.states,
            stateId
        );
    } catch (error) {
        console.error(error);
    } 
}

export async function dismissReasonsExist() {
    try {
        const result = await database.listDocuments(
            conf.global.databaseID,
            conf.collections.reasons
        );
        return result.total > 0 ? true : false;
    } catch (error) {
        console.error(error);
    }
}

export async function getEmployees(workingOnly = false, sortedByName = false) {
    const query = [];
    if (workingOnly) query.push(Query.equal("status", "Работает"));
    if (sortedByName) query.push(Query.orderAsc("full_name"));
    try {
        const result = await database.listDocuments(
            conf.global.databaseID,
            conf.collections.employees,
            query
        );
        return result.total > 0 ? result.documents : [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getEmployeesCount() {
    try {
        const result = await database.listDocuments(
            conf.global.databaseID,
            conf.collections.employees
        )
        return result.total;
    } catch (error) {
        console.error(error);
    }
}

export async function getFilteredEmployees(filter) {
    try {
        const filteredEmployees = await database.listDocuments(
            conf.global.databaseID,
            conf.collections.employees,
            filter
        );
        return filteredEmployees.documents;
    } catch (error) {
        console.error(error);
    }
}

export async function jobTitlesExist() {
    try {
        const result = await database.listDocuments(
            conf.global.databaseID,
            conf.collections.jobs
        );
        return result.total > 0 ? true : false;
    } catch (error) {
        console.error(error);
    }
}
