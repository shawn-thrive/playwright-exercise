// Import the test runner, assertion library, and Page type from the Playwright test package
import { test, expect, type Page } from '@playwright/test';

// Define a hook that runs before each test case to set up the initial state
test.beforeEach(async ({ page }) => {
  // Navigate the browser to the TodoMVC demo application URL
  await page.goto('https://demo.playwright.dev/todomvc/#/');
 
});

// Define a constant array containing sample todo items for testing
const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment'
];

// Group a set of tests related to creating "New Todo" items
test.describe('New Todo', () => {
  // Define a test case to verify that multiple todo items can be added
  test('should allow me to add todo items', async ({ page }) => {
    // 1 Create 1st TODO by selecting locator
    await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('buy some cheese');

    // 2 Simulate pressing the Enter key to add the item to the list
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // 3 Assert that the list contains exactly the first todo item by checking the 'todo-title' elements
    await expect(page.getByTestId('todo-title')).toBeVisible();

    // 4 Create 2nd TODO
    await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('feed the cat');

    // 5 Simulate pressing the Enter key to add the second item
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // 6 Assert that the list now contains both the first and second items in the correct order
    await expect(page.getByTestId('todo-title')).toHaveText([
      'buy some cheese',
      'feed the cat'
]);

  });

  // Define a test case to ensure the input field is cleared after an item is added
  test('should clear text input field when an item is added', async ({ page }) => {
    // 7 Fill the input with the first sample item
    await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('buy some cheese');

    // 8 Press Enter to submit the item
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // 9 Assert that the input field is empty after the submission
    await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeEmpty();
  });

  // Define a test case to verify that new items are added to the end of the list
  test('should append new items to the bottom of the list', async ({ page }) => {
    // Call a helper function to create all three default todo items
    await createDefaultTodos(page);

    // 10 Create a locator for the element that displays the remaining item count
     const todoCount = page.getByTestId('todo-count');

    // 11 Assert that the text "3 items left" is visible on the page
    await expect(page.getByText('3 items left')).toBeVisible();

    // 12 Assert that the specific todo count locator has the exact text "3 items left"
    await expect(todoCount).toHaveText('3 items left');

    // 13 Assert that the todo count locator contains the character "3"
    await expect(todoCount).toContainText('3');

    // 14 Assert that the todo count locator matches a regular expression for the number 3
    await expect(todoCount).toHaveText(/3/);

    // 15 Assert that the entire list of 'todo-title' elements matches our TODO_ITEMS array exactly
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS);
  });
});

// Group tests related to the "Mark all as completed" functionality
test.describe('Mark all as completed', () => {
  // Before each test in this group, populate the list with default items
  test.beforeEach(async ({ page }) => {
    // Use the helper function to create the initial list of items
    await createDefaultTodos(page);
  });

  // Define a test case to verify that the 'Mark all' checkbox works
  test('should allow me to mark all items as completed', async ({ page }) => {
    // 16 Locate the toggle-all checkbox by its label and check it. This mean it need to complete all todos
     await page.getByLabel('Mark all as complete').check();

    // 17 Assert that every todo item now has the CSS class 'completed'.
   await expect(page.getByTestId('todo-item')).toHaveClass([
    'completed',
    'completed',
    'completed'
  ]);
  });
});

