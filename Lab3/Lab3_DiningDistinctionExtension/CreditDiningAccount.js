/*
    Program: Dining Account Distinction Extension
    Student Name: Julie Pokaran Vue
    Student ID: 240575
    Date: 30 September 2026
    Description: CreditDiningAccount subclass for the Lab 3
    Dining Meal Booking application.
*/

const DiningAccount = require("./DiningAccount");

class CreditDiningAccount extends DiningAccount {

    #creditLimit;

    constructor(accountNumber, openingBalance, creditLimit) {

        // Constructor chaining
        super(accountNumber, openingBalance);

        if (creditLimit < 0) {
            throw new Error("Credit limit cannot be negative.");
        }

        this.#creditLimit = creditLimit;
    }

    // Override payForMeal to allow the account to use credit
    payForMeal(amount, description = "Meal payment") {

        if (amount <= 0) {
            throw new Error("Payment amount must be greater than zero.");
        }

        const newBalance = this.getBalance() - amount;

        if (newBalance < -this.#creditLimit) {
            console.log(
                `Payment rejected: Credit limit exceeded. Credit limit: K${this.#creditLimit.toFixed(2)}`
            );
            return false;
        }


this._recordTransaction(
    "Meal Payment",
    amount,
    description,
    newBalance
);

return true;
    }

    displayAccountSummary() {

        console.log("\n========================================");
        console.log("         CREDIT DINING ACCOUNT");
        console.log("========================================");
        console.log(`Account Number: ${this.accountNumber}`);
        console.log("Account Type: CreditDiningAccount");
        console.log(`Credit Limit: K${this.#creditLimit.toFixed(2)}`);
        console.log(`Current Balance: K${this.getBalance().toFixed(2)}`);
        console.log("========================================");
    }
}

module.exports = CreditDiningAccount;