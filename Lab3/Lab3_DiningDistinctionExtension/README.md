# Lab 3: Dining Account Distinction Extension

## Student Information

* **Student Name:** Julie Pokaran Vue
* **Student ID:** 240575
* **Course:** IS305 Object-Oriented Programming
* **Technology:** JavaScript and Node.js
* **Repository:** https://github.com/pokaranvuejulie-oss/IS305-240575.git

## Project Description

This project extends the Dining Meal Booking application developed in Lab 1 and Lab 2.

Lab 3 introduces different types of dining accounts and demonstrates advanced object-oriented programming concepts in JavaScript.

The application includes:

* Standard dining accounts
* Rewards dining accounts
* Credit dining accounts
* Student and dining account relationships
* Meal booking payment processing
* Transaction history
* Inheritance
* Constructor chaining
* Method overriding
* Polymorphism
* Simulated method overloading
* Validation and error handling

No database is required for this application.

---

## Files Included

The project contains the following files:

* `Student.js` - Represents a student and their assigned dining account.
* `MealBooking.js` - Represents meal bookings and processes payments.
* `DiningAccount.js` - Base class for standard dining accounts.
* `RewardsDiningAccount.js` - Subclass that provides reward calculations.
* `CreditDiningAccount.js` - Subclass that allows controlled use of credit.
* `DiningApp.js` - Main application used to demonstrate and test the system.
* `README.md` - Project documentation.

---

## 1. DiningAccount Class

The `DiningAccount` class is the base class for all dining accounts.

It contains the following private fields:

* `#accountNumber`
* `#balance`
* `#transactions`

The constructor supports two forms:

```javascript
new DiningAccount("DA001");
new DiningAccount("DA002", 500);
```

The opening balance defaults to `0` when it is not supplied.

### Main Methods

#### `deposit(amount, description)`

Adds money to the account and records the transaction.

Example:

```javascript
account.deposit(500, "Weekly meal allowance");
```

#### `payForMeal(amount, description)`

Deducts money from the account when sufficient funds are available.

A standard dining account cannot have a negative balance.

#### `getBalance()`

Returns the current account balance.

#### `getTransactions()`

Returns a copy of the account transaction history.

#### `displayAccountSummary()`

Displays the account number, account type and current balance.

---

## 2. RewardsDiningAccount Class

`RewardsDiningAccount` extends `DiningAccount`.

The inheritance relationship is:

```text
DiningAccount
      |
      v
RewardsDiningAccount
```

It contains a private field:

* `#rewardRate`

The constructor uses `super()` to call the parent class constructor.

Example:

```javascript
const rewardsAccount =
    new RewardsDiningAccount("RA001", 1500, 2.5);
```

### Reward Calculation

The reward is calculated using:

```text
Reward = Current Balance × Reward Rate / 100
```

For example, a balance of K2000 with a reward rate of 2.5% produces:

```text
K2000 × 2.5 / 100 = K50
```

The `applyReward()` method adds the calculated reward to the account.

---

## 3. CreditDiningAccount Class

`CreditDiningAccount` also extends `DiningAccount`.

The inheritance relationship is:

```text
DiningAccount
      |
      +----------------------+
      |                      |
      v                      v
RewardsDiningAccount   CreditDiningAccount
```

The class contains the private field:

* `#creditLimit`

The constructor uses `super()` to initialise the inherited account information.

Example:

```javascript
const creditAccount =
    new CreditDiningAccount("CA001", 1000, 500);
```

The account can make payments that reduce the balance below zero, but it cannot exceed its credit limit.

For example:

```text
Starting balance = K1000
Credit limit = K500
Meal payment = K1500

Final balance = K-500
```

A payment that would reduce the balance below `-K500` is rejected.

---

## 4. Constructor Chaining

Constructor chaining is demonstrated by both subclasses.

`RewardsDiningAccount` calls:

```javascript
super(accountNumber, openingBalance);
```

`CreditDiningAccount` also calls:

```javascript
super(accountNumber, openingBalance);
```

This allows the parent `DiningAccount` constructor to initialise the inherited account number, balance and transaction information.

---

## 5. Method Overriding

`RewardsDiningAccount` overrides:

```javascript
displayAccountSummary()
```

`CreditDiningAccount` also overrides:

```javascript
displayAccountSummary()
```

`CreditDiningAccount` additionally overrides:

```javascript
payForMeal()
```

The overridden `payForMeal()` method changes the standard payment behaviour so that the account can use its approved credit limit.

---

## 6. Polymorphism

Polymorphism is demonstrated by storing different account objects in the same array:

```javascript
const accounts = [
    account,
    rewardsAccount,
    creditAccount
];
```

The application then calls:

```javascript
accounts.forEach((currentAccount) => {
    currentAccount.displayAccountSummary();
});
```

Although all objects are treated as `DiningAccount` objects, JavaScript calls the appropriate overridden method for each account type.

---

## 7. Simulated Method Overloading