// Group tests focusing on individual todo item interactions
test.describe('Item', () => {

  // Define a test case for marking items as complete individually
  test('should allow me to mark items as complete', async ({ page }) => {
    // Create a locator for the main input field
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 2 items
    for (const item of TODO_ITEMS.slice(0, 2)) {
      // Fill the input field with the current item
      await newTodo.fill(item);
      // Press Enter to add it
      await newTodo.press('Enter');
    }

    // Locate the first todo item in the list (index 0)
    const firstTodo = page.getByTestId('todo-item').nth(0);
    // Find the checkbox within that first item and check it
    await firstTodo.getByRole('checkbox').check();
    // Assert that the first item now has the 'completed' class
    await expect(firstTodo).toHaveClass('completed');

    // 18 Locate the second todo item in the list (index 1)

    // 19 Assert that the second item does NOT have the 'completed' class yet

    // 20 Find the checkbox within the second item and check it

    // 21 Final assertion that BOTH items now have the 'completed' class
    await expect(firstTodo).toHaveClass('completed');
    // 21 NOTE: The code above just assert the first item
  });

  // Define a test case for un-marking a completed item
  test('should allow me to un-mark items as complete', async ({ page }) => {
    // Create a locator for the main input field
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Add the first two items to the list
    for (const item of TODO_ITEMS.slice(0, 2)) {
      // Fill and enter the current item
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }

    // Define locators for the first and second items
    const firstTodo = page.getByTestId('todo-item').nth(0);
    const secondTodo = page.getByTestId('todo-item').nth(1);
    // Define a locator specifically for the checkbox of the first item
    const firstTodoCheckbox = firstTodo.getByRole('checkbox');

    // Mark the first item as complete
    await firstTodoCheckbox.check();
    // 22 & 23 Verify the first item is completed and the second is not
    // 22
    // 23 

    // Uncheck the checkbox for the first item
    await firstTodoCheckbox.uncheck();
    // Verify that neither item is marked as completed anymore. NOTE: The current code only marks one item
    // 24 

    await expect(secondTodo).not.toHaveClass('completed');
  });

  // Define a test case for editing existing items
  test('should allow me to edit an item', async ({ page }) => {
    // Populate the list with the default items
    await createDefaultTodos(page);

    // Create a locator for all todo items
    const todoItems = page.getByTestId('todo-item');
    // Focus on the second item in the list
    const secondTodo = todoItems.nth(1);
    // Double-click the item to enter editing mode
    await secondTodo.dblclick();
    // 25 Assert that the editing textbox appears and contains the current text

    // 26 Fill the editing textbox with new text

    // 27 Press Enter to save the changes

    // Verify the list contains the original first item, the updated second item, and the original third item
    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2]
    ]);
  });
});

// Group tests for specific editing behaviors
test.describe('Editing', () => {
  // Set up the default state before each test
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
  });

  // Test that controls (like checkboxes) are hidden while editing an item
  test('should hide other controls when editing', async ({ page }) => {
    // Locate the second todo item
    const todoItem = page.getByTestId('todo-item').nth(1);
    // Enter edit mode
    await todoItem.dblclick();
    // 28 Assert that the completion checkbox is no longer visible

    // Assert that the text label is also hidden
    await expect(todoItem.locator('label', {
      hasText: TODO_ITEMS[1],
    })).not.toBeVisible();
  });

  // Test that an item is deleted if its text is cleared during an edit
  test('should remove the item if an empty text string was entered', async ({ page }) => {
    // Create a locator for all items
    const todoItems = page.getByTestId('todo-item');
    // Edit the second item
    await todoItems.nth(1).dblclick();
    // 29 Clear the text entirely

    // Submit the empty value
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');

    // Verify the second item was removed, leaving only the first and third
    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[2],
    ]);
  });
});

// Group tests for the item counter functionality
test.describe('Counter', () => {
  // Test that the counter updates correctly as items are added
  test('should display the current number of todo items', async ({ page }) => {
    // Create a locator for the input field
    const newTodo = page.getByPlaceholder('What needs to be done?');
    // Create a locator for the count display
    const todoCount = page.getByTestId('todo-count')

    // Add the first item
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // 30 Verify counter shows 1 item

    // Add the second item
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');
    // Verify counter now shows 2 items
  });
});

// Group tests for the "Clear completed" button
test.describe('Clear completed button', () => {
  // Set up the default state
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
  });

  // Test that the button is visible only when there are completed items
  test('should display the correct text', async ({ page }) => {
    // 31 Check the toggle checkbox of the first item

    // 32 Assert the "Clear completed" button becomes visible

  });

  // Test that clicking the button removes the completed items
  test('should remove completed items when clicked', async ({ page }) => {
    // 33 Locate all items

    // 34 Mark the second item as complete

    // 35 Click the clear button

    // 36 Assert only 2 items remain

    // 37 Assert the correct items (first and third) remain in the list

  });

  // Test that the button disappears when no completed items are left
  test('should be hidden when there are no items that are completed', async ({ page }) => {
    // 38 Mark an item as complete

    // 39 Click the clear button

    // 40 Assert the button is now hidden
    
  });
});

// Helper function to create the standard set of three todo items
async function createDefaultTodos(page: Page) {
  // Create a locator for the input field
  const newTodo = page.getByPlaceholder('What needs to be done?');

  // Iterate through our global array of strings
  for (const item of TODO_ITEMS) {
    // Fill the input with the current string
    await newTodo.fill(item);
    // Press Enter to add it
    await newTodo.press('Enter');
  }
}
