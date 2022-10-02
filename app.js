/****************** Storage Controller ***************** */
const StorageCtrl = (function () {

    // Public methods
    return {
        storeItem: function (item) {
            let items;

            // Check local storage has any item
            if (localStorage.getItem('items') === null) {
                items = [];
                // Push the new item
                items.push(item);
                // Set the local storage with the new item
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // Get items present
                items = JSON.parse(localStorage.getItem('items'));
                // Push the new item
                items.push(item);
                // Set the local storage with the new item added
                localStorage.setItem('items', JSON.stringify(items));

            }
        },
        getItemsFromStorage: function () {
            let items;
            // Check local storage has any item
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },
        updateItemStorage: function (updatedItem) {
            // Get items present
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (updatedItem.id === item.id) {
                    // Remove the item in the list and replace it with the updated item
                    items.splice(index, 1, updatedItem);
                }
            });
            // Set the local storage with the updated item
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function (id) {
            // Get items present
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (id === item.id) {
                    // Remove the item in the list and replace it with the updated item
                    items.splice(index, 1);
                }
            });
            // Set the local storage with the updated item
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function () {
            localStorage.clear();
        }

    }
})();

/**************** Item Controller ********************** */
const ItemCtrl = (function () {
    // item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    // Data Structure / State
    const data = {
        // items: [
        //   // { id: 0, name: 'Steak Dinner', calories: 1200 },
        //   // { id: 1, name: 'Cokies', calories: 600 },
        //   // { id: 2, name: 'Eggs', calories: 300 }
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    };


    return {
        // Public Methods 
        getItems: function () { return data.items; },
        addItem: function (item) {
            // Generate ID and auto increment  
            let ID, calories;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Convert calories datatype into number
            calories = parseInt(item.calories);

            // Create new item
            newItem = new Item(ID, item.name, calories);
            // Push new item into the item array
            data.items.push(newItem);

            return newItem;

        },
        updateItem: function (item) {
            let calories, name;
            // Convert input item to an integer
            calories = parseInt(item.calories);

            name = item.name;

            let found = null;

            // Loop through the list item
            data.items.forEach(function (item) {

                // check if the current item id is equal to that of the item to be updated
                if (item.id === data.currentItem.id) {
                    // Set the new values to current item
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        deleteItem: function (id) {
            // Get the ids
            const ids = data.items.map(function (item) { return item.id });

            // Get the index of item to be deleted
            const index = ids.indexOf(id);

            // remove item
            data.items.splice(index, 1);

        },
        clearAllItems: function () {
            data.items = [];
        },
        getTotalCalories: function () {
            let total = 0;

            // Loops through each item and add their calories
            data.items.forEach(function (item) {
                total += item.calories;
            });

            // Set total calories in the data structure
            data.totalCalories = total;

            return data.totalCalories;
        },
        getItemById: function (id) {
            let found = null;

            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });

            return found;
        },
        getCurrentItem: function () { return data.currentItem },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        logData: function () { return data; }
    }
})();



/***************** UI Controller ********************* */
const UICtrl = (function () {
    // Private properties
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        listItems: '#item-list li',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        clearBtn: '.clear-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    return {
        // Public Methods
        populateItemsList: function (items) {
            let html = ``;

            items.forEach(item => {
                html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: <em>${item.calories} Calories</em></strong>
          <a href="#" class="secondary-content"><i class="edit-item bi bi-pencil"></i></a>
        </li>
        `
            });

            // Insert items to the list item
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function () { return UISelectors; },

        addListItem: function (item) {
            // View list in UI
            UICtrl.listView('block');

            // Create li element
            const li = document.createElement('li');
            // Add class name
            li.className = 'collection-item';
            // Add id
            li.id = `item-${item.id}`;
            // Add html
            li.innerHTML = `
      <strong>${item.name}: <em>${item.calories} Calories</em></strong>
      <a href="#" class="secondary-content"><i class="edit-item bi bi-pencil"></i></a>
      `;

            // Append item to item list in the UI 
            // document.querySelector(UISelectors.itemList).appendChild(li); OR
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

        },
        updateListItem: function (item) {
            // Get all the items (li) from the DOM
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn nodelist into an array
            listItems = Array.from(listItems);

            // console.log(listItems);
            listItems.forEach(function (listItem) {

                // Get the the id attribute
                const itemID = listItem.getAttribute('id');

                // Check if the id is equal to the id of the updated item
                if (itemID === `item-${item.id}`) {
                    // Update the content of the li
                    // console.log('Updateed');
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: <em>${item.calories} Calories</em></strong>
          <a href="#" class="secondary-content"><i class="edit-item bi bi-pencil"></i></a>`;

                }
            });
        },
        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn nodelist into an array
            listItems = Array.from(listItems);

            listItems.forEach(function (item) {
                item.remove();
            });
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            };
        },
        setItemInput: function (item) {
            document.querySelector(UISelectors.itemNameInput).value = item.name;
            document.querySelector(UISelectors.itemCaloriesInput).value = item.calories;
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';

        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        },
        listView: function (display) {
            document.querySelector(UISelectors.itemList).style.display = display;
        },
        addCurrentItemToForm: function () {
            UICtrl.setItemInput(ItemCtrl.getCurrentItem());

        }
    }
})();


