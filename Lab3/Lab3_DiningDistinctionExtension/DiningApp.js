/*
    Program: Dining Meal Booking Feature
    Student Name: Julie Pokaran Vue
    Student ID: 240575
    Date: 29 September 2026
    Description: A JavaScript program demonstrating a dining
    meal booking system using Node.js.
*/

const DiningAccount = require("./DiningAccount");
const RewardsDiningAccount = require("./RewardsDiningAccount");
const CreditDiningAccount = require("./CreditDiningAccount");
const Student = require("./Student");
const MealBooking = require("./MealBooking");
console.log("===== LAB 3 ACCOUNT TEST =====");

// Standard Dining Account
const account = new DiningAccount("DA001", 1000);

account.deposit(500, "Weekly meal allowance");
account.payForMeal(200, "Lunch payment");

console.log(`Standard account final balance: K${account.getBalance().toFixed(2)}`);

// Rewards Dining Account
const rewardsAccount = new RewardsDiningAccount("RA001", 1500, 2.5);

rewardsAccount.deposit(500, "Additional meal funds");

console.log(
    `Reward calculated: K${rewardsAccount.calculateReward().toFixed(2)}`
);

rewardsAccount.applyReward();

console.log(
    `Rewards account final balance: K${rewardsAccount.getBalance().toFixed(2)}`
);

// Credit Dining Account
const creditAccount = new CreditDiningAccount("CA001", 1000, 500);

console.log(
    `Credit account starting balance: K${creditAccount.getBalance().toFixed(2)}`
);

const creditPayment = creditAccount.payForMeal(
    1500,
    "Large meal payment"
);

console.log(`Credit payment successful: ${creditPayment}`);
console.log(
    `Credit account balance after payment: K${creditAccount.getBalance().toFixed(2)}`
);

// Test payment beyond credit limit
const rejectedPayment = creditAccount.payForMeal(
    1,
    "Payment beyond credit limit"
);

console.log(`Payment beyond limit successful: ${rejectedPayment}`);
// Polymorphism demonstration
console.log("\n===== POLYMORPHISM TEST =====");

const accounts = [
    account,
    rewardsAccount,
    creditAccount
];

accounts.forEach((currentAccount) => {
    currentAccount.displayAccountSummary();
});
// Student and Dining Account connection test
console.log("\n===== STUDENT ACCOUNT TEST =====");

const student = new Student(
    "S001",
    "Julie",
    "Vue"
);

student.assignDiningAccount(account);

console.log(
    `Student dining account: ${student.diningAccount.accountNumber}`
);

console.log(
    `Student account balance: K${student.diningAccount.getBalance().toFixed(2)}`
);
// Meal Booking Payment Test
console.log("\n===== MEAL BOOKING PAYMENT TEST =====");

const booking = new MealBooking({
    student: student,
    mealDate: "30 September 2026",
    mealType: "Lunch",
    quantity: 1,
    dietaryNote: "No spicy food"
});

console.log(`Booking total: K${booking.calculateTotal().toFixed(2)}`);
console.log(`Booking status before payment: ${booking.bookingStatus}`);

const paymentResult = booking.processPayment(
    student.diningAccount
);

console.log(`Payment successful: ${paymentResult}`);
console.log(`Booking status after payment: ${booking.bookingStatus}`);
console.log(
    `Account balance after payment: K${student.diningAccount.getBalance().toFixed(2)}`
);
// Transaction History Test
console.log("\n===== TRANSACTION HISTORY TEST =====");

const transactions = student.diningAccount.getTransactions();

transactions.forEach((transaction, index) => {
    console.log(`\nTransaction ${index + 1}`);
    console.log(`Type: ${transaction.type}`);
    console.log(`Amount: K${transaction.amount.toFixed(2)}`);
    console.log(`Description: ${transaction.description}`);
    console.log(`Date/Time: ${transaction.dateTime}`);
    console.log(
        `Balance After: K${transaction.balanceAfter.toFixed(2)}`
    );
});
// Duplicate Payment Test
console.log("\n===== DUPLICATE PAYMENT TEST =====");

try {
    booking.processPayment(student.diningAccount);
} catch (error) {
    console.log(`Duplicate payment rejected: ${error.message}`);
}

console.log(
    `Balance after duplicate payment attempt: K${student.diningAccount.getBalance().toFixed(2)}`
);
// Simulated Overloading Test
console.log("\n===== SIMULATED OVERLOADING TEST =====");

const basicAccount = new DiningAccount("DA002");

const accountWithOpeningBalance = new DiningAccount("DA003", 500);

basicAccount.deposit(100);
basicAccount.deposit(100, "Additional meal funds");

console.log(
    `DA002 balance: K${basicAccount.getBalance().toFixed(2)}`
);

console.log(
    `DA003 balance: K${accountWithOpeningBalance.getBalance().toFixed(2)}`
);

console.log(
    `DA002 transactions: ${basicAccount.getTransactions().length}`
);
// Insufficient Balance Test
console.log("\n===== INSUFFICIENT BALANCE TEST =====");

const lowBalanceAccount = new DiningAccount("DA004", 100);

const insufficientPayment = lowBalanceAccount.payForMeal(
    150,
    "Meal payment exceeding balance"
);

console.log(`Payment successful: ${insufficientPayment}`);
console.log(
    `Balance after rejected payment: K${lowBalanceAccount.getBalance().toFixed(2)}`
);