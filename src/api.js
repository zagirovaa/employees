import { Account, Client, Databases, Query } from "appwrite";
import conf from "./config.js";

const client = new Client();
client.setEndpoint(conf.global.endPoint).setProject(conf.global.projectID);

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