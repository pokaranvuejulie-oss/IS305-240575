/*
    Program: Dining Account Distinction Extension
    Student Name: Julie Pokaran Vue
    Student ID: 240575
    Date: 30 September 2026
    Description: RewardsDiningAccount subclass for the Lab 3
    Dining Meal Booking application.
*/

const DiningAccount = require("./DiningAccount");

class RewardsDiningAccount extends DiningAccount {

    #rewardRate;

    constructor(accountNumber, openingBalance, rewardRate) {

        // Constructor chaining
        super(accountNumber, openingBalance);

        if (rewardRate < 0) {
            throw new Error("Reward rate cannot be negative.");
        }

        this.#rewardRate = rewardRate;
    }

    // Calculate reward based on current balance
    calculateReward() {
        return this.getBalance() * this.#rewardRate / 100;
    }

    // Apply the calculated reward to the account
    applyReward() {

        const reward = this.calculateReward();

        if (reward > 0) {
            this.deposit(reward, "Reward applied");
        }

        return reward;
    }

    // Override the account summary
    displayAccountSummary() {

        console.log("\n========================================");
        console.log("        REWARDS DINING ACCOUNT");
        console.log("========================================");
        console.log(`Account Number: ${this.accountNumber}`);
        console.log("Account Type: RewardsDiningAccount");
        console.log(`Reward Rate: ${this.#rewardRate}%`);
        console.log(`Current Balance: K${this.getBalance().toFixed(2)}`);
        console.log("========================================");
    }
}

module.exports = RewardsDiningAccount;