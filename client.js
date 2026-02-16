import { STRINGS } from "./lang/en/en.js";

class LabAPI {
    constructor() {
        this.API_BASE_URL = "http://64.227.110.91:3000/lab4/api/v1";
        this.INSERT_ENDPOINT = `${this.API_BASE_URL}/insert`;
        this.SQL_ENDPOINT = `${this.API_BASE_URL}/sql/`;
    }

    async insertPatients() {
        const response = await fetch(this.INSERT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        return response.text();
    }

    async runQuery(query) {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(this.SQL_ENDPOINT + encodedQuery);
        return response.text();
    }
}


class LabUI {
    constructor(api) {
        this.api = api;
        this.buildUI();
    }

    buildUI() {
        document.title = STRINGS.appTitle;

        const insertHeading = this.createElement("h2", STRINGS.insertButtonHeading);
        const insertBtn = this.createElement("button", STRINGS.insertButtonLabel);
        const insertResponse = this.createElement("div");
        
        const hr = document.createElement("hr");
        const queryHeading = this.createElement("h2", STRINGS.textBoxHeading);

        const sqlQuery = document.createElement("textarea");
        sqlQuery.rows = 6;
        sqlQuery.cols = 60;

        const br1 = document.createElement("br");
        const br2 = document.createElement("br");

        const queryBtn = this.createElement("button", STRINGS.queryButtonLabel);
        const queryResponse = this.createElement("div");
        
        document.body.append(
            insertHeading,
            insertBtn,
            insertResponse,
            hr,
            queryHeading,
            sqlQuery,
            br1,
            br2,
            queryBtn,
            queryResponse
        );
        
        insertBtn.addEventListener("click", async () => {
            insertResponse.textContent = STRINGS.sending;
            try {
                insertResponse.textContent =
                    await this.api.insertPatients();
            } catch (err) {
                insertResponse.textContent =
                    STRINGS.errorPrefix + err.message;
            }
        });

        queryBtn.addEventListener("click", async () => {
            const query = sqlQuery.value.trim();
            if (!query) {
                queryResponse.textContent = STRINGS.emptyQuery;
                return;
            }

            queryResponse.textContent = STRINGS.sending;
            try {
                queryResponse.textContent =
                    await this.api.runQuery(query);
            } catch (err) {
                queryResponse.textContent =
                    STRINGS.errorPrefix + err.message;
            }
        });
    }

    createElement(tag, text = "") {
        const el = document.createElement(tag);
        if (text) {
            el.textContent = text;
        }
        return el;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const api = new LabAPI();
    new LabUI(api);
});
