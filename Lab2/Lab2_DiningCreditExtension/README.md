# IS305 Lab 1 - Dining Meal Booking Feature

## Student Information

- Student Name: Julie Pokaran Vue
- Student ID: 240575
- Course: IS305 Object-Oriented Programming
- Assignment: Lab 1 - Dining Meal Booking Feature
- Date: 29 September 2026

## GitHub Repository

https://github.com/pokaranvuejulie-oss/IS305-240575

## Project Description

This project implements a Dining Meal Booking Feature using JavaScript and Node.js.

The program demonstrates object-oriented programming concepts including classes, objects, constructors, private fields, getters, setters, methods, validation, and error handling.

The system allows a student to create a meal booking by entering their student ID, student name, meal date, meal type, quantity, and dietary note.

The program supports three meal types:

- Breakfast
- Lunch
- Dinner

The meal prices are:

- Breakfast: K10.00
- Lunch: K15.00
- Dinner: K20.00

The program calculates the total cost based on the selected meal type and quantity.

## Files

### MealBooking.js

This file contains the `MealBooking` class.

The class includes:

- Private fields for booking information
- Constructor for creating booking objects
- Getters and setters
- Booking validation
- Total cost calculation
- Booking confirmation
- Booking cancellation
- Booking summary

### DiningApp.js

This file contains the main application.

It:

- Collects booking information using Node.js console input
- Creates `MealBooking` objects
- Validates booking information
- Stores bookings in a JavaScript array
- Prevents duplicate bookings
- Confirms valid bookings
- Displays the booking summary
- Handles errors without crashing the program

## How to Run

Make sure Node.js is installed.

Open PowerShell in the `AT1_DiningFeature` folder and run:

```text
node DiningApp.js