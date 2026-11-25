    // ===== Part 1: let or const? =====
    const firstName = "Amina";                         // never changes
    let age = 25;                                      // changes every year
    let isStudent = true;                              // can change
    const fruits = ["mango", "banana", "orange"];      // the variable itself is not reassigned
    let score = 0;                                     // goes up


    const city = "Nairobi";
    let temperature = 22;
    temperature = 25;
    console.log(temperature); // prints 25 (let allows reassignment)
    console.log(city);        // prints Nairobi

    try {
    city = "Mombasa";       // ERROR: TypeError: Assignment to constant variable
    } catch (error) {
    console.log("Error:", error.message);
    }

    // ===== Part 3: build it yourself =====
    const favoriteColor = "blue";                      // string
    let books = 12;                                    // number, I might buy more
    let isRaining = false;                             // boolean, the weather changes
    const foods = ["rice", "chapati", "mandazi"];     // array
    const person = { name: "Enock", age: 16, city: "Nairobi" }; // object

    console.log(favoriteColor);
    console.log(books);
    console.log(isRaining);
    console.log(foods);
    console.log(person);

    // ===== Part 4: change and check =====
    books = books + 3;
    console.log("Books now:", books);   // Books now: 15

    foods.push("pizza");
    console.log(foods);                 // ["rice", "chapati", "mandazi", "pizza"]

    person.city = "Nairobi";
    console.log(person);                // { name: "Amina", age: 25, city: "Kisumu" }

    console.log(typeof favoriteColor);  // string
    console.log(typeof books);          // number
    console.log(typeof isRaining);      // boolean
    console.log(typeof foods);          // object (arrays count as objects)
    console.log(typeof person);         // object