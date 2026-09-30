# Lab 2: Dining Booking Credit Extension

## Student Information

- **Student Name:** Julie Pokaran Vue
- **Student ID:** 240575
- **Course:** IS305 Object-Oriented Programming
- **Technology:** JavaScript and Node.js
- **Repository:** https://github.com/pokaranvuejulie-oss/IS305-240575.git

## Description

This project extends the Dining Meal Booking application developed in Lab 1.

The main purpose of Lab 2 is to introduce a `Student` class and connect Student objects with MealBooking objects. The application demonstrates object-oriented programming concepts including classes, private fields, constructors, getters, setters, object references, arrays of objects, validation, error handling, and booking history.

No database is required for this application.

## Student Class

The `Student` class is stored in `Student.js`.

The class contains three private fields:

- `#studentId`
- `#firstName`
- `#lastName`

The constructor initializes these values.

Getters and setters are provided for all three fields. The setters validate the input and reject empty student IDs, first names, or last names.

The class also contains:

- `getFullName()` - returns the student's full name.
- `displayInfo()` - displays the student's ID and full name.

## Student and MealBooking Connection

The `MealBooking` class now receives a `Student` object instead of separately storing the student's ID and name.

Each booking stores a reference to the Student object.

For example:

```javascript
const booking = new MealBooking({
    student,
    mealDate,
    mealType,
    quantity,
    dietaryNote
});