const User = require("./User");

class StaffRequester extends User {
    #department;

    constructor(userId, firstName, lastName, email, department) {
        super(userId, firstName, lastName, email, "Staff");

        this.#department = department;
    }

    getDepartment() {
        return this.#department;
    }

    setDepartment(department) {
        if (!department || department.trim() === "") {
            throw new Error("Department cannot be empty.");
        }

        this.#department = department;
    }

    displayInfo() {
        return `${super.displayInfo()} - Department: ${this.#department}`;
    }
}

module.exports = StaffRequester;