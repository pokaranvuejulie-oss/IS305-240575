/*
    Program: Dining Account Distinction Extension
    Student Name: Julie Pokaran Vue
    Student ID: 240575
    Date: 30 September 2026
    Description: Base DiningAccount class for the Lab 3
    Dining Meal Booking application.
*/

class DiningAccount {

    #accountNumber;
    #balance;
    #transactions;

    constructor(accountNumber, openingBalance = 0) {

        if (!accountNumber || accountNumber.trim() === "") {
            throw new Error("Account number cannot be empty.");
        }

        if (openingBalance < 0) {
            throw new Error("Opening balance cannot be negative.");
        }

        this.#accountNumber = accountNumber.trim();
        this.#balance = openingBalance;
        this.#transactions = [];

        if (openingBalance > 0) {
           this._recordTransaction(
    "Deposit",
    openingBalance,
    "Opening balance",
    this.#balance
);
        }
    }

    // Getters
    get accountNumber() {
        return this.#accountNumber;
    }

    getBalance() {
        return this.#balance;
    }

    getTransactions() {
        return [...this.#transactions];
    }

    // Deposit money into the account
    deposit(amount, description = "Deposit") {

        if (amount <= 0) {
            throw new Error("Deposit amount must be greater than zero.");
        }

        this.#balance += amount;

        this._recordTransaction(
    "Deposit",
    amount,
    description,
    this.#balance
);
        return true;
    }

    // Pay for a meal if sufficient funds are available
    payForMeal(amount, description = "Meal payment") {

        if (amount <= 0) {
            throw new Error("Payment amount must be greater than zero.");
        }

        if (amount > this.#balance) {
            console.log(
                `Payment rejected: Insufficient funds. Current balance: K${this.#balance.toFixed(2)}`
            );
            return false;
        }

        this.#balance -= amount;

       this._recordTransaction(
    "Meal Payment",
    amount,
    description,
    this.#balance
);
        return true;
    }

    // Display account information
    displayAccountSummary() {

        console.log("\n========================================");
        console.log("          STANDARD DINING ACCOUNT");
        console.log("========================================");
        console.log(`Account Number: ${this.#accountNumber}`);
        console.log("Account Type: DiningAccount");
        console.log(`Current Balance: K${this.#balance.toFixed(2)}`);
        console.log("========================================");
    }

   // Update balance and record a transaction
_recordTransaction(type, amount, description, newBalance) {

    this.#balance = newBalance;

    this.#transactions.push({
        type: type,
        amount: amount,
        description: description,
        dateTime: new Date().toLocaleString(),
        balanceAfter: this.#balance
    });
}

}

module.exports = DiningAccount;