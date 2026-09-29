/*
    Program: Dining Booking Credit Extension
    Student Name: Julie Pokaran Vue
    Student ID: 240575
    Date: 29 September 2026
    Description: Student class for the Dining Meal Booking application.
*/

class Student {

    #studentId;
    #firstName;
    #lastName;

    constructor(studentId, firstName, lastName) {
        this.studentId = studentId;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters
    get studentId() {
        return this.#studentId;
    }

    get firstName() {
        return this.#firstName;
    }

    get lastName() {
        return this.#lastName;
    }

    // Setters
    set studentId(value) {
        if (!value || value.trim() === "") {
            throw new Error("Student ID cannot be empty.");
        }

        this.#studentId = value.trim();
    }

    set firstName(value) {
        if (!value || value.trim() === "") {
            throw new Error("First name cannot be empty.");
        }

        this.#firstName = value.trim();
    }

    set lastName(value) {
        if (!value || value.trim() === "") {
            throw new Error("Last name cannot be empty.");
        }

        this.#lastName = value.trim();
    }

    // Return the student's full name
    getFullName() {
        return `${this.#firstName} ${this.#lastName}`;
    }

    // Display student information
    displayInfo() {
        return `
========================================
          STUDENT DETAILS
========================================
Student ID: ${this.#studentId}
Student Name: ${this.getFullName()}
========================================
`;
    }
}

module.exports = Student;