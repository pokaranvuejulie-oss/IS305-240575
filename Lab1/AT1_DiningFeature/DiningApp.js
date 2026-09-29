/*
    Program: Dining Meal Booking Feature
    Student Name: Julie Pokaran Vue
    Student ID: 240575
    Date: 29 September 2026
    Description: A JavaScript program demonstrating a dining
    meal booking system using Node.js.
*/

const MealBooking = require("./MealBooking");
const bookings = [];
const readline = require("readline/promises");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function createBooking() {
    console.log("\n===== DINING MEAL BOOKING =====\n");
        const studentId = await rl.question("Enter Student ID: ");
    const studentName = await rl.question("Enter Student Name: ");
    const mealDate = await rl.question("Enter Meal Date (YYYY-MM-DD): ");
        const mealType = await rl.question(
        "Enter Meal Type (Breakfast/Lunch/Dinner): "
    );

    const quantityInput = await rl.question("Enter Quantity: ");
    const dietaryNote = await rl.question("Enter Dietary Note (optional): ");
        const quantity = Number(quantityInput);
            const booking = new MealBooking({
        studentId,
        studentName,
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
        existingBooking.studentId === booking.studentId &&
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
    });