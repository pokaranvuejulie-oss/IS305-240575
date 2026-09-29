/*
  Program: Dining Meal Booking Feature
  Student Name: Julie Pokaran Vue
  Student ID: 240575
  Date: 29 September 2026
  Description: A JavaScript program demonstrating classes,
  objects, constructors, private fields and methods.
*/
class MealBooking {
  #studentId;
  #studentName;
  #mealDate;
  #mealType;
  #quantity;
  #dietaryNote;
  #bookingStatus;

  constructor({
    studentId,
    studentName,
    mealDate,
    mealType,
    quantity,
    dietaryNote = ""
  }) {
    this.#studentId = studentId;
    this.#studentName = studentName;
    this.#mealDate = mealDate;
    this.#mealType = mealType;
    this.#quantity = quantity;
    this.#dietaryNote = dietaryNote;
    this.#bookingStatus = "Pending";
  }
      // Getters

    get studentId() {
        return this.#studentId;
    }

    get studentName() {
        return this.#studentName;
    }

    get mealDate() {
        return this.#mealDate;
    }

    get mealType() {
        return this.#mealType;
    }

    get quantity() {
        return this.#quantity;
    }

    get dietaryNote() {
        return this.#dietaryNote;
    }

    get bookingStatus() {
        return this.#bookingStatus;
    }
        // Setters

    set studentId(value) {
        this.#studentId = value;
    }

    set studentName(value) {
        this.#studentName = value;
    }

    set mealDate(value) {
        this.#mealDate = value;
    }

    set mealType(value) {
        this.#mealType = value;
    }

    set quantity(value) {
        this.#quantity = value;
    }

    set dietaryNote(value) {
        this.#dietaryNote = value;
    }

    set bookingStatus(value) {
        this.#bookingStatus = value;
    }
        // Calculate total meal cost
    calculateTotal() {
        let price;

        if (this.#mealType === "Breakfast") {
            price = 10;
        } else if (this.#mealType === "Lunch") {
            price = 15;
        } else if (this.#mealType === "Dinner") {
            price = 20;
        } else {
            return 0;
        }

        return price * this.#quantity;
    }
        // Validate booking information
    validate() {
        const validMealTypes = ["Breakfast", "Lunch", "Dinner"];

        if (!this.#studentId) {
            throw new Error("Student ID is required.");
        }

        if (!this.#studentName) {
            throw new Error("Student name is required.");
        }

        if (!this.#mealDate) {
            throw new Error("Meal date is required.");
        }

        if (!validMealTypes.includes(this.#mealType)) {
            throw new Error("Meal type must be Breakfast, Lunch, or Dinner.");
        }

        if (this.#quantity < 1) {
            throw new Error("Quantity must be at least 1.");
        }

        return true;
    }
        // Confirm the booking
    confirmBooking() {
        this.validate();
        this.#bookingStatus = "Confirmed";
    }

    // Cancel the booking
    cancelBooking() {
        this.#bookingStatus = "Cancelled";
    }
        // Display booking summary
    getSummary() {
        return `
========================================
          BOOKING SUMMARY
========================================
Student: ${this.#studentName}
Student ID: ${this.#studentId}
Meal Date: ${this.#mealDate}
Meal Type: ${this.#mealType}
Quantity: ${this.#quantity}
Dietary Note: ${this.#dietaryNote || "None"}
Booking Status: ${this.#bookingStatus}
Total Cost: K${this.calculateTotal().toFixed(2)}
========================================
`;
    }
}
module.exports = MealBooking;