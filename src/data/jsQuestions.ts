interface JSTestCase {
  name: string;
  test: (code: string) => boolean | Promise<boolean>;
}

interface JSCodeQuestion {
  id: string;
  title: string;
  scenario: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  type: 'code';
  instructions: string;
  starterCode: {
    html: string;
    js: string;
  };
  testCases: JSTestCase[];
}

interface MultipleChoiceQuestion {
  id: string;
  text: string;
  scenario: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  options: string[];
  correctAnswer: string;
  topic: string;
  type: 'multiple-choice';
}

export type JSQuestion = JSCodeQuestion | MultipleChoiceQuestion;

// Fundamental JavaScript Questions for Beginners/Intermediate
export const fundamentalJSQuestions: JSQuestion[] = [
  {
    id: 'js-fund-1',
    type: 'code',
    difficulty: 'Medium',
    topic: 'Variables & Scope',
    title: 'Employee Data Manager',
    scenario: 'Your team is building an employee management system. The previous developer left some code that has variable scope issues causing data to leak between different employee records. The system needs to properly isolate employee data.',
    instructions: 'Fix the variable declarations to ensure proper scoping and data isolation. Use appropriate variable declarations (let, const, var) based on the requirements.',
    starterCode: {
      html: '',
      js: `function createEmployee(name, age) {
  // Fix variable declarations
  employeeName = name;
  employeeAge = age;
  
  function getDetails() {
    return employeeName + ' is ' + employeeAge + ' years old';
  }
  
  return getDetails();
}

// Create a function that demonstrates proper use of const, let, and var
function demonstrateScoping() {
  // Add your code here
}`
    },
    testCases: [
      {
        name: 'Variables should not leak to global scope',
        test: (code) => !code.includes('employeeName = ') || code.includes('let employeeName') || code.includes('const employeeName')
      },
      {
        name: 'Function should work correctly',
        test: (code) => {
          try {
            eval(code);
            const createEmployee = eval('createEmployee');
            return typeof createEmployee === 'function';
          } catch { return false; }
        }
      }
    ]
  },
  {
    id: 'js-fund-2',
    type: 'code',
    difficulty: 'Medium',
    topic: 'Data Types',
    title: 'Data Validator',
    scenario: 'A form submission system is receiving data in various formats. The backend team needs a utility that can identify and validate different data types to ensure data integrity before processing.',
    instructions: 'Create a function that takes a value and returns an object with the type of value and whether it\'s valid for database storage.',
    starterCode: {
      html: '',
      js: `function validateDataType(value) {
  // Return object with: type, isValid, reason
  // Handle: string, number, boolean, null, undefined, object, array
  // Valid for DB: string, number, boolean, object, array (not null/undefined)
}

// Test your function
console.log(validateDataType("hello"));
console.log(validateDataType(42));
console.log(validateDataType(null));`
    },
    testCases: [
      {
        name: 'Should correctly identify string type',
        test: (code) => code.includes('typeof') || code.includes('String')
      },
      {
        name: 'Function should be defined',
        test: (code) => code.includes('function validateDataType')
      }
    ]
  },
  {
    id: 'js-fund-3',
    type: 'code',
    difficulty: 'Medium',
    topic: 'Loops',
    title: 'Report Generator',
    scenario: 'The sales team needs a report that processes transaction data. The data comes in various structures and needs different looping strategies for different report sections.',
    instructions: 'Create functions that use for, while, for...of, and for...in loops appropriately for different data processing tasks.',
    starterCode: {
      html: '',
      js: `const transactions = [
  {id: 1, amount: 100, category: "food"},
  {id: 2, amount: 50, category: "transport"},
  {id: 3, amount: 200, category: "food"}
];

// Calculate total using for loop
function calculateTotal(transactions) {
}

// Find first transaction over threshold using while
function findFirstOverThreshold(transactions, threshold) {
}

// Sum by category using for...of
function sumByCategory(transactions) {
}

// List all properties of first transaction using for...in
function listProperties(transaction) {
}`
    },
    testCases: [
      {
        name: 'Uses for loop',
        test: (code) => code.includes('for (') || code.includes('for(')
      },
      {
        name: 'Uses while loop',
        test: (code) => code.includes('while')
      },
      {
        name: 'Uses for...of',
        test: (code) => code.includes('for') && code.includes('of')
      }
    ]
  },
  {
    id: 'js-fund-4',
    type: 'code',
    difficulty: 'Medium',
    topic: 'Functions',
    title: 'Payment Calculator',
    scenario: 'An e-commerce platform needs a flexible payment calculation system that can handle different scenarios: standard payments, payments with discounts, and payments with tax calculations. Some parameters should be optional.',
    instructions: 'Create functions using different patterns: regular functions, arrow functions, default parameters, and rest parameters.',
    starterCode: {
      html: '',
      js: `// Regular function with default parameters
function calculatePayment(amount, taxRate = 0.1, discount = 0) {
}

// Arrow function for discount calculator
const applyDiscount = 

// Function using rest parameters to calculate total of multiple items
function calculateTotal(...prices) {
}

// Higher-order function that returns a payment processor
function createPaymentProcessor(processorFee) {
}`
    },
    testCases: [
      {
        name: 'Has default parameters',
        test: (code) => code.includes('=') && code.includes('function')
      },
      {
        name: 'Has arrow function',
        test: (code) => code.includes('=>')
      },
      {
        name: 'Has rest parameters',
        test: (code) => code.includes('...')
      }
    ]
  },
  {
    id: 'js-fund-5',
    type: 'code',
    difficulty: 'Medium',
    topic: 'Objects',
    title: 'User Profile Manager',
    scenario: 'A social media platform needs to manage user profiles. Users can update their information, and the system needs to merge updates, extract specific data, and prevent modification of certain fields.',
    instructions: 'Work with objects using various methods: Object.keys, Object.values, Object.entries, Object.assign, spread operator, and Object.freeze.',
    starterCode: {
      html: '',
      js: `const userProfile = {
  username: "john_doe",
  email: "john@example.com",
  age: 28,
  premium: false
};

// Merge user updates
function updateProfile(original, updates) {
}

// Get all updatable fields (exclude username)
function getUpdatableFields(profile) {
}

// Create immutable profile
function createImmutableProfile(profile) {
}

// Count profile properties
function countProperties(profile) {
}

// Convert profile to array of [key, value] pairs
function profileToArray(profile) {
}`
    },
    testCases: [
      {
        name: 'Uses Object methods',
        test: (code) => code.includes('Object.') || code.includes('...')
      },
      {
        name: 'Functions defined',
        test: (code) => code.includes('function updateProfile')
      }
    ]
  },
  {
    id: 'js-fund-6',
    type: 'code',
    difficulty: 'Medium',
    topic: 'Arrays',
    title: 'Inventory Manager',
    scenario: 'A warehouse management system tracks products. The system needs to filter, transform, search, and aggregate inventory data efficiently.',
    instructions: 'Use array methods: map, filter, find, reduce, some, every, includes, and sort.',
    starterCode: {
      html: '',
      js: `const inventory = [
  {id: 1, name: "Laptop", price: 1200, quantity: 5, category: "electronics"},
  {id: 2, name: "Mouse", price: 25, quantity: 50, category: "electronics"},
  {id: 3, name: "Desk", price: 300, quantity: 10, category: "furniture"},
  {id: 4, name: "Chair", price: 150, quantity: 0, category: "furniture"}
];

// Get all product names
function getProductNames(inventory) {
}

// Find products under certain price
function findAffordableProducts(inventory, maxPrice) {
}

// Calculate total inventory value
function calculateInventoryValue(inventory) {
}

// Check if any product is out of stock
function hasOutOfStock(inventory) {
}

// Check if all electronics are in stock
function allElectronicsInStock(inventory) {
}

// Sort by price descending
function sortByPriceDesc(inventory) {
}`
    },
    testCases: [
      {
        name: 'Uses array methods',
        test: (code) => code.includes('.map') || code.includes('.filter') || code.includes('.reduce')
      },
      {
        name: 'Functions defined',
        test: (code) => code.includes('function getProductNames')
      }
    ]
  },
  {
    id: 'js-fund-7',
    type: 'code',
    difficulty: 'Medium',
    topic: 'Strings',
    title: 'Text Processor',
    scenario: 'A content management system needs to process user-generated text: validate formats, clean input, extract information, and format output.',
    instructions: 'Use string methods: includes, startsWith, endsWith, slice, substring, split, join, trim, replace, toLowerCase, toUpperCase.',
    starterCode: {
      html: '',
      js: `// Validate email format
function isValidEmail(email) {
}

// Extract domain from email
function extractDomain(email) {
}

// Clean and format user input
function cleanInput(text) {
  // Remove extra spaces, trim, capitalize first letter
}

// Convert camelCase to kebab-case
function toKebabCase(str) {
}

// Count word occurrences
function countWord(text, word) {
}

// Truncate text with ellipsis
function truncateText(text, maxLength) {
}`
    },
    testCases: [
      {
        name: 'Uses string methods',
        test: (code) => code.includes('.includes') || code.includes('.split') || code.includes('.slice')
      },
      {
        name: 'Functions defined',
        test: (code) => code.includes('function isValidEmail')
      }
    ]
  },
  {
    id: 'js-fund-8',
    type: 'code',
    difficulty: 'Medium',
    topic: 'Numbers & Math',
    title: 'Financial Calculator',
    scenario: 'A banking application needs precise financial calculations: rounding, random account numbers, price conversions, and statistical calculations.',
    instructions: 'Use Math methods and number operations: Math.round, Math.ceil, Math.floor, Math.random, Math.max, Math.min, toFixed, parseInt, parseFloat.',
    starterCode: {
      html: '',
      js: `// Round to 2 decimal places
function roundToDecimal(num, decimals) {
}

// Generate random account number (8 digits)
function generateAccountNumber() {
}

// Calculate compound interest
function calculateCompoundInterest(principal, rate, years) {
  // Formula: A = P(1 + r)^t
}

// Find average of transactions
function calculateAverage(transactions) {
}

// Convert string price to number
function parsePrice(priceString) {
  // Handle "$1,234.56" format
}

// Calculate percentage
function calculatePercentage(value, total) {
}`
    },
    testCases: [
      {
        name: 'Uses Math methods',
        test: (code) => code.includes('Math.')
      },
      {
        name: 'Functions defined',
        test: (code) => code.includes('function roundToDecimal')
      }
    ]
  },
  {
    id: 'js-fund-9',
    type: 'code',
    difficulty: 'Medium',
    topic: 'OOP - Classes',
    title: 'Library Management System',
    scenario: 'A library needs a digital system to manage books. Each book should track its status, borrower information, and have methods to borrow and return books.',
    instructions: 'Create a Book class with properties and methods. Include constructor, instance methods, and getter/setter methods.',
    starterCode: {
      html: '',
      js: `class Book {
  // Define properties: title, author, isbn, isAvailable, borrower
  
  constructor(title, author, isbn) {
    // Initialize properties
  }
  
  // Method to borrow book
  borrow(borrowerName) {
    // Check availability and update status
  }
  
  // Method to return book
  return() {
  }
  
  // Getter for book info
  get info() {
  }
}

// Create and test books
const book1 = new Book("1984", "George Orwell", "123456");`
    },
    testCases: [
      {
        name: 'Uses class syntax',
        test: (code) => code.includes('class Book')
      },
      {
        name: 'Has constructor',
        test: (code) => code.includes('constructor')
      },
      {
        name: 'Has methods',
        test: (code) => code.includes('borrow') && code.includes('return')
      }
    ]
  },
  {
    id: 'js-fund-10',
    type: 'code',
    difficulty: 'Medium',
    topic: 'Inheritance',
    title: 'Vehicle Management System',
    scenario: 'A car rental company needs a system to manage different types of vehicles. All vehicles share common properties, but cars and motorcycles have specific features and pricing.',
    instructions: 'Create a Vehicle parent class and extend it to create Car and Motorcycle child classes. Use inheritance, super, and method overriding.',
    starterCode: {
      html: '',
      js: `class Vehicle {
  constructor(make, model, year, baseRate) {
    // Initialize common properties
  }
  
  calculateRentalCost(days) {
    // Base calculation
  }
  
  getDetails() {
    // Return vehicle details
  }
}

class Car extends Vehicle {
  constructor(make, model, year, baseRate, doors, hasAC) {
    // Call parent constructor and add car-specific properties
  }
  
  calculateRentalCost(days) {
    // Override: Add AC premium if available
  }
}

class Motorcycle extends Vehicle {
  constructor(make, model, year, baseRate, engineSize) {
    // Call parent constructor and add motorcycle-specific properties
  }
  
  calculateRentalCost(days) {
    // Override: Add engine size multiplier
  }
}

// Test the classes`
    },
    testCases: [
      {
        name: 'Uses inheritance',
        test: (code) => code.includes('extends')
      },
      {
        name: 'Uses super',
        test: (code) => code.includes('super')
      },
      {
        name: 'Has parent and child classes',
        test: (code) => code.includes('class Vehicle') && code.includes('class Car')
      }
    ]
  },
  {
    id: 'js-fund-11',
    type: 'code',
    difficulty: 'Medium',
    topic: 'JSON Operations',
    title: 'API Data Transformer',
    scenario: 'Your application receives data from multiple APIs in JSON format. You need to parse incoming JSON, transform the data, and convert it back to JSON for storage or further processing.',
    instructions: 'Use JSON.parse() and JSON.stringify() to convert between JSON strings and JavaScript objects. Handle errors and format JSON properly.',
    starterCode: {
      html: '',
      js: `// Parse JSON safely with error handling
function safeJSONParse(jsonString) {
  try {
    // Parse and return object
  } catch (error) {
    // Return error info
  }
}

// Convert object to formatted JSON string
function objectToJSON(obj, formatted = false) {
  // Use JSON.stringify with optional formatting
}

// Transform API response
function transformAPIResponse(jsonString) {
  // Parse JSON, transform data, return new JSON
  // Transform: convert all keys to camelCase
}

// Deep clone object using JSON
function deepClone(obj) {
}

// Remove null values and stringify
function cleanAndStringify(obj) {
  // Remove properties with null values, then stringify
}

// Test data
const apiResponse = '{"user_name": "John", "user_age": 30, "is_active": true}';`
    },
    testCases: [
      {
        name: 'Uses JSON.parse',
        test: (code) => code.includes('JSON.parse')
      },
      {
        name: 'Uses JSON.stringify',
        test: (code) => code.includes('JSON.stringify')
      },
      {
        name: 'Has error handling',
        test: (code) => code.includes('try') && code.includes('catch')
      }
    ]
  }
];

