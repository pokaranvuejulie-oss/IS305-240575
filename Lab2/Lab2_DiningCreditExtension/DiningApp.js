/*
    Program: Dining Meal Booking Feature
    Student Name: Julie Pokaran Vue
    Student ID: 240575
    Date: 29 September 2026
    Description: A JavaScript program demonstrating a dining
    meal booking system using Node.js.
*/

const MealBooking = require("./MealBooking");
const Student = require("./Student");
const students = [];
const bookings = [];
function displayBookingHistory(student, bookings) {
    const studentBookings = bookings.filter(
        booking => booking.student.studentId === student.studentId
    );

    console.log("\n========================================");
    console.log("          BOOKING HISTORY");
    console.log("========================================");
    console.log(`Student ID: ${student.studentId}`);
    console.log(`Student Name: ${student.getFullName()}`);
    console.log("========================================");

    if (studentBookings.length === 0) {
        console.log("No bookings found.");
        return;
    }

    let totalCost = 0;

    studentBookings.forEach((booking, index) => {
        console.log(`\nBooking ${index + 1}`);
        console.log(`Meal Date: ${booking.mealDate}`);
        console.log(`Meal Type: ${booking.mealType}`);
        console.log(`Quantity: ${booking.quantity}`);
        console.log(`Booking Status: ${booking.bookingStatus}`);
        console.log(`Cost: K${booking.calculateTotal().toFixed(2)}`);

        totalCost += booking.calculateTotal();
    });

    console.log("\n========================================");
    console.log(`Total Bookings: ${studentBookings.length}`);
    console.log(`Combined Cost: K${totalCost.toFixed(2)}`);
    console.log("========================================");
}
const readline = require("readline/promises");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function createBooking() {
    console.log("\n===== DINING MEAL BOOKING =====\n");
       const studentId = await rl.question("Enter Student ID: ");
const firstName = await rl.question("Enter First Name: ");
const lastName = await rl.question("Enter Last Name: ");
const mealDate = await rl.question("Enter Meal Date (YYYY-MM-DD): ");
let student = students.find(
    existingStudent => existingStudent.studentId === studentId
);

if (!student) {
    student = new Student(
        studentId,
        firstName,
        lastName
    );

    students.push(student);
}
console.log(student.displayInfo());
        const mealType = await rl.question(
        "Enter Meal Type (Breakfast/Lunch/Dinner): "
    );

    const quantityInput = await rl.question("Enter Quantity: ");
    const dietaryNote = await rl.question("Enter Dietary Note (optional): ");
        const quantity = Number(quantityInput);
         const booking = new MealBooking({
    student,
    mealDate,
    mealType,
    quantity,
    dietaryNote
});
        try {
        booking.validate();
    } catch (error) {
        console.log(`\nError: ${error.message}`);
        return;
    }
      const duplicateBooking = bookings.some(existingBooking =>
    existingBooking.student.studentId === booking.student.studentId &&
    existingBooking.mealDate === booking.mealDate &&
    existingBooking.mealType === booking.mealType
);
    if (duplicateBooking) {
        console.log("\nError: Duplicate booking. This student already has this meal booked for this date.");
        return;
    }
        bookings.push(booking);
        booking.confirmBooking();
        console.log(booking.getSummary());
       displayBookingHistory(student, bookings);

}
async function main() {
    await createBooking();

    const anotherBooking = await rl.question(
        "\nDo you want to add another booking? (yes/no): "
    );

    if (anotherBooking.toLowerCase() === "yes") {
        await createBooking();
    }
}

main()
    .catch(error => {
        console.log(`\nError: ${error.message}`);
    })
    .finally(() => {
        rl.close();
})