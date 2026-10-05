class User {
    #userId;
    #firstName;
    #lastName;
    #email;
    #userType;

    constructor(userId, firstName, lastName, email, userType) {
        this.#userId = userId;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#email = email;
        this.#userType = userType;
    }

    getUserId() {
        return this.#userId;
    }

    getFirstName() {
        return this.#firstName;
    }

    getLastName() {
        return this.#lastName;
    }

    getEmail() {
        return this.#email;
    }

    getUserType() {
        return this.#userType;
    }

    setFirstName(firstName) {
        if (!firstName || firstName.trim() === "") {
            throw new Error("First name cannot be empty.");
        }

        this.#firstName = firstName;
    }

    setLastName(lastName) {
        if (!lastName || lastName.trim() === "") {
            throw new Error("Last name cannot be empty.");
        }

        this.#lastName = lastName;
    }

    setEmail(email) {
        if (!email || !email.includes("@")) {
            throw new Error("Invalid email address.");
        }

        this.#email = email;
    }

    setUserType(userType) {
       const validTypes = [
    "Student",
    "Staff",
    "Service Officer",
    "Technician"
];

        if (!validTypes.includes(userType)) {
        throw new Error("User type must be Student, Staff, Service Officer, or Technician.");
        }

        this.#userType = userType;
    }

    getFullName() {
        return `${this.#firstName} ${this.#lastName}`;
    }

    validate() {
        if (!this.#userId || this.#userId.trim() === "") {
            throw new Error("User ID is required.");
        }

        if (!this.#firstName || this.#firstName.trim() === "") {
            throw new Error("First name is required.");
        }

        if (!this.#lastName || this.#lastName.trim() === "") {
            throw new Error("Last name is required.");
        }

        if (!this.#email || !this.#email.includes("@")) {
            throw new Error("Invalid email address.");
        }

       const validTypes = [
    "Student",
    "Staff",
    "Service Officer",
    "Technician"
];

if (!validTypes.includes(this.#userType)) {
    throw new Error(
        "User type must be Student, Staff, Service Officer, or Technician."
    );
}

        return true;
    }

    displayInfo() {
        return `${this.#userId} - ${this.getFullName()} - ${this.#email} - ${this.#userType}`;
    }
    toData() {
    return {
        userId: this.#userId,
        firstName: this.#firstName,
        lastName: this.#lastName,
        email: this.#email,
        userType: this.#userType
    };
}
}

module.exports = User;