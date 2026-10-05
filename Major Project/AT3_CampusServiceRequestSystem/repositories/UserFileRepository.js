const fs = require("fs/promises");
const path = require("path");

class UserFileRepository {
    constructor(filePath = path.join(__dirname, "..", "data", "users.json")) {
        this.filePath = filePath;
    }

    async loadAll() {
        try {
            const data = await fs.readFile(this.filePath, "utf8");

            if (!data.trim()) {
                return [];
            }

            const users = JSON.parse(data);

            if (!Array.isArray(users)) {
                throw new Error("User data must be stored as an array.");
            }

            return users;
        } catch (error) {
            if (error.code === "ENOENT") {
                return [];
            }

            if (error instanceof SyntaxError) {
                throw new Error("Users JSON file contains invalid data.");
            }

            throw new Error(`Unable to load users: ${error.message}`);
        }
    }

    async saveAll(users) {
        if (!Array.isArray(users)) {
            throw new Error("Users must be provided as an array.");
        }

        const jsonData = JSON.stringify(users, null, 2);

        try {
            await fs.writeFile(this.filePath, jsonData, "utf8");
        } catch (error) {
            throw new Error(`Unable to save users: ${error.message}`);
        }
    }

    async create(userData) {
        const users = await this.loadAll();

        const existingUser = users.find(
            user => user.userId === userData.userId
        );

        if (existingUser) {
            throw new Error("User ID already exists.");
        }

        users.push(userData);
        await this.saveAll(users);

        return userData;
    }

    async findById(userId) {
        const users = await this.loadAll();

        return users.find(user => user.userId === userId) || null;
    }

    async update(userId, changes) {
        const users = await this.loadAll();

        const index = users.findIndex(
            user => user.userId === userId
        );

        if (index === -1) {
            throw new Error("User not found.");
        }

        users[index] = {
            ...users[index],
            ...changes,
            userId: users[index].userId
        };

        await this.saveAll(users);

        return users[index];
    }
}

module.exports = UserFileRepository;