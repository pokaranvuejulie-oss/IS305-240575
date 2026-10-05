const fs = require("fs/promises");
const path = require("path");

class ServiceRequestFileRepository {
    constructor(
        filePath = path.join(
            __dirname,
            "..",
            "data",
            "serviceRequests.json"
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

            const requests = JSON.parse(data);

            if (!Array.isArray(requests)) {
                throw new Error(
                    "Service request data must be stored as an array."
                );
            }

            return requests;
        } catch (error) {
            if (error.code === "ENOENT") {
                return [];
            }

            if (error instanceof SyntaxError) {
                throw new Error(
                    "Service requests JSON file contains invalid data."
                );
            }

            throw new Error(
                `Unable to load service requests: ${error.message}`
            );
        }
    }

    async saveAll(requests) {
        if (!Array.isArray(requests)) {
            throw new Error(
                "Service requests must be provided as an array."
            );
        }

        const jsonData = JSON.stringify(requests, null, 2);

        try {
            await fs.writeFile(this.filePath, jsonData, "utf8");
        } catch (error) {
            throw new Error(
                `Unable to save service requests: ${error.message}`
            );
        }
    }

    async create(requestData) {
        const requests = await this.loadAll();

        const existingRequest = requests.find(
            request => request.requestId === requestData.requestId
        );

        if (existingRequest) {
            throw new Error("Request ID already exists.");
        }

        requests.push(requestData);

        await this.saveAll(requests);

        return requestData;
    }

    async findById(requestId) {
        const requests = await this.loadAll();

        return (
            requests.find(
                request => request.requestId === requestId
            ) || null
        );
    }

    async findByRequester(userId) {
        const requests = await this.loadAll();

        return requests.filter(
            request =>
                request.requester &&
                request.requester.userId === userId
        );
    }

    async findByTechnician(technicianId) {
        const requests = await this.loadAll();

        return requests.filter(
            request =>
                request.technician &&
                request.technician.userId === technicianId
        );
    }

    async update(requestId, changes) {
        const requests = await this.loadAll();

        const index = requests.findIndex(
            request => request.requestId === requestId
        );

        if (index === -1) {
            throw new Error("Request not found.");
        }

        requests[index] = {
            ...requests[index],
            ...changes,
            requestId: requests[index].requestId
        };

        await this.saveAll(requests);

        return requests[index];
    }
}

module.exports = ServiceRequestFileRepository;