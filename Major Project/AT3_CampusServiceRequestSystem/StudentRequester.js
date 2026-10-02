const User = require("./User");

class StudentRequester extends User {
    #programme;
    #yearLevel;

    constructor(userId, firstName, lastName, email, programme, yearLevel) {
        super(userId, firstName, lastName, email, "Student");

        this.#programme = programme;
        this.#yearLevel = yearLevel;
    }

    getProgramme() {
        return this.#programme;
    }

    getYearLevel() {
        return this.#yearLevel;
    }

    setProgramme(programme) {
        if (!programme || programme.trim() === "") {
            throw new Error("Programme cannot be empty.");
        }

        this.#programme = programme;
    }

    setYearLevel(yearLevel) {
        if (!yearLevel || yearLevel < 1) {
            throw new Error("Year level must be at least 1.");
        }

        this.#yearLevel = yearLevel;
    }

    displayInfo() {
        return `${super.displayInfo()} - Programme: ${this.#programme} - Year Level: ${this.#yearLevel}`;
    }
}

module.exports = StudentRequester;