/**
 * ****************** App Controller ******************
 */
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {

    /**
     * Take note this is a Module pattern of JavaScript so
     * the values in the return a made public. that's how 
     * the Module patterns works in JavaScript.
     */

    // Load event listeners
    const loadEventListeners = function () {
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit using the enter for adding item
        document.querySelector(UISelectors.addBtn).addEventListener('keypress', function (e) {
            // Disable the enter key (having keyCode of 13) and return a false value
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();

                return false;
            }
        });

        // Edit item event 
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event 
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event 
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Clear  items event 
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

        // Back button event 
        document.querySelector(UISelectors.backBtn).addEventListener('click', function (e) {
            UICtrl.clearEditState();
            e.preventDefault();
        });


    }

    // Event Listener function: itemAddSubmit
    const itemAddSubmit = function (e) {
        // Get form inputs from UI Controller
        const input = UICtrl.getItemInput();

        // Check Inputs validity
        if (input.name !== '' && input.calories !== '') {
            // Add item to data structure
            const newItem = ItemCtrl.addItem(input);

            // Add new item to the UI
            UICtrl.addListItem(newItem);

            // Store item to local storage
            StorageCtrl.storeItem(newItem);

            // Clear form fields
            UICtrl.clearInput();

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);



        }
        else {
            alert('Please fill in the input');
        }
        // console.log(input);

        e.preventDefault();
    }

    // Event Listener function: itemEditClick
    const itemEditClick = function (e) {

        // using event delegation to reach the icon element
        if (e.target.classList.contains('edit-item')) {

            // Get the list current item id (Eg item-0, item-1)
            listId = e.target.parentElement.parentElement.id;

            // Break into an array 
            // listIdArr = Array.from(listId);
            // console.log(listIdArr[listId.length -1]);    OR
            const listIdArr = listId.split('-');

            // Get only the number of the break array
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add current item to form
            UICtrl.addCurrentItemToForm();

            // show edit state in the UI
            UICtrl.showEditState();

        }

        e.preventDefault();
    }

    // Event Listener function: itemUpdateSubmit
    const itemUpdateSubmit = function (e) {
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input);

        // Update the UI with the updated item
        UICtrl.updateListItem(updatedItem);


        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add totol calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update the local storage
        StorageCtrl.updateItemStorage(updatedItem);


        // Clear edit state (will also clear the input since it is embedded to it) 
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Event Listener function: itemDeleteSubmit
    const itemDeleteSubmit = function (e) {

        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete item from the UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add totol calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete item from the local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        // Clear edit state (will also clear the input since it is embedded to it) 
        UICtrl.clearEditState();


        e.preventDefault();
    }

    // Event Listener function: clearAllItemClick
    clearAllItemsClick = function (e) {

        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add totol calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete all items from UI 
        UICtrl.clearItems();

        StorageCtrl.clearItemsFromStorage();

        // Hide list
        UICtrl.listView('none');


        e.preventDefault();
    }


    return {
        // Public Methods 
        init: function () {
            // Initialize app state by calling the clear edit state method
            UICtrl.clearEditState();

            // Get items from Item Controller (Datastructure)
            const items = ItemCtrl.getItems();

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();


            // Checking for items
            if (items.length === 0) {
                UICtrl.listView('none');
            } else {
                // Populating items list to the UI 
                UICtrl.populateItemsList(items);
            }

            // Add totol calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Fetching loadEventListeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();
