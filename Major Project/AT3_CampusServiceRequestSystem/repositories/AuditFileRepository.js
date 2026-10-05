const fs = require("fs/promises");
const path = require("path");

class AuditFileRepository {
    constructor(
        filePath = path.join(
            __dirname,
            "..",
            "data",
            "auditLog.json"
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

            const auditLog = JSON.parse(data);

            if (!Array.isArray(auditLog)) {
                throw new Error(
                    "Audit log data must be stored as an array."
                );
            }

            return auditLog;
        } catch (error) {
            if (error.code === "ENOENT") {
                return [];
            }

            if (error instanceof SyntaxError) {
                throw new Error(
                    "Audit log JSON file contains invalid data."
                );
            }

            throw new Error(
                `Unable to load audit log: ${error.message}`
            );
        }
    }

    async saveAll(auditLog) {
        if (!Array.isArray(auditLog)) {
            throw new Error(
                "Audit log must be provided as an array."
            );
        }

        const jsonData = JSON.stringify(auditLog, null, 2);

        try {
            await fs.writeFile(this.filePath, jsonData, "utf8");
        } catch (error) {
            throw new Error(
                `Unable to save audit log: ${error.message}`
            );
        }
    }

    async create(auditData) {
        const auditLog = await this.loadAll();

        auditLog.push(auditData);

        await this.saveAll(auditLog);

        return auditData;
    }

    async findByRequestId(requestId) {
        const auditLog = await this.loadAll();

        return auditLog.filter(
            entry => entry.requestId === requestId
        );
    }

    async findByActorId(actorId) {
        const auditLog = await this.loadAll();

        return auditLog.filter(
            entry => entry.actorId === actorId
        );
    }

    async findByAction(action) {
        const auditLog = await this.loadAll();

        return auditLog.filter(
            entry => entry.action === action
        );
    }
}

module.exports = AuditFileRepository;