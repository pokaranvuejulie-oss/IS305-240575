const fs = require("fs/promises");
const path = require("path");

class RequestHistoryFileRepository {
    constructor(
        filePath = path.join(
            __dirname,
            "..",
            "data",
            "requestHistory.json"
        )
    ) {
        this.filePath = filePath;
    }

    async loadAll() {
        try {
            const data = await fs.readFile(this.filePath, "utf8");

            if (!data.trim()) {
                return [];
            }

            const history = JSON.parse(data);

            if (!Array.isArray(history)) {
                throw new Error(
                    "Request history data must be stored as an array."
                );
            }

            return history;
        } catch (error) {
            if (error.code === "ENOENT") {
                return [];
            }

            if (error instanceof SyntaxError) {
                throw new Error(
                    "Request history JSON file contains invalid data."
                );
            }

            throw new Error(
                `Unable to load request history: ${error.message}`
            );
        }
    }

    async saveAll(history) {
        if (!Array.isArray(history)) {
            throw new Error(
                "Request history must be provided as an array."
            );
        }

        const jsonData = JSON.stringify(history, null, 2);

        try {
            await fs.writeFile(this.filePath, jsonData, "utf8");
        } catch (error) {
            throw new Error(
                `Unable to save request history: ${error.message}`
            );
        }
    }

    async create(historyData) {
        const history = await this.loadAll();

        history.push(historyData);

        await this.saveAll(history);

        return historyData;
    }

    async findByRequestId(requestId) {
        const history = await this.loadAll();

        return history.filter(
            entry => entry.requestId === requestId
        );
    }

    async findByActorId(actorId) {
        const history = await this.loadAll();

        return history.filter(
            entry => entry.actorId === actorId
        );
    }
}

module.exports = RequestHistoryFileRepository;