export const jsQuestions: JSQuestion[] = [
  // ========== QUESTION 1: ARRAY SUM (BASICS) ==========
  {
    id: 'js-basics-001',
    title: 'Array Sum Calculator',
    scenario: 'You are building a calculator feature that needs to sum all numbers in an array.',
    difficulty: 'Easy',
    topic: 'JavaScript Basics',
    type: 'code',
    instructions: `Create a function called 'arraySum' that:
1. Takes an array of numbers as parameter
2. Returns the sum of all numbers in the array
3. Returns 0 if the array is empty

Example:
arraySum([1, 2, 3, 4]) → 10
arraySum([]) → 0
arraySum([5, -2, 8]) → 11`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function arraySum(numbers) {
  // Write your code here
  
}

// Test cases will check:
// - Empty array
// - Array with positive numbers
// - Array with negative numbers
// - Array with mixed numbers`
    },
    testCases: [
      {
        name: 'Test 1: Empty array should return 0',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return arraySum;');
            const arraySum = testFunction();
            const result = arraySum([]);
            if (result !== 0) {
              throw new Error(`Expected 0 for empty array, but got ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: Sum of positive numbers [1, 2, 3, 4] should equal 10',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return arraySum;');
            const arraySum = testFunction();
            const result = arraySum([1, 2, 3, 4]);
            if (result !== 10) {
              throw new Error(`Expected 10, but got ${result}. Check your addition logic.`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 3: Handle negative numbers [5, -2, 8, -3] should equal 8',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return arraySum;');
            const arraySum = testFunction();
            const result = arraySum([5, -2, 8, -3]);
            if (result !== 8) {
              throw new Error(`Expected 8, but got ${result}. Make sure to handle negative numbers correctly.`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 2: STRING REVERSAL (BASICS) ==========
  {
    id: 'js-basics-002',
    title: 'String Reversal',
    scenario: 'You need to reverse a string for a text processing application.',
    difficulty: 'Easy',
    topic: 'JavaScript Basics',
    type: 'code',
    instructions: `Create a function called 'reverseString' that:
1. Takes a string as parameter
2. Returns the reversed string
3. Should handle empty strings

Example:
reverseString("hello") → "olleh"
reverseString("") → ""
reverseString("JavaScript") → "tpircSavaJ"`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function reverseString(str) {
  // Write your code here
  
}

// Test cases will check:
// - Empty string
// - Single character
// - Multiple characters
// - String with spaces`
    },
    testCases: [
      {
        name: 'Test 1: Empty string should return empty string',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return reverseString;');
            const reverseString = testFunction();
            const result = reverseString("");
            if (result !== "") {
              throw new Error(`Expected empty string, but got "${result}"`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: "hello" should return "olleh"',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return reverseString;');
            const reverseString = testFunction();
            const result = reverseString("hello");
            if (result !== "olleh") {
              throw new Error(`Expected "olleh", but got "${result}". Make sure you're reversing all characters.`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 3: "hello world" should return "dlrow olleh"',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return reverseString;');
            const reverseString = testFunction();
            const result = reverseString("hello world");
            if (result !== "dlrow olleh") {
              throw new Error(`Expected "dlrow olleh", but got "${result}". Spaces should also be reversed.`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 3: OBJECT DESTRUCTURING (ES6) ==========
  {
    id: 'js-es6-001',
    title: 'User Data Extractor',
    scenario: 'You need to extract specific fields from user objects using ES6 destructuring.',
    difficulty: 'Medium',
    topic: 'ES6 Features',
    type: 'code',
    instructions: `Create a function called 'extractUserInfo' that:
1. Takes a user object with properties: name, age, email, address (nested object with city, country)
2. Uses ES6 destructuring to extract name, age, and city
3. Returns an object with these three properties
4. Must use destructuring syntax

Example input:
{ name: 'John', age: 30, email: 'john@test.com', address: { city: 'NYC', country: 'USA' } }

Expected output:
{ name: 'John', age: 30, city: 'NYC' }`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function extractUserInfo(user) {
  // Use ES6 destructuring to extract name, age, and address.city
  // Return an object with { name, age, city }
  
}

// Test cases will check:
// - Correct use of destructuring
// - Proper nested object access
// - Correct return format`
    },
    testCases: [
      {
        name: 'Test 1: Extract basic user info correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return extractUserInfo;');
            const extractUserInfo = testFunction();
            const user = { name: 'John', age: 30, email: 'john@test.com', address: { city: 'NYC', country: 'USA' } };
            const result = extractUserInfo(user);
            if (!result || result.name !== 'John' || result.age !== 30 || result.city !== 'NYC') {
              throw new Error(`Expected {name: 'John', age: 30, city: 'NYC'}, but got ${JSON.stringify(result)}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: Handle different user data',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return extractUserInfo;');
            const extractUserInfo = testFunction();
            const user = { name: 'Sarah', age: 25, email: 'sarah@test.com', address: { city: 'London', country: 'UK' } };
            const result = extractUserInfo(user);
            if (!result || result.name !== 'Sarah' || result.age !== 25 || result.city !== 'London') {
              throw new Error(`Expected {name: 'Sarah', age: 25, city: 'London'}, but got ${JSON.stringify(result)}. Check nested destructuring.`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 3: Return only required fields (not email)',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return extractUserInfo;');
            const extractUserInfo = testFunction();
            const user = { name: 'Bob', age: 35, email: 'bob@test.com', address: { city: 'Paris', country: 'France' } };
            const result = extractUserInfo(user);
            if (result.email !== undefined) {
              throw new Error(`Email should not be in the result. Only return name, age, and city.`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 4: ARROW FUNCTIONS & ARRAY METHODS (ES6) ==========
  {
    id: 'js-es6-002',
    title: 'Product Filter and Transform',
    scenario: 'You are building an e-commerce filter that needs to process product arrays using modern ES6 methods.',
    difficulty: 'Medium',
    topic: 'ES6 Features',
    type: 'code',
    instructions: `Create a function called 'processProducts' that:
1. Takes an array of product objects (each with: name, price, inStock)
2. Filters products that are in stock (inStock === true)
3. Maps the filtered products to return only names and prices
4. Must use arrow functions with filter() and map()
5. Returns array of objects with format: { name: string, price: number }

Example input:
[
  { name: 'Laptop', price: 1000, inStock: true },
  { name: 'Phone', price: 500, inStock: false },
  { name: 'Mouse', price: 50, inStock: true }
]

Expected output:
[
  { name: 'Laptop', price: 1000 },
  { name: 'Mouse', price: 50 }
]`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `const processProducts = (products) => {
  // Use filter() and map() with arrow functions
  // 1. Filter products where inStock is true
  // 2. Map to return only { name, price }
  
};

// Test cases will check:
// - Correct use of arrow functions
// - Proper filtering logic
// - Correct mapping of properties`
    },
    testCases: [
      {
        name: 'Test 1: Filter and transform products correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return processProducts;');
            const processProducts = testFunction();
            const products = [
              { name: 'Laptop', price: 1000, inStock: true },
              { name: 'Phone', price: 500, inStock: false },
              { name: 'Mouse', price: 50, inStock: true }
            ];
            const result = processProducts(products);
            if (result.length !== 2) {
              throw new Error(`Expected 2 products in stock, but got ${result.length}. Check your filter logic.`);
            }
            if (result[0].name !== 'Laptop' || result[0].price !== 1000) {
              throw new Error(`First product should be {name: 'Laptop', price: 1000}, but got ${JSON.stringify(result[0])}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: Should not include inStock property in result',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return processProducts;');
            const processProducts = testFunction();
            const products = [
              { name: 'Keyboard', price: 100, inStock: true }
            ];
            const result = processProducts(products);
            if (result[0].inStock !== undefined) {
              throw new Error(`Result should only have name and price. Remove inStock property using map.`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 3: Handle empty array and all out of stock',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return processProducts;');
            const processProducts = testFunction();
            const products = [
              { name: 'Item1', price: 100, inStock: false },
              { name: 'Item2', price: 200, inStock: false }
            ];
            const result = processProducts(products);
            if (result.length !== 0) {
              throw new Error(`Expected empty array when all products out of stock, but got ${result.length} items`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 5: PROMISES & ASYNC/AWAIT (ES6) ==========
  {
    id: 'js-es6-003',
    title: 'Async Data Fetcher',
    scenario: 'You need to fetch data from multiple sources asynchronously and combine the results.',
    difficulty: 'Hard',
    topic: 'ES6 Features',
    type: 'code',
    instructions: `Create an async function called 'fetchUserPosts' that:
1. Takes a userId as parameter
2. Simulates fetching user data (return promise that resolves after 100ms with { id: userId, name: 'User' + userId })
3. Simulates fetching posts (return promise that resolves after 100ms with array of 2 post objects)
4. Uses async/await to wait for both operations
5. Returns object with format: { user: userData, posts: postsData }

The function should:
- Use async/await syntax (not .then())
- Handle both fetch operations properly
- Return combined data in correct format

Example output for userId = 1:
{
  user: { id: 1, name: 'User1' },
  posts: [
    { id: 1, title: 'Post 1', userId: 1 },
    { id: 2, title: 'Post 2', userId: 1 }
  ]
}`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `async function fetchUserPosts(userId) {
  // Helper function to simulate user fetch
  const getUser = (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: id, name: 'User' + id });
      }, 100);
    });
  };
  
  // Helper function to simulate posts fetch
  const getPosts = (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, title: 'Post 1', userId: id },
          { id: 2, title: 'Post 2', userId: id }
        ]);
      }, 100);
    });
  };
  
  // Use async/await to fetch user and posts
  // Return { user: userData, posts: postsData }
  
}

// Test cases will check:
// - Correct async/await usage
// - Proper data fetching
// - Correct return format`
    },
    testCases: [
      {
        name: 'Test 1: Fetch and combine user and posts data',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return fetchUserPosts;');
            const fetchUserPosts = testFunction();
            const result = await fetchUserPosts(1);
            if (!result.user || result.user.id !== 1 || result.user.name !== 'User1') {
              throw new Error(`User data incorrect. Expected {id: 1, name: 'User1'}, got ${JSON.stringify(result.user)}`);
            }
            if (!result.posts || result.posts.length !== 2) {
              throw new Error(`Posts data incorrect. Expected array of 2 posts, got ${result.posts?.length || 0}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: Handle different userId correctly',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return fetchUserPosts;');
            const fetchUserPosts = testFunction();
            const result = await fetchUserPosts(5);
            if (result.user.id !== 5 || result.user.name !== 'User5') {
              throw new Error(`User data should reflect userId. Expected {id: 5, name: 'User5'}, got ${JSON.stringify(result.user)}`);
            }
            if (result.posts[0].userId !== 5) {
              throw new Error(`Posts should be linked to userId. Expected userId: 5 in posts, got ${result.posts[0].userId}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 3: Function must be async and return Promise',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return fetchUserPosts;');
            const fetchUserPosts = testFunction();
            const result = fetchUserPosts(1);
            if (!(result instanceof Promise)) {
              throw new Error(`Function must be async and return a Promise. Make sure to use 'async function' syntax.`);
            }
            await result; // Wait for completion
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 6: DOM MANIPULATION ==========
  {
    id: 'js-dom-001',
    title: 'Dynamic List Manager',
    scenario: 'Build a simple task list manager that can add and remove items from the DOM.',
    difficulty: 'Easy',
    topic: 'DOM Manipulation',
    type: 'code',
    instructions: `Create a function called 'addTaskToList' that:
1. Takes a task text string as parameter
2. Creates a new li element
3. Sets the text content to the task text
4. Appends it to the ul element with id "taskList"

Example:
addTaskToList("Buy groceries") → adds <li>Buy groceries</li> to #taskList`,
    starterCode: {
      html: `<ul id="taskList"></ul>`,
      js: `function addTaskToList(taskText) {
  // Create li element and add to taskList
  
}`
    },
    testCases: [
      {
        name: 'Test 1: Create and append element correctly',
        test: (code) => {
          try {
            document.body.innerHTML = '<ul id="taskList"></ul>';
            const testFunction = new Function('document', code + '; return addTaskToList;');
            const addTaskToList = testFunction(document);
            addTaskToList("Test Task");
            const list = document.getElementById('taskList');
            if (!list || list.children.length !== 1) {
              throw new Error('Should add exactly 1 li element to the list');
            }
            if (list.children[0].textContent !== 'Test Task') {
              throw new Error('Li element should contain "Test Task"');
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: Add multiple tasks',
        test: (code) => {
          try {
            document.body.innerHTML = '<ul id="taskList"></ul>';
            const testFunction = new Function('document', code + '; return addTaskToList;');
            const addTaskToList = testFunction(document);
            addTaskToList("Task 1");
            addTaskToList("Task 2");
            const list = document.getElementById('taskList');
            if (list.children.length !== 2) {
              throw new Error('Should add 2 li elements');
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 7: ARRAY REDUCE ==========
  {
    id: 'js-array-001',
    title: 'Calculate Average Score',
    scenario: 'Calculate the average score from an array of student scores.',
    difficulty: 'Medium',
    topic: 'Array Methods',
    type: 'code',
    instructions: `Create a function called 'calculateAverage' that:
1. Takes an array of numbers (scores) as parameter
2. Uses reduce() method to sum all scores
3. Returns the average (sum / count)
4. Returns 0 if array is empty

Example:
calculateAverage([80, 90, 75, 85]) → 82.5
calculateAverage([]) → 0`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function calculateAverage(scores) {
  // Use reduce() to calculate average
  
}`
    },
    testCases: [
      {
        name: 'Test 1: Calculate correct average',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return calculateAverage;');
            const calculateAverage = testFunction();
            const result = calculateAverage([80, 90, 75, 85]);
            if (result !== 82.5) {
              throw new Error(`Expected 82.5, got ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: Handle empty array',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return calculateAverage;');
            const calculateAverage = testFunction();
            const result = calculateAverage([]);
            if (result !== 0) {
              throw new Error(`Expected 0 for empty array, got ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 8: OBJECT METHODS ==========
  {
    id: 'js-objects-001',
    title: 'User Profile Manager',
    scenario: 'Create a user object with methods to update profile information.',
    difficulty: 'Medium',
    topic: 'Objects & Methods',
    type: 'code',
    instructions: `Create an object called 'user' with:
1. Properties: name (string), email (string), age (number)
2. A method 'updateEmail' that takes new email and updates the email property
3. A method 'getInfo' that returns a string: "Name: [name], Email: [email], Age: [age]"

Example:
user.updateEmail("new@email.com")
user.getInfo() → "Name: John, Email: new@email.com, Age: 30"`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `const user = {
  name: 'John',
  email: 'john@email.com',
  age: 30,
  updateEmail: function(newEmail) {
    // Update email property
    
  },
  getInfo: function() {
    // Return info string
    
  }
};`
    },
    testCases: [
      {
        name: 'Test 1: updateEmail method works',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return user;');
            const user = testFunction();
            user.updateEmail('test@example.com');
            if (user.email !== 'test@example.com') {
              throw new Error('updateEmail should update the email property');
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: getInfo returns correct format',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return user;');
            const user = testFunction();
            const info = user.getInfo();
            if (!info.includes('Name:') || !info.includes('Email:') || !info.includes('Age:')) {
              throw new Error('getInfo should return formatted string with all properties');
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 9: ES6 CLASSES ==========
  {
    id: 'js-class-001',
    title: 'Rectangle Class',
    scenario: 'Create a Rectangle class with methods to calculate area and perimeter.',
    difficulty: 'Medium',
    topic: 'ES6 Classes',
    type: 'code',
    instructions: `Create a class called 'Rectangle' with:
1. Constructor that takes width and height parameters
2. Method 'getArea()' that returns width * height
3. Method 'getPerimeter()' that returns 2 * (width + height)

Example:
const rect = new Rectangle(5, 10);
rect.getArea() → 50
rect.getPerimeter() → 30`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `class Rectangle {
  // Add constructor and methods
  
}`
    },
    testCases: [
      {
        name: 'Test 1: Constructor and getArea work',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return Rectangle;');
            const Rectangle = testFunction();
            const rect = new Rectangle(5, 10);
            if (rect.getArea() !== 50) {
              throw new Error('getArea should return width * height');
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: getPerimeter calculates correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return Rectangle;');
            const Rectangle = testFunction();
            const rect = new Rectangle(5, 10);
            if (rect.getPerimeter() !== 30) {
              throw new Error('getPerimeter should return 2 * (width + height)');
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 10: CLOSURES ==========
  {
    id: 'js-closure-001',
    title: 'Counter Function',
    scenario: 'Create a counter using closures to maintain private state.',
    difficulty: 'Hard',
    topic: 'Closures',
    type: 'code',
    instructions: `Create a function called 'createCounter' that:
1. Returns an object with methods: increment(), decrement(), getValue()
2. Uses closure to maintain a private count variable
3. increment() increases count by 1
4. decrement() decreases count by 1
5. getValue() returns current count

Example:
const counter = createCounter();
counter.increment(); // count is now 1
counter.increment(); // count is now 2
counter.decrement(); // count is now 1
counter.getValue() → 1`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function createCounter() {
  // Create private count variable
  // Return object with methods
  
}`
    },
    testCases: [
      {
        name: 'Test 1: increment and getValue work',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return createCounter;');
            const createCounter = testFunction();
            const counter = createCounter();
            counter.increment();
            counter.increment();
            if (counter.getValue() !== 2) {
              throw new Error('After 2 increments, getValue should return 2');
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: decrement works',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return createCounter;');
            const createCounter = testFunction();
            const counter = createCounter();
            counter.increment();
            counter.increment();
            counter.decrement();
            if (counter.getValue() !== 1) {
              throw new Error('After 2 increments and 1 decrement, getValue should return 1');
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 3: Each counter instance is independent',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return createCounter;');
            const createCounter = testFunction();
            const counter1 = createCounter();
            const counter2 = createCounter();
            counter1.increment();
            counter1.increment();
            counter2.increment();
            if (counter1.getValue() !== 2 || counter2.getValue() !== 1) {
              throw new Error('Each counter should maintain its own state');
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 11: ERROR HANDLING ==========
  {
    id: 'js-error-001',
    title: 'Safe Division Function',
    scenario: 'Create a function that handles division errors gracefully.',
    difficulty: 'Easy',
    topic: 'Error Handling',
    type: 'code',
    instructions: `Create a function called 'safeDivide' that:
1. Takes two numbers: numerator and denominator
2. Returns the division result
3. Throws an error if denominator is 0 with message "Cannot divide by zero"
4. Use try-catch to handle the error and return null if error occurs

Example:
safeDivide(10, 2) → 5
safeDivide(10, 0) → null`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function safeDivide(numerator, denominator) {
  try {
    // Check for zero and throw error if needed
    // Return division result
    
  } catch (error) {
    // Handle error and return null
    
  }
}`
    },
    testCases: [
      {
        name: 'Test 1: Normal division works',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return safeDivide;');
            const safeDivide = testFunction();
            const result = safeDivide(10, 2);
            if (result !== 5) {
              throw new Error(`Expected 5, got ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: Division by zero returns null',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return safeDivide;');
            const safeDivide = testFunction();
            const result = safeDivide(10, 0);
            if (result !== null) {
              throw new Error(`Division by zero should return null, got ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 12: STRING METHODS ==========
  {
    id: 'js-string-001',
    title: 'Title Case Converter',
    scenario: 'Convert a string to title case where each word starts with a capital letter.',
    difficulty: 'Medium',
    topic: 'String Methods',
    type: 'code',
    instructions: `Create a function called 'toTitleCase' that:
1. Takes a string as parameter
2. Converts it to title case (first letter of each word capitalized)
3. Returns the converted string

Example:
toTitleCase("hello world") → "Hello World"
toTitleCase("the quick brown fox") → "The Quick Brown Fox"`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function toTitleCase(str) {
  // Convert to title case
  
}`
    },
    testCases: [
      {
        name: 'Test 1: Convert simple string',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return toTitleCase;');
            const toTitleCase = testFunction();
            const result = toTitleCase("hello world");
            if (result !== "Hello World") {
              throw new Error(`Expected "Hello World", got "${result}"`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: Handle multiple words',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return toTitleCase;');
            const toTitleCase = testFunction();
            const result = toTitleCase("the quick brown fox");
            if (result !== "The Quick Brown Fox") {
              throw new Error(`Expected "The Quick Brown Fox", got "${result}"`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 13: ARRAY FIND & FILTER ==========
  {
    id: 'js-array-002',
    title: 'Find Active Users',
    scenario: 'Filter and find users based on their active status.',
    difficulty: 'Easy',
    topic: 'Array Methods',
    type: 'code',
    instructions: `Create a function called 'getActiveUsers' that:
1. Takes an array of user objects (each with: name, isActive)
2. Uses filter() to return only active users (isActive === true)
3. Returns array of active user objects

Example:
const users = [
  { name: 'John', isActive: true },
  { name: 'Jane', isActive: false },
  { name: 'Bob', isActive: true }
];
getActiveUsers(users) → [{ name: 'John', isActive: true }, { name: 'Bob', isActive: true }]`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function getActiveUsers(users) {
  // Use filter to return only active users
  
}`
    },
    testCases: [
      {
        name: 'Test 1: Filter active users correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return getActiveUsers;');
            const getActiveUsers = testFunction();
            const users = [
              { name: 'John', isActive: true },
              { name: 'Jane', isActive: false },
              { name: 'Bob', isActive: true }
            ];
            const result = getActiveUsers(users);
            if (result.length !== 2) {
              throw new Error(`Expected 2 active users, got ${result.length}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 14: TEMPLATE LITERALS ==========
  {
    id: 'js-template-001',
    title: 'Create User Greeting',
    scenario: 'Generate personalized greeting messages using template literals.',
    difficulty: 'Easy',
    topic: 'ES6 Features',
    type: 'code',
    instructions: `Create a function called 'greetUser' that:
1. Takes parameters: name, age, city
2. Uses template literals to return: "Hello [name]! You are [age] years old and live in [city]."

Example:
greetUser("Alice", 25, "New York") → "Hello Alice! You are 25 years old and live in New York."`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function greetUser(name, age, city) {
  // Use template literals to create greeting
  
}`
    },
    testCases: [
      {
        name: 'Test 1: Create correct greeting',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return greetUser;');
            const greetUser = testFunction();
            const result = greetUser("Alice", 25, "New York");
            if (result !== "Hello Alice! You are 25 years old and live in New York.") {
              throw new Error(`Greeting format incorrect. Got: ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 15: SPREAD OPERATOR ==========
  {
    id: 'js-spread-001',
    title: 'Merge Arrays',
    scenario: 'Combine multiple arrays using the spread operator.',
    difficulty: 'Easy',
    topic: 'ES6 Features',
    type: 'code',
    instructions: `Create a function called 'mergeArrays' that:
1. Takes three arrays as parameters
2. Uses spread operator to combine them into one array
3. Returns the merged array

Example:
mergeArrays([1, 2], [3, 4], [5, 6]) → [1, 2, 3, 4, 5, 6]`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function mergeArrays(arr1, arr2, arr3) {
  // Use spread operator to merge arrays
  
}`
    },
    testCases: [
      {
        name: 'Test 1: Merge arrays correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return mergeArrays;');
            const mergeArrays = testFunction();
            const result = mergeArrays([1, 2], [3, 4], [5, 6]);
            if (JSON.stringify(result) !== JSON.stringify([1, 2, 3, 4, 5, 6])) {
              throw new Error(`Expected [1, 2, 3, 4, 5, 6], got ${JSON.stringify(result)}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 16: ARRAY SOME & EVERY ==========
  {
    id: 'js-array-003',
    title: 'Check All Passed',
    scenario: 'Verify if all students passed the exam using array methods.',
    difficulty: 'Medium',
    topic: 'Array Methods',
    type: 'code',
    instructions: `Create a function called 'allPassed' that:
1. Takes an array of score objects (each with: name, score)
2. Uses every() method to check if all scores are >= 50
3. Returns true if all passed, false otherwise

Example:
allPassed([{name: 'John', score: 60}, {name: 'Jane', score: 55}]) → true
allPassed([{name: 'John', score: 60}, {name: 'Jane', score: 40}]) → false`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function allPassed(students) {
  // Use every() to check if all scores >= 50
  
}`
    },
    testCases: [
      {
        name: 'Test 1: All students passed',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return allPassed;');
            const allPassed = testFunction();
            const result = allPassed([{name: 'John', score: 60}, {name: 'Jane', score: 55}]);
            if (result !== true) {
              throw new Error('Should return true when all scores >= 50');
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: Some students failed',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return allPassed;');
            const allPassed = testFunction();
            const result = allPassed([{name: 'John', score: 60}, {name: 'Jane', score: 40}]);
            if (result !== false) {
              throw new Error('Should return false when any score < 50');
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 17: MAP & REDUCE COMBINATION ==========
  {
    id: 'js-array-004',
    title: 'Calculate Total Price',
    scenario: 'Calculate the total price of items in a shopping cart.',
    difficulty: 'Medium',
    topic: 'Array Methods',
    type: 'code',
    instructions: `Create a function called 'calculateTotal' that:
1. Takes an array of items (each with: name, price, quantity)
2. Uses map() to calculate subtotal for each item (price * quantity)
3. Uses reduce() to sum all subtotals
4. Returns the total

Example:
calculateTotal([
  {name: 'Apple', price: 2, quantity: 3},
  {name: 'Banana', price: 1, quantity: 5}
]) → 11`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function calculateTotal(items) {
  // Use map and reduce to calculate total
  
}`
    },
    testCases: [
      {
        name: 'Test 1: Calculate correct total',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return calculateTotal;');
            const calculateTotal = testFunction();
            const result = calculateTotal([
              {name: 'Apple', price: 2, quantity: 3},
              {name: 'Banana', price: 1, quantity: 5}
            ]);
            if (result !== 11) {
              throw new Error(`Expected 11, got ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 18: DEFAULT PARAMETERS ==========
  {
    id: 'js-params-001',
    title: 'Calculate Discount',
    scenario: 'Calculate discounted price with optional discount parameter.',
    difficulty: 'Easy',
    topic: 'ES6 Features',
    type: 'code',
    instructions: `Create a function called 'applyDiscount' that:
1. Takes parameters: price, discount (default 10%)
2. Returns the price after applying discount
3. Discount should be a percentage (10 means 10%)

Example:
applyDiscount(100) → 90 (default 10% discount)
applyDiscount(100, 20) → 80 (20% discount)`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function applyDiscount(price, discount = 10) {
  // Calculate and return discounted price
  
}`
    },
    testCases: [
      {
        name: 'Test 1: Default discount works',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return applyDiscount;');
            const applyDiscount = testFunction();
            const result = applyDiscount(100);
            if (result !== 90) {
              throw new Error(`Expected 90, got ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: Custom discount works',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return applyDiscount;');
            const applyDiscount = testFunction();
            const result = applyDiscount(100, 20);
            if (result !== 80) {
              throw new Error(`Expected 80, got ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 19: OBJECT KEYS & VALUES ==========
  {
    id: 'js-objects-002',
    title: 'Count Properties',
    scenario: 'Count the number of properties in an object.',
    difficulty: 'Easy',
    topic: 'Objects & Methods',
    type: 'code',
    instructions: `Create a function called 'countProperties' that:
1. Takes an object as parameter
2. Uses Object.keys() to get all property names
3. Returns the count of properties

Example:
countProperties({name: 'John', age: 30, city: 'NYC'}) → 3
countProperties({}) → 0`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function countProperties(obj) {
  // Use Object.keys() to count properties
  
}`
    },
    testCases: [
      {
        name: 'Test 1: Count properties correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return countProperties;');
            const countProperties = testFunction();
            const result = countProperties({name: 'John', age: 30, city: 'NYC'});
            if (result !== 3) {
              throw new Error(`Expected 3, got ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: Handle empty object',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return countProperties;');
            const countProperties = testFunction();
            const result = countProperties({});
            if (result !== 0) {
              throw new Error(`Expected 0 for empty object, got ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },

  // ========== QUESTION 20: FIND MAX VALUE ==========
  {
    id: 'js-math-001',
    title: 'Find Maximum Number',
    scenario: 'Find the largest number in an array.',
    difficulty: 'Easy',
    topic: 'JavaScript Basics',
    type: 'code',
    instructions: `Create a function called 'findMax' that:
1. Takes an array of numbers as parameter
2. Returns the largest number
3. Can use Math.max() with spread operator

Example:
findMax([3, 7, 2, 9, 1]) → 9
findMax([10]) → 10`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function findMax(numbers) {
  // Find and return the maximum number
  
}`
    },
    testCases: [
      {
        name: 'Test 1: Find max in array',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return findMax;');
            const findMax = testFunction();
            const result = findMax([3, 7, 2, 9, 1]);
            if (result !== 9) {
              throw new Error(`Expected 9, got ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      },
      {
        name: 'Test 2: Single element array',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return findMax;');
            const findMax = testFunction();
            const result = findMax([10]);
            if (result !== 10) {
              throw new Error(`Expected 10, got ${result}`);
            }
            return true;
          } catch (error) {
            console.error('Test failed:', error);
            return false;
          }
        }
      }
    ]
  },
  
  // ========== NEW MEDIUM LEVEL QUESTIONS ==========
  
  // QUESTION 21: Shopping Cart Total with Tax
  {
    id: 'js-medium-021',
    title: 'Shopping Cart Total Calculator',
    scenario: 'Your e-commerce platform shows customers a shopping cart with multiple items. Each item has a price and quantity. The finance team reports that customers are confused because the displayed subtotal doesn\'t match their final invoice - they forgot to include sales tax! The checkout system needs to show the accurate final price including the applicable tax rate before customers complete their purchase.',
    difficulty: 'Medium',
    topic: 'Array Methods (reduce)',
    type: 'code',
    instructions: `Create a function called 'calculateCartTotal' that:
1. Takes an array of product objects (each with 'price' and 'quantity' properties)
2. Takes a tax rate as a decimal (e.g., 0.08 for 8%)
3. Returns the total cost including tax, rounded to 2 decimal places

Example:
const cart = [{price: 10, quantity: 2}, {price: 5, quantity: 3}];
calculateCartTotal(cart, 0.1) → 38.50 (subtotal: 35, tax: 3.50)`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function calculateCartTotal(cart, taxRate) {
  // Write your code here using reduce
  
}

// Test your function
const cart = [{price: 10, quantity: 2}, {price: 5, quantity: 3}];
console.log(calculateCartTotal(cart, 0.1));`
    },
    testCases: [
      {
        name: 'Test 1: Empty cart returns 0',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return calculateCartTotal;');
            const calculateCartTotal = testFunction();
            const result = calculateCartTotal([], 0.1);
            return result === 0;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Calculates correct total with tax',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return calculateCartTotal;');
            const calculateCartTotal = testFunction();
            const cart = [{price: 10, quantity: 2}, {price: 5, quantity: 3}];
            const result = calculateCartTotal(cart, 0.1);
            return Math.abs(result - 38.5) < 0.01;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Handles single item correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return calculateCartTotal;');
            const calculateCartTotal = testFunction();
            const cart = [{price: 100, quantity: 1}];
            const result = calculateCartTotal(cart, 0.2);
            return Math.abs(result - 120) < 0.01;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 22: Filter Active Users
  {
    id: 'js-medium-022',
    title: 'Active User Filter',
    scenario: 'Your social media platform\'s marketing team wants to send promotional emails only to engaged users. They\'ve noticed that sending emails to inactive accounts hurts their sender reputation. They need a list of users who have actually been active on the platform recently - specifically, those who logged in within the last 30 days. The list should show the most recently active users first to prioritize high-engagement accounts.',
    difficulty: 'Medium',
    topic: 'Array Methods (filter)',
    type: 'code',
    instructions: `Create a function called 'getActiveUsers' that:
1. Takes an array of user objects (each with 'name', 'lastLogin' date string)
2. Returns only users who logged in within the last 30 days
3. Sorts them by lastLogin date (most recent first)

Example:
const users = [
  {name: 'Alice', lastLogin: '2024-01-15'},
  {name: 'Bob', lastLogin: '2023-11-20'}
];
getActiveUsers(users, '2024-01-20') → [{name: 'Alice', ...}]`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function getActiveUsers(users, currentDate) {
  // Write your code here using filter and sort
  
}

// Test your function
const users = [
  {name: 'Alice', lastLogin: '2024-01-15'},
  {name: 'Bob', lastLogin: '2023-11-20'}
];
console.log(getActiveUsers(users, '2024-01-20'));`
    },
    testCases: [
      {
        name: 'Test 1: Filters users within 30 days',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return getActiveUsers;');
            const getActiveUsers = testFunction();
            const users = [
              {name: 'Alice', lastLogin: '2024-01-15'},
              {name: 'Bob', lastLogin: '2023-11-20'}
            ];
            const result = getActiveUsers(users, '2024-01-20');
            return result.length === 1 && result[0].name === 'Alice';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Returns empty array if no active users',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return getActiveUsers;');
            const getActiveUsers = testFunction();
            const users = [{name: 'Alice', lastLogin: '2023-01-15'}];
            const result = getActiveUsers(users, '2024-01-20');
            return result.length === 0;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Sorts by most recent login',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return getActiveUsers;');
            const getActiveUsers = testFunction();
            const users = [
              {name: 'Alice', lastLogin: '2024-01-10'},
              {name: 'Bob', lastLogin: '2024-01-18'}
            ];
            const result = getActiveUsers(users, '2024-01-20');
            return result[0].name === 'Bob';
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 23: Form Validation
  {
    id: 'js-medium-023',
    title: 'Form Field Validator',
    scenario: 'Users keep submitting your registration form with invalid data - emails without @ symbols, weak passwords, underage users checking the age checkbox, and people not accepting the terms of service. Customer support is overwhelmed with account creation issues. Before submitting data to the server, you need to catch these problems on the client side and show users exactly what\'s wrong with their input.',
    difficulty: 'Medium',
    topic: 'Array Methods (every, some)',
    type: 'code',
    instructions: `Create a function called 'validateForm' that:
1. Takes a form object with fields: {email, password, age, terms}
2. Validates: email contains '@', password length > 8, age >= 18, terms === true
3. Returns an object: {valid: boolean, errors: string[]}

Example:
validateForm({email: 'test@example.com', password: 'password123', age: 25, terms: true})
→ {valid: true, errors: []}`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function validateForm(formData) {
  // Write your code here
  
}

// Test your function
const form = {
  email: 'test@example.com',
  password: 'password123',
  age: 25,
  terms: true
};
console.log(validateForm(form));`
    },
    testCases: [
      {
        name: 'Test 1: Valid form returns {valid: true, errors: []}',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return validateForm;');
            const validateForm = testFunction();
            const form = {email: 'test@example.com', password: 'password123', age: 25, terms: true};
            const result = validateForm(form);
            return result.valid === true && result.errors.length === 0;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Invalid email adds error',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return validateForm;');
            const validateForm = testFunction();
            const form = {email: 'invalid', password: 'password123', age: 25, terms: true};
            const result = validateForm(form);
            return result.valid === false && result.errors.length > 0;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Multiple errors detected',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return validateForm;');
            const validateForm = testFunction();
            const form = {email: 'invalid', password: 'short', age: 15, terms: false};
            const result = validateForm(form);
            return result.valid === false && result.errors.length >= 2;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 24: Transform User Data
  {
    id: 'js-medium-024',
    title: 'User Data Transformer',
    scenario: 'Your backend API was built by a different team and returns user data as separate firstName, lastName, email, age, and city fields. However, your frontend components expect a completely different structure: fullName as a combined string, email nested inside a contact object, city renamed to location, and a boolean flag indicating if the user is an adult. Rather than rewriting the entire API, you need to transform the data after receiving it.',
    difficulty: 'Medium',
    topic: 'Array Methods (map), Object Destructuring',
    type: 'code',
    instructions: `Create a function called 'transformUsers' that:
1. Takes an array of user objects: {firstName, lastName, email, age, city}
2. Returns an array with: {fullName, contact: {email}, location: city, isAdult}
3. fullName = firstName + lastName, isAdult = age >= 18

Example:
transformUsers([{firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 25, city: 'NYC'}])
→ [{fullName: 'John Doe', contact: {email: 'john@example.com'}, location: 'NYC', isAdult: true}]`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function transformUsers(users) {
  // Write your code here using map
  
}

// Test your function
const users = [
  {firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 25, city: 'NYC'}
];
console.log(transformUsers(users));`
    },
    testCases: [
      {
        name: 'Test 1: Transforms single user correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return transformUsers;');
            const transformUsers = testFunction();
            const users = [{firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 25, city: 'NYC'}];
            const result = transformUsers(users);
            return result[0].fullName === 'John Doe' && result[0].isAdult === true;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Correctly identifies minor',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return transformUsers;');
            const transformUsers = testFunction();
            const users = [{firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', age: 16, city: 'LA'}];
            const result = transformUsers(users);
            return result[0].isAdult === false;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Nests email in contact object',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return transformUsers;');
            const transformUsers = testFunction();
            const users = [{firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com', age: 30, city: 'SF'}];
            const result = transformUsers(users);
            return result[0].contact.email === 'bob@example.com';
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 25: Product Inventory Manager
  {
    id: 'js-medium-025',
    title: 'Product Inventory Manager',
    scenario: 'Your warehouse manager is frustrated because products keep selling out before they can reorder. The inventory system stores product quantities in an object, but there\'s no way to quickly identify which products are running low. The manager needs an automated alert system that identifies products below a certain stock threshold so they can place orders before items go out of stock.',
    difficulty: 'Medium',
    topic: 'Object Methods, Object.keys',
    type: 'code',
    instructions: `Create a function called 'getLowStock' that:
1. Takes an inventory object where keys are product names and values are quantities
2. Takes a threshold number
3. Returns an array of product names with quantities below the threshold

Example:
const inventory = {apples: 5, bananas: 15, oranges: 2};
getLowStock(inventory, 10) → ['apples', 'oranges']`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function getLowStock(inventory, threshold) {
  // Write your code here using Object.keys
  
}

// Test your function
const inventory = {apples: 5, bananas: 15, oranges: 2};
console.log(getLowStock(inventory, 10));`
    },
    testCases: [
      {
        name: 'Test 1: Returns products below threshold',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return getLowStock;');
            const getLowStock = testFunction();
            const inventory = {apples: 5, bananas: 15, oranges: 2};
            const result = getLowStock(inventory, 10);
            return result.length === 2 && result.includes('apples') && result.includes('oranges');
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Returns empty array if all stock sufficient',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return getLowStock;');
            const getLowStock = testFunction();
            const inventory = {apples: 15, bananas: 20};
            const result = getLowStock(inventory, 10);
            return result.length === 0;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Returns all products if threshold is high',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return getLowStock;');
            const getLowStock = testFunction();
            const inventory = {apples: 5, bananas: 3};
            const result = getLowStock(inventory, 10);
            return result.length === 2;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 26: ES6 Class - Bank Account
  {
    id: 'js-medium-026',
    title: 'Bank Account Class',
    scenario: 'A fintech startup is building a basic banking simulator for financial literacy training. Students need to practice managing money by making deposits and withdrawals. The simulation must prevent overdrafts - students cannot withdraw more money than they have in their account. Each student account has a unique account number and starting balance, and should be able to check their current balance at any time.',
    difficulty: 'Medium',
    topic: 'ES6 Classes',
    type: 'code',
    instructions: `Create a class called 'BankAccount' that:
1. Constructor takes accountNumber and initialBalance
2. Has methods: deposit(amount), withdraw(amount), getBalance()
3. withdraw() should not allow negative balance
4. Both methods should return the new balance or false if invalid

Example:
const account = new BankAccount('123', 100);
account.deposit(50) → 150
account.withdraw(200) → false`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `class BankAccount {
  // Write your constructor and methods here
  
}

// Test your class
const account = new BankAccount('123', 100);
console.log(account.deposit(50));
console.log(account.withdraw(30));`
    },
    testCases: [
      {
        name: 'Test 1: Deposit increases balance',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return BankAccount;');
            const BankAccount = testFunction();
            const account = new BankAccount('123', 100);
            const result = account.deposit(50);
            return result === 150;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Withdraw decreases balance',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return BankAccount;');
            const BankAccount = testFunction();
            const account = new BankAccount('123', 100);
            const result = account.withdraw(30);
            return result === 70;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Cannot overdraw account',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return BankAccount;');
            const BankAccount = testFunction();
            const account = new BankAccount('123', 100);
            const result = account.withdraw(200);
            return result === false && account.getBalance() === 100;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 27: Closure Counter
  {
    id: 'js-medium-027',
    title: 'Counter with Closure',
    scenario: 'A web analytics dashboard needs to track button clicks, but developers keep accidentally resetting the count by directly modifying the counter variable. The count is being corrupted because different parts of the application can access and change it. You need to protect the counter so it can only be changed through controlled operations - incrementing, decrementing, and reading the value - while keeping the actual count value hidden and safe from direct manipulation.',
    difficulty: 'Medium',
    topic: 'Closures',
    type: 'code',
    instructions: `Create a function called 'createCounter' that:
1. Returns an object with methods: increment(), decrement(), getValue()
2. Uses closure to keep count private
3. Count starts at 0 and cannot be accessed directly

Example:
const counter = createCounter();
counter.increment() → 1
counter.increment() → 2
counter.getValue() → 2`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function createCounter() {
  // Write your code here using closures
  
}

// Test your function
const counter = createCounter();
console.log(counter.increment());
console.log(counter.getValue());`
    },
    testCases: [
      {
        name: 'Test 1: Increment increases count',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return createCounter;');
            const createCounter = testFunction();
            const counter = createCounter();
            counter.increment();
            counter.increment();
            return counter.getValue() === 2;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Decrement decreases count',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return createCounter;');
            const createCounter = testFunction();
            const counter = createCounter();
            counter.increment();
            counter.increment();
            counter.decrement();
            return counter.getValue() === 1;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Multiple counters are independent',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return createCounter;');
            const createCounter = testFunction();
            const counter1 = createCounter();
            const counter2 = createCounter();
            counter1.increment();
            counter1.increment();
            counter2.increment();
            return counter1.getValue() === 2 && counter2.getValue() === 1;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 28: Error Handler
  {
    id: 'js-medium-028',
    title: 'Safe Division Function',
    scenario: 'Your calculator application keeps crashing when users try to divide by zero or enter invalid inputs like text instead of numbers. The error messages are confusing technical jargon that scares users away. Instead of crashing, the calculator should catch these problems and show friendly, understandable error messages. When the calculation works, it should display results rounded to 2 decimal places for readability.',
    difficulty: 'Medium',
    topic: 'Error Handling, Try-Catch',
    type: 'code',
    instructions: `Create a function called 'safeDivide' that:
1. Takes two numbers (dividend and divisor)
2. Returns the division result rounded to 2 decimals
3. Throws error if divisor is 0 with message "Cannot divide by zero"
4. Returns error message if inputs are not numbers

Example:
safeDivide(10, 2) → 5.00
safeDivide(10, 0) → "Error: Cannot divide by zero"`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function safeDivide(dividend, divisor) {
  // Write your code here with try-catch
  
}

// Test your function
console.log(safeDivide(10, 2));
console.log(safeDivide(10, 0));`
    },
    testCases: [
      {
        name: 'Test 1: Divides numbers correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return safeDivide;');
            const safeDivide = testFunction();
            const result = safeDivide(10, 2);
            return result === 5;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Handles division by zero',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return safeDivide;');
            const safeDivide = testFunction();
            const result = safeDivide(10, 0);
            return typeof result === 'string' && result.includes('divide by zero');
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Rounds to 2 decimal places',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return safeDivide;');
            const safeDivide = testFunction();
            const result = safeDivide(10, 3);
            return Math.abs(result - 3.33) < 0.01;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 29: String Manipulation
  {
    id: 'js-medium-029',
    title: 'Title Case Converter',
    scenario: 'Your content management system receives article titles in all lowercase from writers. The published articles look unprofessional because titles aren\'t properly capitalized. Marketing insists that titles should follow proper title case formatting where most words are capitalized, but small connecting words like "a", "an", "the", "in", "on", and "at" should remain lowercase unless they\'re the first word of the title.',
    difficulty: 'Medium',
    topic: 'String Methods, Template Literals',
    type: 'code',
    instructions: `Create a function called 'toTitleCase' that:
1. Takes a string and converts it to title case
2. Small words (a, an, the, in, on, at) stay lowercase unless first word
3. Returns the formatted string

Example:
toTitleCase("the quick brown fox") → "The Quick Brown Fox"
toTitleCase("a tale of two cities") → "A Tale of Two Cities"`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function toTitleCase(text) {
  // Write your code here
  
}

// Test your function
console.log(toTitleCase("the quick brown fox"));`
    },
    testCases: [
      {
        name: 'Test 1: Capitalizes all words',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return toTitleCase;');
            const toTitleCase = testFunction();
            const result = toTitleCase("hello world");
            return result === "Hello World";
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: First word always capitalized',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return toTitleCase;');
            const toTitleCase = testFunction();
            const result = toTitleCase("the quick fox");
            return result.startsWith("The");
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Handles multiple spaces',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return toTitleCase;');
            const toTitleCase = testFunction();
            const result = toTitleCase("hello  world");
            return result.includes("Hello") && result.includes("World");
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 30: Template Literals
  {
    id: 'js-medium-030',
    title: 'Email Template Generator',
    scenario: 'Your e-commerce customer service team manually writes order confirmation emails, which is time-consuming and leads to inconsistent messaging. Sometimes they forget to include the order number or total amount. You need to automate this process by generating standardized, personalized emails that include the customer\'s name, their specific order number, the number of items they purchased, and the total amount they paid.',
    difficulty: 'Medium',
    topic: 'Template Literals, String Methods',
    type: 'code',
    instructions: `Create a function called 'generateEmail' that:
1. Takes an object: {name, orderNumber, total, items}
2. Returns a formatted email string using template literals
3. Include greeting, order details, and total

Example:
generateEmail({name: 'John', orderNumber: '12345', total: 99.99, items: 3})
→ "Dear John, Your order #12345 with 3 items totaling $99.99 has been confirmed."`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function generateEmail(orderData) {
  // Write your code here using template literals
  
}

// Test your function
const order = {name: 'John', orderNumber: '12345', total: 99.99, items: 3};
console.log(generateEmail(order));`
    },
    testCases: [
      {
        name: 'Test 1: Includes customer name',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return generateEmail;');
            const generateEmail = testFunction();
            const order = {name: 'John', orderNumber: '12345', total: 99.99, items: 3};
            const result = generateEmail(order);
            return result.includes('John');
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Includes order number',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return generateEmail;');
            const generateEmail = testFunction();
            const order = {name: 'Jane', orderNumber: '67890', total: 49.99, items: 2};
            const result = generateEmail(order);
            return result.includes('67890');
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Includes total amount',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return generateEmail;');
            const generateEmail = testFunction();
            const order = {name: 'Bob', orderNumber: '11111', total: 199.99, items: 5};
            const result = generateEmail(order);
            return result.includes('199.99');
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 31: Spread Operator - Merge Objects
  {
    id: 'js-medium-031',
    title: 'Object Merger with Defaults',
    scenario: 'Your application has default settings for theme, notifications, and language preferences. When users customize their preferences, they only change a few settings - not all of them. However, the settings panel breaks when trying to save because it expects all settings to be present. You need to merge the user\'s custom preferences with the default settings, ensuring that user choices override defaults while keeping all the default values they didn\'t customize.',
    difficulty: 'Medium',
    topic: 'Spread Operator, Objects',
    type: 'code',
    instructions: `Create a function called 'mergeSettings' that:
1. Takes defaultSettings object and userSettings object
2. Returns merged object with user settings overriding defaults
3. Use spread operator to merge

Example:
const defaults = {theme: 'light', notifications: true, language: 'en'};
const user = {theme: 'dark'};
mergeSettings(defaults, user) → {theme: 'dark', notifications: true, language: 'en'}`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function mergeSettings(defaultSettings, userSettings) {
  // Write your code here using spread operator
  
}

// Test your function
const defaults = {theme: 'light', notifications: true};
const user = {theme: 'dark'};
console.log(mergeSettings(defaults, user));`
    },
    testCases: [
      {
        name: 'Test 1: User settings override defaults',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return mergeSettings;');
            const mergeSettings = testFunction();
            const defaults = {theme: 'light', notifications: true};
            const user = {theme: 'dark'};
            const result = mergeSettings(defaults, user);
            return result.theme === 'dark' && result.notifications === true;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Preserves all default settings',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return mergeSettings;');
            const mergeSettings = testFunction();
            const defaults = {a: 1, b: 2, c: 3};
            const user = {a: 10};
            const result = mergeSettings(defaults, user);
            return result.a === 10 && result.b === 2 && result.c === 3;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Handles empty user settings',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return mergeSettings;');
            const mergeSettings = testFunction();
            const defaults = {theme: 'light'};
            const user = {};
            const result = mergeSettings(defaults, user);
            return result.theme === 'light';
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 32: Array Spread
  {
    id: 'js-medium-032',
    title: 'Array Combiner',
    scenario: 'Your blog platform pulls article tags from multiple sources: the author\'s tags, automatically detected keywords, and editor suggestions. The problem is that the same tags appear multiple times across these sources, and the tag cloud looks messy with duplicates. Additionally, the tags are in random order. You need to combine all tag sources, eliminate duplicates, and present them in alphabetical order for a clean, professional appearance.',
    difficulty: 'Medium',
    topic: 'Spread Operator, Arrays, Set',
    type: 'code',
    instructions: `Create a function called 'combineUniqueTags' that:
1. Takes multiple arrays of strings as arguments
2. Combines them and removes duplicates
3. Returns sorted array of unique tags

Example:
combineUniqueTags(['js', 'react'], ['js', 'node'], ['react', 'vue'])
→ ['js', 'node', 'react', 'vue']`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function combineUniqueTags(...arrays) {
  // Write your code here using spread and Set
  
}

// Test your function
console.log(combineUniqueTags(['js', 'react'], ['js', 'node']));`
    },
    testCases: [
      {
        name: 'Test 1: Removes duplicates',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return combineUniqueTags;');
            const combineUniqueTags = testFunction();
            const result = combineUniqueTags(['js', 'react'], ['js', 'node']);
            return result.length === 3 && result.includes('js');
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Combines multiple arrays',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return combineUniqueTags;');
            const combineUniqueTags = testFunction();
            const result = combineUniqueTags(['a'], ['b'], ['c']);
            return result.length === 3;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Returns sorted array',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return combineUniqueTags;');
            const combineUniqueTags = testFunction();
            const result = combineUniqueTags(['z', 'a'], ['m']);
            return result[0] === 'a' && result[result.length - 1] === 'z';
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 33: Default Parameters
  {
    id: 'js-medium-033',
    title: 'API Request Builder',
    scenario: 'Your development team is building a utility for making API requests, but they keep forgetting to specify the HTTP method, headers, and timeout values. This leads to inconsistent API calls across the codebase. Most requests are simple GET requests with empty headers and a 5-second timeout. You need to create a request builder that assumes these common defaults while still allowing developers to override them when needed for special cases like POST requests or custom authentication headers.',
    difficulty: 'Medium',
    topic: 'Default Parameters, Objects',
    type: 'code',
    instructions: `Create a function called 'buildRequest' that:
1. Takes url (required), method='GET', headers={}, timeout=5000
2. Returns an object with all request parameters
3. Use default parameters

Example:
buildRequest('/api/users') 
→ {url: '/api/users', method: 'GET', headers: {}, timeout: 5000}`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function buildRequest(url, method = 'GET', headers = {}, timeout = 5000) {
  // Write your code here
  
}

// Test your function
console.log(buildRequest('/api/users'));
console.log(buildRequest('/api/users', 'POST'));`
    },
    testCases: [
      {
        name: 'Test 1: Uses default method',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return buildRequest;');
            const buildRequest = testFunction();
            const result = buildRequest('/api/users');
            return result.method === 'GET';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Allows method override',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return buildRequest;');
            const buildRequest = testFunction();
            const result = buildRequest('/api/users', 'POST');
            return result.method === 'POST';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Uses default timeout',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return buildRequest;');
            const buildRequest = testFunction();
            const result = buildRequest('/api/users');
            return result.timeout === 5000;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 34: Math Operations
  {
    id: 'js-medium-034',
    title: 'Statistics Calculator',
    scenario: 'Teachers are manually calculating class statistics for student test scores using a calculator, which is time-consuming and error-prone. They need to know the average score, the median (middle value), and identify both the highest and lowest scores in the class. The school wants an automated tool that can instantly provide these statistics from a list of test scores to help teachers quickly understand class performance and identify students who may need extra help.',
    difficulty: 'Medium',
    topic: 'Math Operations, Array Methods',
    type: 'code',
    instructions: `Create a function called 'calculateStats' that:
1. Takes an array of numbers
2. Returns object with: {mean, median, min, max}
3. Round mean and median to 2 decimal places

Example:
calculateStats([10, 20, 30, 40, 50])
→ {mean: 30, median: 30, min: 10, max: 50}`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function calculateStats(numbers) {
  // Write your code here using Math methods
  
}

// Test your function
console.log(calculateStats([10, 20, 30, 40, 50]));`
    },
    testCases: [
      {
        name: 'Test 1: Calculates correct mean',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return calculateStats;');
            const calculateStats = testFunction();
            const result = calculateStats([10, 20, 30]);
            return result.mean === 20;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Finds correct min and max',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return calculateStats;');
            const calculateStats = testFunction();
            const result = calculateStats([5, 10, 15, 20]);
            return result.min === 5 && result.max === 20;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Calculates correct median',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return calculateStats;');
            const calculateStats = testFunction();
            const result = calculateStats([1, 2, 3, 4, 5]);
            return result.median === 3;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 35: DOM Manipulation
  {
    id: 'js-medium-035',
    title: 'Dynamic List Creator',
    scenario: 'Your recipe website receives ingredient lists as simple arrays from a database, but they display as plain text on the page, making recipes hard to read. Users complained that they lose their place while cooking because ingredients aren\'t visually separated. The design team wants ingredients displayed as a proper bulleted list, but the data comes in as an array after the page loads, so you can\'t just write static HTML - you need to build the list dynamically from the array data.',
    difficulty: 'Medium',
    topic: 'DOM Manipulation, createElement',
    type: 'code',
    instructions: `Create a function called 'createList' that:
1. Takes an array of strings and a container ID
2. Creates a <ul> with <li> elements for each string
3. Appends the list to the container element

Example:
createList(['Apple', 'Banana', 'Cherry'], 'output')
→ Creates <ul><li>Apple</li><li>Banana</li><li>Cherry</li></ul>`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function createList(items, containerId) {
  // Write your code here using createElement
  
}

// Test your function
createList(['Apple', 'Banana', 'Cherry'], 'output');`
    },
    testCases: [
      {
        name: 'Test 1: Creates ul element',
        test: (code) => {
          try {
            document.getElementById('output').innerHTML = '';
            const testFunction = new Function('document', code + '; return createList;');
            const createList = testFunction(document);
            createList(['Apple'], 'output');
            const ul = document.querySelector('#output ul');
            return ul !== null;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Creates correct number of li elements',
        test: (code) => {
          try {
            document.getElementById('output').innerHTML = '';
            const testFunction = new Function('document', code + '; return createList;');
            const createList = testFunction(document);
            createList(['Apple', 'Banana', 'Cherry'], 'output');
            const lis = document.querySelectorAll('#output li');
            return lis.length === 3;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Li elements have correct text',
        test: (code) => {
          try {
            document.getElementById('output').innerHTML = '';
            const testFunction = new Function('document', code + '; return createList;');
            const createList = testFunction(document);
            createList(['Test'], 'output');
            const li = document.querySelector('#output li');
            return li && li.textContent === 'Test';
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 36: DOM Event Handling
  {
    id: 'js-medium-036',
    title: 'Click Counter',
    scenario: 'Your company is running an engagement experiment to see how many times users click a specific call-to-action button. The UX team wants the button itself to show the click count so users can see they\'re participating in something interactive. Each time someone clicks the button, it should update to show "Clicked 1 times", "Clicked 2 times", and so on. This gamification might increase engagement, but you need to track and display the clicks in real-time.',
    difficulty: 'Medium',
    topic: 'DOM Manipulation, Event Listeners',
    type: 'code',
    instructions: `Create a function called 'setupClickCounter' that:
1. Takes a button ID
2. Adds a click event listener to the button
3. Updates the button text to show click count

Example:
setupClickCounter('myButton')
→ Button text changes from "Click me" to "Clicked 1 times", "Clicked 2 times", etc.`,
    starterCode: {
      html: `<button id="counterBtn">Click me</button>`,
      js: `function setupClickCounter(buttonId) {
  // Write your code here
  
}

// Test your function
setupClickCounter('counterBtn');`
    },
    testCases: [
      {
        name: 'Test 1: Button exists and can be found',
        test: (code) => {
          try {
            const button = document.getElementById('counterBtn');
            if (!button) return false;
            button.textContent = 'Click me';
            const testFunction = new Function('document', code + '; return setupClickCounter;');
            const setupClickCounter = testFunction(document);
            setupClickCounter('counterBtn');
            return true;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Button text updates on click',
        test: (code) => {
          try {
            const button = document.getElementById('counterBtn');
            button.textContent = 'Click me';
            const testFunction = new Function('document', code + '; return setupClickCounter;');
            const setupClickCounter = testFunction(document);
            setupClickCounter('counterBtn');
            button.click();
            return button.textContent.includes('1');
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Counter increments correctly',
        test: (code) => {
          try {
            const button = document.getElementById('counterBtn');
            button.textContent = 'Click me';
            const testFunction = new Function('document', code + '; return setupClickCounter;');
            const setupClickCounter = testFunction(document);
            setupClickCounter('counterBtn');
            button.click();
            button.click();
            return button.textContent.includes('2');
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 37: Object.entries
  {
    id: 'js-medium-037',
    title: 'Query String Builder',
    scenario: 'Your e-commerce site needs to build product search URLs that include multiple filters. The search parameters are stored in a JavaScript object like {search: "laptop", price: 500, inStock: true}, but URLs need them formatted as ?search=laptop&price=500&inStock=true. The manual string concatenation approach is messy and bug-prone. You need a reliable way to convert any object of search parameters into a properly formatted URL query string.',
    difficulty: 'Medium',
    topic: 'Object Methods, Object.entries',
    type: 'code',
    instructions: `Create a function called 'buildQueryString' that:
1. Takes an object of key-value pairs
2. Returns a URL query string (e.g., "?key1=value1&key2=value2")
3. Use Object.entries() to iterate

Example:
buildQueryString({search: 'laptop', price: 500, inStock: true})
→ "?search=laptop&price=500&inStock=true"`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function buildQueryString(params) {
  // Write your code here using Object.entries
  
}

// Test your function
console.log(buildQueryString({search: 'laptop', price: 500}));`
    },
    testCases: [
      {
        name: 'Test 1: Starts with question mark',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return buildQueryString;');
            const buildQueryString = testFunction();
            const result = buildQueryString({a: 1});
            return result.startsWith('?');
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Includes all parameters',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return buildQueryString;');
            const buildQueryString = testFunction();
            const result = buildQueryString({search: 'laptop', price: 500});
            return result.includes('search=laptop') && result.includes('price=500');
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Separates parameters with &',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return buildQueryString;');
            const buildQueryString = testFunction();
            const result = buildQueryString({a: 1, b: 2});
            return result.includes('&');
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 38: Array.find and findIndex
  {
    id: 'js-medium-038',
    title: 'User Lookup',
    scenario: 'Your customer database stores users in an array, and the support team needs to update user email addresses when customers request changes. Currently, they have to manually find the user in the database and update the record. The process is slow and error-prone. You need to build a system that can quickly locate a user by their ID, update their email address, and confirm the change was successful. If the user doesn\'t exist, it should indicate that clearly rather than silently failing.',
    difficulty: 'Medium',
    topic: 'Array Methods (find, findIndex)',
    type: 'code',
    instructions: `Create a function called 'updateUserEmail' that:
1. Takes users array, userId, and newEmail
2. Finds the user by ID and updates their email
3. Returns the updated user object or null if not found

Example:
const users = [{id: 1, email: 'old@example.com'}, {id: 2, email: 'test@example.com'}];
updateUserEmail(users, 1, 'new@example.com') 
→ {id: 1, email: 'new@example.com'}`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function updateUserEmail(users, userId, newEmail) {
  // Write your code here using find and findIndex
  
}

// Test your function
const users = [{id: 1, email: 'old@example.com'}];
console.log(updateUserEmail(users, 1, 'new@example.com'));`
    },
    testCases: [
      {
        name: 'Test 1: Updates correct user email',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return updateUserEmail;');
            const updateUserEmail = testFunction();
            const users = [{id: 1, email: 'old@example.com'}];
            const result = updateUserEmail(users, 1, 'new@example.com');
            return result && result.email === 'new@example.com';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Returns null for non-existent user',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return updateUserEmail;');
            const updateUserEmail = testFunction();
            const users = [{id: 1, email: 'test@example.com'}];
            const result = updateUserEmail(users, 999, 'new@example.com');
            return result === null;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Does not affect other users',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return updateUserEmail;');
            const updateUserEmail = testFunction();
            const users = [{id: 1, email: 'user1@example.com'}, {id: 2, email: 'user2@example.com'}];
            updateUserEmail(users, 1, 'updated@example.com');
            return users[1].email === 'user2@example.com';
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 39: Async/Promises (simulated)
  {
    id: 'js-medium-039',
    title: 'Data Fetcher with Timeout',
    scenario: 'Your weather app needs to simulate loading weather data from a server. In real applications, network requests take time and happen asynchronously. To test your loading indicators and user experience, you need to simulate these delayed responses. The simulation should wait for a specified amount of time (like a real network request would) before returning the weather data, allowing you to see how the app behaves during loading states.',
    difficulty: 'Medium',
    topic: 'Promises, Async Operations',
    type: 'code',
    instructions: `Create a function called 'fetchWithTimeout' that:
1. Takes data and delay (milliseconds)
2. Returns a Promise that resolves with data after delay
3. Simulates async data fetching

Example:
fetchWithTimeout('Hello', 1000).then(data => console.log(data))
→ Logs "Hello" after 1 second`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function fetchWithTimeout(data, delay) {
  // Write your code here returning a Promise
  
}

// Test your function
fetchWithTimeout('Test', 100).then(data => {
  document.getElementById('output').textContent = data;
});`
    },
    testCases: [
      {
        name: 'Test 1: Returns a Promise',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return fetchWithTimeout;');
            const fetchWithTimeout = testFunction();
            const result = fetchWithTimeout('Test', 10);
            return result instanceof Promise;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Resolves with correct data',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return fetchWithTimeout;');
            const fetchWithTimeout = testFunction();
            const result = await fetchWithTimeout('Hello', 10);
            return result === 'Hello';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Waits for specified delay',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return fetchWithTimeout;');
            const fetchWithTimeout = testFunction();
            const start = Date.now();
            await fetchWithTimeout('Data', 50);
            const elapsed = Date.now() - start;
            return elapsed >= 45; // Allow small margin
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 40: Destructuring with Nested Objects
  {
    id: 'js-medium-040',
    title: 'Extract Nested Data',
    scenario: 'Your mobile app receives deeply nested JSON responses from a legacy API that was designed years ago. The data structure is complex: user information is buried inside user.profile.name, user.profile.email, and user.settings.theme. Your UI components need this data in a simple, flat object format for easy access. Instead of repeatedly writing long property chains throughout your code, you need to extract just the specific pieces of data you need into a clean, simple object.',
    difficulty: 'Medium',
    topic: 'Object Destructuring, Nested Objects',
    type: 'code',
    instructions: `Create a function called 'extractUserData' that:
1. Takes an API response object with nested structure
2. Extracts: user.profile.name, user.profile.email, user.settings.theme
3. Returns a flat object with these three properties

Example:
const response = {user: {profile: {name: 'John', email: 'john@example.com'}, settings: {theme: 'dark'}}};
extractUserData(response) → {name: 'John', email: 'john@example.com', theme: 'dark'}`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function extractUserData(apiResponse) {
  // Write your code here using destructuring
  
}

// Test your function
const response = {
  user: {
    profile: {name: 'John', email: 'john@example.com'},
    settings: {theme: 'dark'}
  }
};
console.log(extractUserData(response));`
    },
    testCases: [
      {
        name: 'Test 1: Extracts name correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return extractUserData;');
            const extractUserData = testFunction();
            const response = {user: {profile: {name: 'John', email: 'john@example.com'}, settings: {theme: 'dark'}}};
            const result = extractUserData(response);
            return result.name === 'John';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Extracts email correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return extractUserData;');
            const extractUserData = testFunction();
            const response = {user: {profile: {name: 'Jane', email: 'jane@example.com'}, settings: {theme: 'light'}}};
            const result = extractUserData(response);
            return result.email === 'jane@example.com';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Extracts theme correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return extractUserData;');
            const extractUserData = testFunction();
            const response = {user: {profile: {name: 'Bob', email: 'bob@example.com'}, settings: {theme: 'blue'}}};
            const result = extractUserData(response);
            return result.theme === 'blue';
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // ========== HARD LEVEL QUESTIONS ==========
  
  // QUESTION 41: Advanced Array Chaining
  {
    id: 'js-hard-041',
    title: 'E-commerce Analytics Pipeline',
    scenario: 'Your e-commerce analytics dashboard is running slow because it processes every single transaction, even tiny $5 purchases that don\'t significantly impact revenue. The business team only cares about substantial transactions over $100. They want to see the top 3 revenue-generating product categories, but the current system shows all categories unsorted. Processing millions of small transactions is wasting server resources and making reports take minutes to generate when they should be instant.',
    difficulty: 'Hard',
    topic: 'Advanced Array Methods (Chaining)',
    type: 'code',
    instructions: `Create a function called 'analyzeTransactions' that:
1. Takes an array of transaction objects: {productId, productName, price, quantity, category, date}
2. Filters transactions where total (price * quantity) > 100
3. Groups by category, calculates total revenue per category
4. Returns top 3 categories sorted by revenue (descending)
5. Output format: [{category, revenue, transactionCount}]

Example:
const transactions = [
  {productId: 1, productName: 'Laptop', price: 1000, quantity: 2, category: 'Electronics', date: '2024-01-15'},
  {productId: 2, productName: 'Mouse', price: 25, quantity: 1, category: 'Electronics', date: '2024-01-16'}
];
analyzeTransactions(transactions) → [{category: 'Electronics', revenue: 2000, transactionCount: 1}]`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function analyzeTransactions(transactions) {
  // Write your code using advanced array chaining
  
}

// Test your function
const transactions = [
  {productId: 1, productName: 'Laptop', price: 1000, quantity: 2, category: 'Electronics', date: '2024-01-15'}
];
console.log(analyzeTransactions(transactions));`
    },
    testCases: [
      {
        name: 'Test 1: Filters transactions over 100',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return analyzeTransactions;');
            const analyzeTransactions = testFunction();
            const transactions = [
              {productId: 1, productName: 'Item', price: 10, quantity: 5, category: 'A', date: '2024-01-15'},
              {productId: 2, productName: 'Item2', price: 200, quantity: 1, category: 'B', date: '2024-01-15'}
            ];
            const result = analyzeTransactions(transactions);
            return result.length === 1 && result[0].category === 'B';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Groups by category correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return analyzeTransactions;');
            const analyzeTransactions = testFunction();
            const transactions = [
              {productId: 1, productName: 'Item1', price: 100, quantity: 2, category: 'Electronics', date: '2024-01-15'},
              {productId: 2, productName: 'Item2', price: 150, quantity: 1, category: 'Electronics', date: '2024-01-16'}
            ];
            const result = analyzeTransactions(transactions);
            return result[0].revenue === 350 && result[0].transactionCount === 2;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Returns top 3 categories only',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return analyzeTransactions;');
            const analyzeTransactions = testFunction();
            const transactions = [
              {productId: 1, productName: 'Item1', price: 100, quantity: 2, category: 'A', date: '2024-01-15'},
              {productId: 2, productName: 'Item2', price: 100, quantity: 3, category: 'B', date: '2024-01-15'},
              {productId: 3, productName: 'Item3', price: 100, quantity: 4, category: 'C', date: '2024-01-15'},
              {productId: 4, productName: 'Item4', price: 100, quantity: 5, category: 'D', date: '2024-01-15'}
            ];
            const result = analyzeTransactions(transactions);
            return result.length === 3;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 42: Debounce Implementation
  {
    id: 'js-hard-042',
    title: 'Search Input Debouncer',
    scenario: 'Users are typing product names into your search box, and your server is getting hammered with API requests - one for every single keystroke. Someone typing "laptop" generates 6 separate API calls in under 2 seconds! Your server bills by the request, your costs are skyrocketing, and the search results are flickering rapidly as each request completes. You need to wait until users finish typing before sending the search request, but how do you know when they\'re actually done versus just pausing briefly?',
    difficulty: 'Hard',
    topic: 'Closures, Higher-Order Functions',
    type: 'code',
    instructions: `Create a function called 'debounce' that:
1. Takes a function and a delay in milliseconds
2. Returns a debounced version of the function
3. The debounced function delays execution until after delay ms have passed since last call
4. Should maintain the correct 'this' context

Example:
const debouncedSearch = debounce((query) => console.log(query), 300);
debouncedSearch('a'); debouncedSearch('ab'); debouncedSearch('abc');
// Only logs 'abc' after 300ms`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function debounce(func, delay) {
  // Write your code implementing debounce
  
}

// Test your function
const debouncedLog = debounce((msg) => console.log(msg), 100);
debouncedLog('test');`
    },
    testCases: [
      {
        name: 'Test 1: Delays function execution',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return debounce;');
            const debounce = testFunction();
            let called = false;
            const debounced = debounce(() => { called = true; }, 50);
            debounced();
            if (called) return false; // Should not be called immediately
            await new Promise(resolve => setTimeout(resolve, 60));
            return called; // Should be called after delay
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Cancels previous calls',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return debounce;');
            const debounce = testFunction();
            let callCount = 0;
            const debounced = debounce(() => { callCount++; }, 50);
            debounced();
            debounced();
            debounced();
            await new Promise(resolve => setTimeout(resolve, 60));
            return callCount === 1; // Should only call once
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Passes arguments correctly',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return debounce;');
            const debounce = testFunction();
            let result = null;
            const debounced = debounce((a, b) => { result = a + b; }, 50);
            debounced(5, 10);
            await new Promise(resolve => setTimeout(resolve, 60));
            return result === 15;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 43: Deep Clone with Circular Reference
  {
    id: 'js-hard-043',
    title: 'Deep Object Cloner',
    scenario: 'Your state management system needs to create copies of complex nested objects for the undo/redo feature. Using simple object spread or JSON.parse/stringify doesn\'t work - spread only copies the top level (changing nested values affects the original), and JSON methods fail when objects reference themselves. Users are editing nested data structures, and changes are leaking into the history, corrupting the undo stack. You need true deep copies that handle any level of nesting and circular references where objects point to themselves.',
    difficulty: 'Hard',
    topic: 'Objects, Recursion, WeakMap',
    type: 'code',
    instructions: `Create a function called 'deepClone' that:
1. Takes an object and creates a deep copy
2. Handles nested objects and arrays
3. Prevents infinite loops from circular references
4. Uses WeakMap to track visited objects

Example:
const original = {a: 1, b: {c: 2}};
const cloned = deepClone(original);
cloned.b.c = 3; // original.b.c remains 2`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function deepClone(obj, visited = new WeakMap()) {
  // Write your code implementing deep clone
  
}

// Test your function
const obj = {a: 1, b: {c: 2}};
console.log(deepClone(obj));`
    },
    testCases: [
      {
        name: 'Test 1: Creates independent copy',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return deepClone;');
            const deepClone = testFunction();
            const original = {a: 1, b: {c: 2}};
            const cloned = deepClone(original);
            cloned.b.c = 999;
            return original.b.c === 2;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Handles arrays',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return deepClone;');
            const deepClone = testFunction();
            const original: any = {arr: [1, 2, {x: 3}]};
            const cloned = deepClone(original);
            cloned.arr[2].x = 999;
            return original.arr[2].x === 3;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Handles circular references',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return deepClone;');
            const deepClone = testFunction();
            const original: any = {a: 1};
            original.self = original;
            const cloned = deepClone(original);
            return cloned.self === cloned && cloned !== original;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 44: Promise.all Implementation
  {
    id: 'js-hard-044',
    title: 'Custom Promise.all',
    scenario: 'Your dashboard loads data from 5 different microservices, and you\'re making 5 separate API calls one after another. Each takes 1 second, so users wait 5 seconds staring at a loading spinner. The services don\'t depend on each other - you could call them simultaneously! But Promise.all is too magical and you need to understand how to coordinate multiple asynchronous operations, handle their results in the correct order, and fail fast if any request fails. Build it from scratch to learn how concurrent async operations really work.',
    difficulty: 'Hard',
    topic: 'Promises, Async Operations',
    type: 'code',
    instructions: `Create a function called 'promiseAll' that:
1. Takes an array of promises
2. Returns a promise that resolves when all input promises resolve
3. Rejects immediately if any promise rejects
4. Resolves with an array of results in the same order

Example:
promiseAll([Promise.resolve(1), Promise.resolve(2)])
  .then(results => console.log(results)); // [1, 2]`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function promiseAll(promises) {
  // Write your code implementing Promise.all
  
}

// Test your function
promiseAll([Promise.resolve(1), Promise.resolve(2)])
  .then(results => console.log(results));`
    },
    testCases: [
      {
        name: 'Test 1: Resolves with all results',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return promiseAll;');
            const promiseAll = testFunction();
            const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
            const result = await promiseAll(promises);
            return Array.isArray(result) && result.length === 3 && result[0] === 1;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Maintains order of results',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return promiseAll;');
            const promiseAll = testFunction();
            const promises = [
              new Promise(resolve => setTimeout(() => resolve(1), 100)),
              Promise.resolve(2)
            ];
            const result = await promiseAll(promises);
            return result[0] === 1 && result[1] === 2;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Rejects if any promise rejects',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return promiseAll;');
            const promiseAll = testFunction();
            const promises = [Promise.resolve(1), Promise.reject('error')];
            await promiseAll(promises);
            return false; // Should have rejected
          } catch (error) {
            return error === 'error';
          }
        }
      }
    ]
  },

  // QUESTION 45: Memoization Cache
  {
    id: 'js-hard-045',
    title: 'Function Memoizer',
    scenario: 'Your data visualization dashboard recalculates complex mathematical transformations every time users hover over a chart point. The same calculation runs hundreds of times for the same input values, making the UI lag and feel unresponsive. Users are frustrated by the choppy experience. The calculations are expensive but deterministic - the same input always produces the same output. You need to remember results from previous calculations and instantly return them instead of recomputing, without manually managing a cache object scattered throughout your codebase.',
    difficulty: 'Hard',
    topic: 'Closures, Higher-Order Functions, Caching',
    type: 'code',
    instructions: `Create a function called 'memoize' that:
1. Takes a function as input
2. Returns a memoized version that caches results
3. Uses function arguments as cache keys
4. Returns cached result if same arguments are used again

Example:
const expensiveFunc = (n) => { console.log('Computing...'); return n * 2; };
const memoized = memoize(expensiveFunc);
memoized(5); // Logs 'Computing...', returns 10
memoized(5); // Returns 10 from cache, no log`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function memoize(func) {
  // Write your code implementing memoization
  
}

// Test your function
const expensive = (n) => n * 2;
const memoized = memoize(expensive);
console.log(memoized(5));`
    },
    testCases: [
      {
        name: 'Test 1: Returns correct result',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return memoize;');
            const memoize = testFunction();
            const func = (n) => n * 2;
            const memoized = memoize(func);
            return memoized(5) === 10;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Caches results',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return memoize;');
            const memoize = testFunction();
            let callCount = 0;
            const func = (n) => { callCount++; return n * 2; };
            const memoized = memoize(func);
            memoized(5);
            memoized(5);
            memoized(5);
            return callCount === 1; // Should only compute once
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Handles different arguments',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return memoize;');
            const memoize = testFunction();
            let callCount = 0;
            const func = (n) => { callCount++; return n * 2; };
            const memoized = memoize(func);
            memoized(5);
            memoized(10);
            return callCount === 2; // Should compute for each unique argument
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 46: Custom Event Emitter
  {
    id: 'js-hard-046',
    title: 'Event Emitter Class',
    scenario: 'Your application has multiple components that need to react when important events happen - when a user logs in, when data updates, when errors occur. Currently, components are tightly coupled, directly calling functions on each other, making the code a tangled mess that\'s impossible to test or modify. You need a central event system where components can announce events without knowing who\'s listening, and other components can listen for events without knowing who triggered them. Components should be able to subscribe to events, unsubscribe when they\'re done, and broadcast events with data.',
    difficulty: 'Hard',
    topic: 'ES6 Classes, Design Patterns',
    type: 'code',
    instructions: `Create a class called 'EventEmitter' that:
1. Has methods: on(event, callback), emit(event, data), off(event, callback)
2. on() registers a callback for an event
3. emit() triggers all callbacks for an event
4. off() removes a specific callback

Example:
const emitter = new EventEmitter();
const handler = (data) => console.log(data);
emitter.on('test', handler);
emitter.emit('test', 'Hello'); // Logs 'Hello'
emitter.off('test', handler);`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `class EventEmitter {
  // Write your EventEmitter implementation
  
}

// Test your class
const emitter = new EventEmitter();
emitter.on('test', (data) => console.log(data));
emitter.emit('test', 'Hello');`
    },
    testCases: [
      {
        name: 'Test 1: Registers and triggers events',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return EventEmitter;');
            const EventEmitter = testFunction();
            const emitter = new EventEmitter();
            let result = null;
            emitter.on('test', (data) => { result = data; });
            emitter.emit('test', 'Hello');
            return result === 'Hello';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Supports multiple listeners',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return EventEmitter;');
            const EventEmitter = testFunction();
            const emitter = new EventEmitter();
            let count = 0;
            emitter.on('test', () => { count++; });
            emitter.on('test', () => { count++; });
            emitter.emit('test');
            return count === 2;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Removes listeners correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return EventEmitter;');
            const EventEmitter = testFunction();
            const emitter = new EventEmitter();
            let count = 0;
            const handler = () => { count++; };
            emitter.on('test', handler);
            emitter.off('test', handler);
            emitter.emit('test');
            return count === 0;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 47: Flatten Nested Array
  {
    id: 'js-hard-047',
    title: 'Recursive Array Flattener',
    scenario: 'Your file system scanner returns directory structures as deeply nested arrays - folders within folders within folders, sometimes 10 levels deep. Your reporting system needs a simple flat list of all files to count totals and calculate sizes, but it keeps failing because Array.flat() doesn\'t exist in your target browsers and you can\'t predict the nesting depth ahead of time. You need to take these arbitrarily nested arrays and flatten them completely into a single-level array, no matter how deep the nesting goes.',
    difficulty: 'Hard',
    topic: 'Recursion, Array Methods',
    type: 'code',
    instructions: `Create a function called 'flattenArray' that:
1. Takes a nested array of any depth
2. Returns a flattened array with all elements at the same level
3. Uses recursion to handle arbitrary nesting
4. Preserves element order

Example:
flattenArray([1, [2, [3, [4]], 5]]) → [1, 2, 3, 4, 5]`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function flattenArray(arr) {
  // Write your code using recursion
  
}

// Test your function
console.log(flattenArray([1, [2, [3, 4]]]));`
    },
    testCases: [
      {
        name: 'Test 1: Flattens single level',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return flattenArray;');
            const flattenArray = testFunction();
            const result = flattenArray([1, [2, 3], 4]);
            return JSON.stringify(result) === JSON.stringify([1, 2, 3, 4]);
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Flattens deep nesting',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return flattenArray;');
            const flattenArray = testFunction();
            const result = flattenArray([1, [2, [3, [4]]]]);
            return JSON.stringify(result) === JSON.stringify([1, 2, 3, 4]);
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Handles empty arrays',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return flattenArray;');
            const flattenArray = testFunction();
            const result = flattenArray([1, [], [2, []], 3]);
            return JSON.stringify(result) === JSON.stringify([1, 2, 3]);
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 48: Throttle Implementation
  {
    id: 'js-hard-048',
    title: 'Scroll Event Throttler',
    scenario: 'Your webpage has a scroll event that updates the navigation bar\'s appearance as users scroll. The scroll event fires hundreds of times per second, causing your update function to run so frequently that it makes scrolling feel janky and uses up CPU. Unlike debouncing (which waits for quiet moments), you need the updates to happen continuously while scrolling - just not hundreds of times per second. You need to limit execution to maybe once every 100ms, so the navigation updates smoothly without overwhelming the browser.',
    difficulty: 'Hard',
    topic: 'Closures, Timing Functions',
    type: 'code',
    instructions: `Create a function called 'throttle' that:
1. Takes a function and a delay in milliseconds
2. Returns a throttled version that executes at most once per delay period
3. The first call executes immediately
4. Subsequent calls within delay period are ignored

Example:
const throttled = throttle(() => console.log('Scrolled'), 1000);
// Calling rapidly will only log once per second`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function throttle(func, delay) {
  // Write your code implementing throttle
  
}

// Test your function
const throttled = throttle(() => console.log('Called'), 100);
throttled();`
    },
    testCases: [
      {
        name: 'Test 1: Executes immediately on first call',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return throttle;');
            const throttle = testFunction();
            let called = false;
            const throttled = throttle(() => { called = true; }, 1000);
            throttled();
            return called;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Limits execution frequency',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return throttle;');
            const throttle = testFunction();
            let callCount = 0;
            const throttled = throttle(() => { callCount++; }, 100);
            throttled();
            throttled();
            throttled();
            await new Promise(resolve => setTimeout(resolve, 50));
            return callCount === 1;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Allows execution after delay',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return throttle;');
            const throttle = testFunction();
            let callCount = 0;
            const throttled = throttle(() => { callCount++; }, 50);
            throttled();
            await new Promise(resolve => setTimeout(resolve, 60));
            throttled();
            return callCount === 2;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 49: LRU Cache
  {
    id: 'js-hard-049',
    title: 'LRU Cache Implementation',
    scenario: 'Your image gallery app caches downloaded images in memory, but users browse through hundreds of photos, and eventually the cache consumes gigabytes of RAM, crashing mobile browsers. You can\'t cache everything forever. You need a smart cache with a size limit that automatically removes old items when it gets full. But which items should be removed? Remove the least recently accessed ones - if someone looked at a photo recently, they might look at it again soon. If they haven\'t looked at it in a while, it\'s probably safe to remove it to make room for new items.',
    difficulty: 'Hard',
    topic: 'Data Structures, ES6 Classes',
    type: 'code',
    instructions: `Create a class called 'LRUCache' that:
1. Constructor takes capacity (max number of items)
2. Has methods: get(key), put(key, value)
3. get() returns value or -1 if not found, marks item as recently used
4. put() adds/updates item, evicts least recently used if at capacity

Example:
const cache = new LRUCache(2);
cache.put('a', 1); cache.put('b', 2);
cache.get('a'); // Returns 1
cache.put('c', 3); // Evicts 'b'`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `class LRUCache {
  // Write your LRU Cache implementation
  
}

// Test your class
const cache = new LRUCache(2);
cache.put('a', 1);
console.log(cache.get('a'));`
    },
    testCases: [
      {
        name: 'Test 1: Stores and retrieves values',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return LRUCache;');
            const LRUCache = testFunction();
            const cache = new LRUCache(2);
            cache.put('a', 1);
            return cache.get('a') === 1;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Returns -1 for missing keys',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return LRUCache;');
            const LRUCache = testFunction();
            const cache = new LRUCache(2);
            return cache.get('nonexistent') === -1;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Evicts least recently used',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return LRUCache;');
            const LRUCache = testFunction();
            const cache = new LRUCache(2);
            cache.put('a', 1);
            cache.put('b', 2);
            cache.put('c', 3); // Should evict 'a'
            return cache.get('a') === -1 && cache.get('b') === 2;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 50: Curry Function
  {
    id: 'js-hard-050',
    title: 'Function Currying',
    scenario: 'Your logging utility needs a function that combines a log level, timestamp, and message. But in different parts of your app, you want pre-configured loggers - one that always logs at "ERROR" level, another at "INFO" level - without repeating the log level every single time. Currying lets you create specialized functions from general ones by fixing some arguments upfront. Instead of logger("ERROR", timestamp, message) everywhere, you could have errorLogger(timestamp, message) that remembers it\'s always ERROR level.',
    difficulty: 'Hard',
    topic: 'Functional Programming, Closures',
    type: 'code',
    instructions: `Create a function called 'curry' that:
1. Takes a function as input
2. Returns a curried version that can be called with partial arguments
3. Continues returning functions until all arguments are provided
4. Then executes the original function

Example:
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
curriedAdd(1)(2)(3) → 6
curriedAdd(1, 2)(3) → 6`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function curry(func) {
  // Write your code implementing curry
  
}

// Test your function
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3));`
    },
    testCases: [
      {
        name: 'Test 1: Handles single argument per call',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return curry;');
            const curry = testFunction();
            const add = (a, b, c) => a + b + c;
            const curriedAdd = curry(add);
            return curriedAdd(1)(2)(3) === 6;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Handles multiple arguments',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return curry;');
            const curry = testFunction();
            const add = (a, b, c) => a + b + c;
            const curriedAdd = curry(add);
            return curriedAdd(1, 2)(3) === 6;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Creates partial applications',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return curry;');
            const curry = testFunction();
            const multiply = (a, b, c) => a * b * c;
            const curriedMultiply = curry(multiply);
            const multiplyBy2 = curriedMultiply(2);
            return multiplyBy2(3)(4) === 24;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 51: Binary Search Tree
  {
    id: 'js-hard-051',
    title: 'Binary Search Tree Implementation',
    scenario: 'Your company\'s employee directory has 50,000 employees, and searching through them linearly (checking each one until you find a match) takes too long. Users are complaining that looking up a coworker takes several seconds. Array.includes() and Array.find() are too slow for large datasets. You need a data structure that keeps data organized so you can find anyone in milliseconds, even with tens of thousands of records. A Binary Search Tree automatically organizes data as you add it, splitting left and right, so searching becomes dramatically faster.',
    difficulty: 'Hard',
    topic: 'Data Structures, ES6 Classes',
    type: 'code',
    instructions: `Create a class called 'BST' that:
1. Has methods: insert(value), search(value), getMin(), getMax()
2. insert() adds values maintaining BST property
3. search() returns true if value exists, false otherwise
4. getMin() returns minimum value, getMax() returns maximum value

Example:
const bst = new BST();
bst.insert(5); bst.insert(3); bst.insert(7);
bst.search(3) → true
bst.getMin() → 3`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `class BST {
  // Write your BST implementation
  
}

// Test your class
const bst = new BST();
bst.insert(5);
console.log(bst.search(5));`
    },
    testCases: [
      {
        name: 'Test 1: Inserts and finds values',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return BST;');
            const BST = testFunction();
            const bst = new BST();
            bst.insert(5);
            bst.insert(3);
            bst.insert(7);
            return bst.search(3) === true && bst.search(7) === true;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Returns false for missing values',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return BST;');
            const BST = testFunction();
            const bst = new BST();
            bst.insert(5);
            return bst.search(10) === false;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Finds min and max correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return BST;');
            const BST = testFunction();
            const bst = new BST();
            bst.insert(5);
            bst.insert(3);
            bst.insert(7);
            bst.insert(1);
            bst.insert(9);
            return bst.getMin() === 1 && bst.getMax() === 9;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 52: Async Retry Logic
  {
    id: 'js-hard-052',
    title: 'Async Function with Retry',
    scenario: 'Your mobile app makes API calls, but cellular connections are unreliable - requests frequently fail with network errors. When a request fails, your app just shows an error message, forcing users to manually retry by refreshing. This creates a frustrating experience for users on flaky connections. Instead of failing immediately, the app should automatically retry failed requests a few times before giving up, making the app more resilient to temporary network issues without bothering the user with transient failures.',
    difficulty: 'Hard',
    topic: 'Async/Await, Error Handling',
    type: 'code',
    instructions: `Create a function called 'retryAsync' that:
1. Takes an async function and maxRetries count
2. Executes the function, retrying on failure up to maxRetries times
3. Returns result if successful
4. Throws error if all retries fail

Example:
let attempts = 0;
const unreliableFunc = async () => {
  attempts++;
  if (attempts < 3) throw new Error('Failed');
  return 'Success';
};
await retryAsync(unreliableFunc, 3) → 'Success'`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `async function retryAsync(asyncFunc, maxRetries) {
  // Write your code implementing retry logic
  
}

// Test your function
let attempts = 0;
const testFunc = async () => {
  attempts++;
  if (attempts < 2) throw new Error('Failed');
  return 'Success';
};
retryAsync(testFunc, 3).then(result => console.log(result));`
    },
    testCases: [
      {
        name: 'Test 1: Returns result on success',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return retryAsync;');
            const retryAsync = testFunction();
            const successFunc = async () => 'Success';
            const result = await retryAsync(successFunc, 3);
            return result === 'Success';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Retries on failure',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return retryAsync;');
            const retryAsync = testFunction();
            let attempts = 0;
            const failThenSucceed = async () => {
              attempts++;
              if (attempts < 3) throw new Error('Failed');
              return 'Success';
            };
            await retryAsync(failThenSucceed, 3);
            return attempts === 3;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Throws after max retries',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return retryAsync;');
            const retryAsync = testFunction();
            const alwaysFail = async () => { throw new Error('Always fails'); };
            await retryAsync(alwaysFail, 2);
            return false; // Should have thrown
          } catch (error) {
            return true;
          }
        }
      }
    ]
  },

  // QUESTION 53: Object Composition
  {
    id: 'js-hard-053',
    title: 'Object Composer',
    scenario: 'Your game has different character types that share abilities - some characters can walk, some can swim, some can fly. Using traditional class inheritance creates a mess because a flying fish needs both swim and fly, but your class hierarchy only allows single inheritance. The diamond problem appears everywhere. Instead of "is-a" relationships, you need "has-a" - compose characters from individual ability objects. Take multiple behavior objects and merge them into one character object with all the combined capabilities.',
    difficulty: 'Hard',
    topic: 'Object Composition, Spread Operator',
    type: 'code',
    instructions: `Create a function called 'compose' that:
1. Takes multiple objects as arguments
2. Returns a new object with all properties and methods combined
3. Later arguments override earlier ones for conflicting properties
4. Methods maintain their 'this' context

Example:
const canEat = {eat: () => 'eating'};
const canWalk = {walk: () => 'walking'};
const person = compose(canEat, canWalk, {name: 'John'});
person.eat() → 'eating'`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function compose(...objects) {
  // Write your code implementing object composition
  
}

// Test your function
const obj1 = {a: 1};
const obj2 = {b: 2};
console.log(compose(obj1, obj2));`
    },
    testCases: [
      {
        name: 'Test 1: Combines all properties',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return compose;');
            const compose = testFunction();
            const obj1 = {a: 1};
            const obj2 = {b: 2};
            const result = compose(obj1, obj2);
            return result.a === 1 && result.b === 2;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Later objects override earlier',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return compose;');
            const compose = testFunction();
            const obj1 = {a: 1};
            const obj2 = {a: 2};
            const result = compose(obj1, obj2);
            return result.a === 2;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Preserves methods',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return compose;');
            const compose = testFunction();
            const obj1 = {greet: () => 'Hello'};
            const result = compose(obj1);
            return typeof result.greet === 'function' && result.greet() === 'Hello';
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 54: Generator Function
  {
    id: 'js-hard-054',
    title: 'ID Generator with Generators',
    scenario: 'Your system creates thousands of database records per minute, and each needs a unique ID. You started with Math.random() but got collisions. You switched to timestamps but got duplicates when records were created in the same millisecond. UUID libraries are heavy dependencies. You need a simple, reliable way to generate sequential unique IDs like "user-100", "user-101", "user-102". Generator functions can maintain state between calls, yielding the next ID each time without managing complex counter variables throughout your codebase.',
    difficulty: 'Hard',
    topic: 'Generators, Iterators',
    type: 'code',
    instructions: `Create a generator function called 'idGenerator' that:
1. Yields sequential IDs starting from a given number
2. Can optionally take a prefix string
3. Generates IDs like: prefix-1, prefix-2, prefix-3, etc.
4. Uses generator function syntax (function*)

Example:
const gen = idGenerator('user', 100);
gen.next().value → 'user-100'
gen.next().value → 'user-101'`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function* idGenerator(prefix, start) {
  // Write your generator function
  
}

// Test your function
const gen = idGenerator('user', 1);
console.log(gen.next().value);
console.log(gen.next().value);`
    },
    testCases: [
      {
        name: 'Test 1: Generates sequential IDs',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return idGenerator;');
            const idGenerator = testFunction();
            const gen = idGenerator('test', 1);
            const id1 = gen.next().value;
            const id2 = gen.next().value;
            return id1 === 'test-1' && id2 === 'test-2';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Respects starting number',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return idGenerator;');
            const idGenerator = testFunction();
            const gen = idGenerator('user', 100);
            return gen.next().value === 'user-100';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Works with different prefixes',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return idGenerator;');
            const idGenerator = testFunction();
            const gen = idGenerator('order', 1);
            return gen.next().value === 'order-1';
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 55: Proxy Object
  {
    id: 'js-hard-055',
    title: 'Validation Proxy',
    scenario: 'Your user profile form keeps receiving invalid data - ages set to strings like "twenty-five", names set to numbers, boolean fields set to null. These type mismatches crash your database and corrupt records. Validating every single property assignment throughout your codebase is tedious and error-prone. You need an object that automatically validates whenever any property is set, checking that the value matches the expected type defined in a schema. If someone tries to set age to a string, it should throw an error immediately.',
    difficulty: 'Hard',
    topic: 'Proxy, Meta-programming',
    type: 'code',
    instructions: `Create a function called 'createValidatedObject' that:
1. Takes a schema object defining validation rules
2. Returns a proxy that validates property assignments
3. Throws error if value doesn't match schema type
4. Schema format: {propertyName: 'type'}

Example:
const schema = {age: 'number', name: 'string'};
const obj = createValidatedObject(schema);
obj.age = 25; // OK
obj.age = 'invalid'; // Throws error`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function createValidatedObject(schema) {
  // Write your code using Proxy
  
}

// Test your function
const schema = {age: 'number'};
const obj = createValidatedObject(schema);
obj.age = 25;
console.log(obj.age);`
    },
    testCases: [
      {
        name: 'Test 1: Allows valid assignments',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return createValidatedObject;');
            const createValidatedObject = testFunction();
            const schema = {age: 'number'};
            const obj = createValidatedObject(schema);
            obj.age = 25;
            return obj.age === 25;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Rejects invalid types',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return createValidatedObject;');
            const createValidatedObject = testFunction();
            const schema = {age: 'number'};
            const obj = createValidatedObject(schema);
            try {
              obj.age = 'invalid';
              return false; // Should have thrown
            } catch (e) {
              return true;
            }
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Validates string types',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return createValidatedObject;');
            const createValidatedObject = testFunction();
            const schema = {name: 'string'};
            const obj = createValidatedObject(schema);
            obj.name = 'John';
            return obj.name === 'John';
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 56: Async Queue
  {
    id: 'js-hard-056',
    title: 'Async Task Queue',
    scenario: 'Your app uploads files to a server, and users are uploading multiple files simultaneously. This overwhelms the server with concurrent uploads, causes rate limiting errors, and makes the server performance degrade. Some uploads succeed, some fail randomly, and the UI shows inconsistent states. You need uploads to happen one at a time, in order, with each upload waiting for the previous one to complete. This prevents server overload while giving users a predictable, sequential upload experience.',
    difficulty: 'Hard',
    topic: 'Async/Await, Queues',
    type: 'code',
    instructions: `Create a class called 'AsyncQueue' that:
1. Has method: enqueue(asyncFunction)
2. Processes tasks one at a time in order
3. Each task waits for the previous one to complete
4. Returns a promise that resolves when the task completes

Example:
const queue = new AsyncQueue();
queue.enqueue(async () => { await delay(100); return 'First'; });
queue.enqueue(async () => 'Second'); // Waits for first`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `class AsyncQueue {
  // Write your AsyncQueue implementation
  
}

// Test your class
const queue = new AsyncQueue();
queue.enqueue(async () => 'Task 1').then(console.log);`
    },
    testCases: [
      {
        name: 'Test 1: Processes tasks in order',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return AsyncQueue;');
            const AsyncQueue = testFunction();
            const queue = new AsyncQueue();
            const results = [];
            await Promise.all([
              queue.enqueue(async () => { results.push(1); return 1; }),
              queue.enqueue(async () => { results.push(2); return 2; })
            ]);
            return results[0] === 1 && results[1] === 2;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Waits for previous task',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return AsyncQueue;');
            const AsyncQueue = testFunction();
            const queue = new AsyncQueue();
            const order = [];
            queue.enqueue(async () => {
              await new Promise(resolve => setTimeout(resolve, 50));
              order.push(1);
            });
            queue.enqueue(async () => { order.push(2); });
            await new Promise(resolve => setTimeout(resolve, 100));
            return order[0] === 1 && order[1] === 2;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Returns task results',
        test: async (code) => {
          try {
            const testFunction = new Function(code + '; return AsyncQueue;');
            const AsyncQueue = testFunction();
            const queue = new AsyncQueue();
            const result = await queue.enqueue(async () => 'Done');
            return result === 'Done';
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 57: Prototype Chain
  {
    id: 'js-hard-057',
    title: 'Custom Inheritance System',
    scenario: 'You\'re working on a legacy codebase that uses constructor functions instead of ES6 classes, and you need to implement inheritance. A Dog should inherit from Animal - all dogs can speak their name (inherited from Animal), but you also need Dog-specific properties like breed. JavaScript\'s prototype chain is confusing, and when you try setting Dog.prototype = Animal.prototype, changes to Dog affect Animal too. You need to properly set up the prototype chain so Dog instances inherit Animal methods without creating this pollution problem.',
    difficulty: 'Hard',
    topic: 'Prototypes, Inheritance',
    type: 'code',
    instructions: `Create a function called 'inherit' that:
1. Takes a parent constructor and child constructor
2. Sets up proper prototype chain
3. Child instances can access parent methods
4. Constructor functions work correctly

Example:
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name; };
function Dog(name, breed) { Animal.call(this, name); this.breed = breed; }
inherit(Animal, Dog);
const dog = new Dog('Rex', 'Labrador');
dog.speak() → 'Rex'`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function inherit(Parent, Child) {
  // Write your code setting up inheritance
  
}

// Test your function
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name; };
function Dog(name) { Animal.call(this, name); }
inherit(Animal, Dog);
const dog = new Dog('Rex');
console.log(dog.speak());`
    },
    testCases: [
      {
        name: 'Test 1: Child inherits parent methods',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return inherit;');
            const inherit = testFunction();
            function Animal(name) { this.name = name; }
            Animal.prototype.speak = function() { return this.name; };
            function Dog(name) { Animal.call(this, name); }
            inherit(Animal, Dog);
            const dog = new Dog('Rex');
            return dog.speak() === 'Rex';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Constructor works correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return inherit;');
            const inherit = testFunction();
            function Animal(name) { this.name = name; }
            function Dog(name) { Animal.call(this, name); }
            inherit(Animal, Dog);
            const dog = new Dog('Buddy');
            return dog.name === 'Buddy';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: instanceof works correctly',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return inherit;');
            const inherit = testFunction();
            function Animal() {}
            function Dog() {}
            inherit(Animal, Dog);
            const dog = new Dog();
            return dog instanceof Dog && dog instanceof Animal;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 58: WeakMap for Private Data
  {
    id: 'js-hard-058',
    title: 'Private Properties with WeakMap',
    scenario: 'Your user authentication class stores passwords directly as properties, making them visible in console logs and accessible via console.log(user). Anyone with console access can see user.password in plain text! Traditional approaches to hiding properties (using underscore prefixes or closures) are clunky. WeakMap provides true privacy - the password is stored in a separate map tied to the object instance, completely inaccessible from outside the class. The password cannot be accessed via user.password or seen in debuggers.',
    difficulty: 'Hard',
    topic: 'WeakMap, Encapsulation',
    type: 'code',
    instructions: `Create a class called 'SecureUser' that:
1. Uses WeakMap to store private password
2. Has public methods: setPassword(pw), verifyPassword(pw)
3. Password cannot be accessed directly
4. verifyPassword returns true/false

Example:
const user = new SecureUser();
user.setPassword('secret123');
user.verifyPassword('secret123') → true
user.password → undefined`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `const privateData = new WeakMap();

class SecureUser {
  // Write your SecureUser implementation
  
}

// Test your class
const user = new SecureUser();
user.setPassword('test');
console.log(user.verifyPassword('test'));`
    },
    testCases: [
      {
        name: 'Test 1: Sets and verifies password',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return SecureUser;');
            const SecureUser = testFunction();
            const user = new SecureUser();
            user.setPassword('test123');
            return user.verifyPassword('test123') === true;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Rejects wrong password',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return SecureUser;');
            const SecureUser = testFunction();
            const user = new SecureUser();
            user.setPassword('correct');
            return user.verifyPassword('wrong') === false;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Password is private',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return SecureUser;');
            const SecureUser = testFunction();
            const user = new SecureUser();
            user.setPassword('secret');
            return user.password === undefined;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 59: Functional Pipe
  {
    id: 'js-hard-059',
    title: 'Function Pipeline',
    scenario: 'Your data processing code is nested function calls 5 levels deep: multiply(add(subtract(divide(parse(data)))))). Reading inside-out is confusing and error-prone. When you need to add another transformation, you have to find the right nesting level. Functional programming uses pipelines where data flows left-to-right through transformations: pipe(parse, divide, subtract, add, multiply)(data). Each function takes the output of the previous one. Build a pipe function that composes functions this way, making data transformations readable and maintainable.',
    difficulty: 'Hard',
    topic: 'Functional Programming, Composition',
    type: 'code',
    instructions: `Create a function called 'pipe' that:
1. Takes multiple functions as arguments
2. Returns a new function that applies them left-to-right
3. Each function's output becomes the next function's input
4. The final result is returned

Example:
const addOne = x => x + 1;
const double = x => x * 2;
const pipeline = pipe(addOne, double);
pipeline(5) → 12 // (5 + 1) * 2`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function pipe(...functions) {
  // Write your code implementing pipe
  
}

// Test your function
const addOne = x => x + 1;
const double = x => x * 2;
const pipeline = pipe(addOne, double);
console.log(pipeline(5));`
    },
    testCases: [
      {
        name: 'Test 1: Chains two functions',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return pipe;');
            const pipe = testFunction();
            const addOne = x => x + 1;
            const double = x => x * 2;
            const pipeline = pipe(addOne, double);
            return pipeline(5) === 12;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Chains multiple functions',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return pipe;');
            const pipe = testFunction();
            const add2 = x => x + 2;
            const multiply3 = x => x * 3;
            const subtract1 = x => x - 1;
            const pipeline = pipe(add2, multiply3, subtract1);
            return pipeline(5) === 20; // (5 + 2) * 3 - 1 = 20
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Works with single function',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return pipe;');
            const pipe = testFunction();
            const identity = x => x;
            const pipeline = pipe(identity);
            return pipeline(42) === 42;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  },

  // QUESTION 60: Symbol for Unique Properties
  {
    id: 'js-hard-060',
    title: 'Unique Object Properties',
    scenario: 'Your library adds utility methods to objects, but sometimes your property names collide with properties that already exist on those objects. If you add a "refresh" method and the object already has "refresh", you overwrite important functionality. Using symbols as property keys guarantees uniqueness - even if someone else uses a symbol, it\'s a different symbol. Symbols don\'t show up in Object.keys() or JSON.stringify(), making them perfect for internal implementation details that shouldn\'t be accidentally accessed or modified.',
    difficulty: 'Hard',
    topic: 'Symbols, Meta-programming',
    type: 'code',
    instructions: `Create a function called 'createUniqueObject' that:
1. Returns an object with a unique private method using Symbol
2. The method can only be called using the returned symbol key
3. Regular property enumeration doesn't show the symbol
4. Return object format: {obj: {...}, key: Symbol}

Example:
const {obj, key} = createUniqueObject();
obj[key]() → 'secret'
Object.keys(obj) → [] // Symbol not enumerable`,
    starterCode: {
      html: `<div id="output"></div>`,
      js: `function createUniqueObject() {
  // Write your code using Symbols
  
}

// Test your function
const {obj, key} = createUniqueObject();
console.log(obj[key]());`
    },
    testCases: [
      {
        name: 'Test 1: Creates object with symbol property',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return createUniqueObject;');
            const createUniqueObject = testFunction();
            const {obj, key} = createUniqueObject();
            return typeof key === 'symbol' && typeof obj[key] === 'function';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 2: Symbol property not enumerable',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return createUniqueObject;');
            const createUniqueObject = testFunction();
            const {obj} = createUniqueObject();
            return Object.keys(obj).length === 0;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: 'Test 3: Method is callable',
        test: (code) => {
          try {
            const testFunction = new Function(code + '; return createUniqueObject;');
            const createUniqueObject = testFunction();
            const {obj, key} = createUniqueObject();
            const result = obj[key]();
            return typeof result === 'string' && result.length > 0;
          } catch (error) {
            return false;
          }
        }
      }
    ]
  }
];

// Export all questions combined
export const allJSQuestions = [...fundamentalJSQuestions, ...jsQuestions];
