# Overview

**This project is a sophisticated web-based application called Calculator Master, which I migrated from a vanilla JavaScript/HTML architecture to a modern, declarative framework using React and TypeScript. The application features three distinct calculation modes:**

1. **Regular Calculator:** A standard arithmetic tool with keyboard support and custom math features.
2. **Cooking Calculator:** A specialized converter for culinary ingredients that uses recursion to simplify decimal results into standard kitchen fractions (e.g., 3/4 cup).
3. **General Unit Converter:** A multi-category converter (Length, Weight, Volume, Temperature, Time) that interacts with external APIs to provide real-time data.

**Video Demonstration**
[Software Demo Video - Project Walkthrough](https://www.youtube.com/watch?v=CRpO_sih0cw)

# Development Environment

* **Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** CSS3 (Flexbox & Grid)
* **Testing/Linting:** ESLint (standard Vite configuration)

**TypeScript Features**

1. **Recursion**

    **Mathematical Recursion:** I implemented the **Euclidean Algorithm** recursively to find the Greatest Common Divisor (GCD) of numbers. This allowed the Cooking Calculator to take raw decimal data from the API and simplify it into the most readable fraction for a user (e.g., converting ```0.75``` to ```3/4```).

    * **Recursive Function:** ```getGCD(a, b)``` in ```cookingCalculator.tsx```.

    **Logic Recursion:** In `regularCalculator.tsx`, the `compute` logic is used to recursively resolve pending operations in a chain (e.g., handling "5 + 5 +" by computing the first pair before staging the next), ensuring the Order of Operations is maintained in the application state.

    * **Recursive Function:** ```compute``` in ```regularCalculator.tsx```.

2. **Asynchronous Programming (Promises)**

    The application relies heavily on **Asynchronous Programming** to fetch data from RapidAPI endpoints without freezing the user interface. I utilized ```async/await``` syntax and the ```fetch``` API to handle network requests, including error handling and loading states.

3. **Strict Type Annotations and Interfaces**

    I fully utilized TypeScript's type system by creating custom **Interfaces** to define the shape of complex objects, such as ```ParsedInput```. I also applied strict type annotations to all function parameters, return values, and React State hooks to ensure type safety across the application.

4. **Exception Handling**

    I implemented robust **Exception Handling** using ```try/catch blocks``` to manage API failures, invalid user inputs, and network errors. I ensured that errors were re-thrown with a ```cause``` property to preserve the original stack trace for easier debugging.

# Useful Websites

* [React Documentation](https://react.dev/)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
* [The Euclidean Algorithm (Khan Academy)](https://www.khanacademy.org/computing/computer-science/cryptography/modarithmetic/a/the-euclidean-algorithm)
* [Food unit of measurement converter - RapidAPI Documentation](https://rapidapi.com/smilebot/api/food-unit-of-measurement-converter)
* [Measurement Units Converter - RapidAPI Documentation](https://rapidapi.com/zanekpavel-AAgJeudWKxt/api/measurement-units-converter)
* [MDN Web Docs - Regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)