JavaScript does not support traditional method overloading based on different parameter lists.

The application therefore demonstrates simulated overloading using default parameters.

The `deposit()` method is defined as:

```javascript
deposit(amount, description = "Deposit")
```

This allows it to be called in two ways:

```javascript
account.deposit(100);
```

or:

```javascript
account.deposit(100, "Additional meal funds");
```

The first call uses the default description, while the second call provides a custom description.

The constructor also demonstrates optional parameters:

```javascript
new DiningAccount("DA001");
```

and:

```javascript
new DiningAccount("DA002", 500);
```

The opening balance defaults to zero when it is not supplied.

---

## 8. Student and Dining Account Connection

The `Student` class contains a private field:

```javascript
#diningAccount
```

A student can be assigned a dining account using:

```javascript
student.assignDiningAccount(account);
```

The method validates that the supplied object is a `DiningAccount` or one of its subclasses.

This allows a student to use a standard, rewards or credit dining account.

---

## 9. MealBooking Payment Integration

The `MealBooking` class contains:

```javascript
processPayment(diningAccount)
```

This method:

1. Validates the dining account.
2. Checks whether the booking has already been paid.
3. Validates the booking information.
4. Calculates the meal cost.
5. Calls the account's `payForMeal()` method.
6. Confirms the booking if payment succeeds.
7. Keeps the booking pending if payment fails.

The same payment method works with all dining account types because of polymorphism.

A duplicate payment is also prevented.

---

## 10. Transaction History

Every successful deposit or meal payment is recorded.

Each transaction contains:

* Transaction type
* Amount
* Description
* Date and time
* Balance after the transaction

Example transaction structure:

```javascript
{
    type: "Meal Payment",
    amount: 15,
    description: "Lunch booking",
    dateTime: "...",
    balanceAfter: 1285
}
```

The `getTransactions()` method returns a copy of the transaction list so that the original transaction array is protected.

---

## 11. Testing and Results

The `DiningApp.js` file demonstrates the following required tests:

### Standard Account Payment

* Opening balance: K1000
* Deposit: K500
* Meal payment: K200
* Final balance: **K1300**

### Insufficient Standard Account Balance

* Opening balance: K100
* Attempted payment: K150
* Payment result: **false**
* Balance remains: **K100**

### Rewards Account

* Opening balance: K1500
* Deposit: K500
* Reward rate: 2.5%
* Reward calculated: **K50**
* Final balance: **K2050**

### Credit Account

* Opening balance: K1000
* Credit limit: K500
* Payment: K1500
* Final balance: **K-500**
* Payment beyond credit limit: **rejected**

### Polymorphism

The application successfully processes:

* `DiningAccount`
* `RewardsDiningAccount`
* `CreditDiningAccount`

through the same `displayAccountSummary()` method.

### Meal Booking Payment

* Lunch booking total: **K15**
* Payment successful
* Booking status changes from **Pending** to **Confirmed**
* Account balance changes from K1300 to **K1285**

### Duplicate Payment

A second payment attempt for the same confirmed booking is rejected.

The account balance remains **K1285**.

### Transaction History

The application successfully displays the recorded transactions including their type, amount, description, date/time and balance after the transaction.

### Simulated Overloading

The application successfully demonstrates:

```javascript
new DiningAccount("DA002");
```

and:

```javascript
new DiningAccount("DA003", 500);
```

It also demonstrates:

```javascript
account.deposit(100);
```

and:

```javascript
account.deposit(100, "Additional meal funds");
```

---

## 12. How to Run the Application

Make sure Node.js is installed.

Open a terminal in the project folder:

```text
Lab3_DiningDistinctionExtension
```

Run the application using:

```bash
node DiningApp.js
```

The program will display the account demonstrations, polymorphism test, student account test, meal booking payment test, transaction history, duplicate payment test, simulated overloading test and insufficient balance test.

---

## 13. GitHub Repository

The complete project is maintained in the following GitHub repository:

https://github.com/pokaranvuejulie-oss/IS305-240575.git

The Lab 3 project is located in:

```text
Lab3/Lab3_DiningDistinctionExtension
```

---

## 14. AI Use

AI assistance was used as a learning and development support tool during this project.

The assistance was used to:

* Explain JavaScript and object-oriented programming concepts.
* Help identify and correct programming errors.
* Explain inheritance, constructor chaining, method overriding and polymorphism.
* Assist with testing and debugging.
* Help organise project documentation.

The student reviewed, tested and integrated the code into the final application and verified the program output using Node.js.

---

## Conclusion

Lab 3 extends the Dining Meal Booking application by introducing a hierarchy of dining account types.

The completed application demonstrates inheritance, constructor chaining, method overriding, polymorphism, simulated method overloading, private fields, validation, transaction processing and integration between `Student`, `MealBooking` and `DiningAccount`.

The application was tested using Node.js and the required account, payment, booking and transaction scenarios produced the expected results.
