'use strict'
/* 
buttonLogout.addEventListener('click', async function () {
    try {
        const apiCall = await fetch('http://localhost:3000/accounts');
        if (!apiCall.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await apiCall.json();
        // Process the response data
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
});
*/




//login screen
const buttonLogin = document.querySelector('.btnLogin');
const buttonLogout = document.querySelector('.btnLogout');

//add transaction screen
const buttonAddTransaction = document.querySelector('#btnAddTransactionOption');
const btnAddTransaction = document.querySelector('.btnAddTransaction');
const buttonSplitOrPersonal = document.querySelectorAll('.btnAddTransOptions');
const buttonBackHome = document.querySelector('.btnBackHome');

//view transaction screen
const buttonViewTransactions = document.querySelector('#btnViewTransactionsOption');

// FUNCTION DECLARATION

// Redirect function
const swapWindows = function (startingWindow, newWindow) {
    const windowToHide = document.querySelector(startingWindow);
    console.log(`Window closed: ${windowToHide.classList}`);
    windowToHide.classList.add('hidden');

    const windowToShow = document.querySelector(newWindow);
    console.log(`Window opened: ${windowToShow.classList}`);
    windowToShow.classList.remove('hidden');
};

// GET function - 1 parameter - URL endpoint (collection name)
const getCollection = async function (collectionName) {
    try {
        const apiCall = await fetch(`http://localhost:3000/${collectionName}`);
        if (!apiCall.ok) {
            throw new Error(`Failed to fetch data from ${collectionName}`);
        }
        const data = await apiCall.json();
        return data;
    } catch (error) {
        console.error('Error', error);
    }
}; // to use above function - must call from async function





// REDIRECT BUTTONS //

// LOG IN button redirect
buttonLogin.addEventListener('click', function () {
    swapWindows('.container_login', '.homeOptions');
});

// LOG OUT button redirect
buttonLogout.addEventListener('click', async function () {
    /* // WIP still need to pick the correct window to close */
    swapWindows('.homeOptions', '.container_login');
});

// ADD TRANSACTION button redirect - including moving through the whole process
buttonAddTransaction.addEventListener('click', async function () {
    let budgetAccountsArray = null;

    try {
        budgetAccountsArray = await getCollection('budgetAccounts');
        console.log(budgetAccountsArray);
    } catch (error) {
        console.error(error);
    }

    budgetAccountsArray.forEach(option => {
        const selectElement = document.getElementById('transAccount');
        const optionElement = document.createElement('option');
        optionElement.textContent = option.name;
        selectElement.appendChild(optionElement);
    })

    swapWindows('.homeOptions', '.optionAddTransaction');
    document.querySelector('.addTransOptions').classList.remove('hidden');

    let splitOrPersonal = '';
    buttonSplitOrPersonal.forEach(button => {
        button.addEventListener('click', function () {
            splitOrPersonal = button.textContent;
            console.log('Button pressed: ' + splitOrPersonal);
            swapWindows('.addTransOptions', '.addTransInfo');
        });
    });

    btnAddTransaction.addEventListener('click', async function () {

        //Getting data from input & dropdown boxes
        const name = document.querySelector('#transName').value;
        const amount = document.querySelector('#transAmount').value;
        const account = document.querySelector('#transAccount').value;

        //Creating object to send through API        
        const transactionData = {
            name: name,
            account: account,
            amount: Number(amount),
            split: Boolean(splitOrPersonal),
            owner: 'Justin',
            preplannedExpense: Boolean('true')
        };

        //POST request to /transactions
        try {
            const apiCall = await fetch('http://localhost:3000/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transactionData)
            });
            if (!apiCall.ok) {
                throw new Error('Error adding transaction - API CALL NOT OK');
            }
            const response = await apiCall.json();
            console.log(response);
        } catch (error) {
            console.error('Error adding transaction - CATCH BLOCK ERROR', error);
            throw error;
        }
        console.log('Button pressed: Add transaction');
        swapWindows('.addTransInfo', '.addTransComplete');
    });

});

buttonBackHome.addEventListener('click', function () {
    swapWindows('.addTransComplete', '.homeOptions');
    document.querySelector('.optionAddTransaction').classList.add('hidden');
});

buttonViewTransactions.addEventListener('click', async function () {

    const transactions = await getCollection('transactions');
    console.log(transactions);


    transactions.forEach(transaction => {

        const viewTransactions = document.querySelector('.viewTransactions');
        const newTransactionContainer = document.createElement('div');
        newTransactionContainer.classList.add('transaction_container');
        viewTransactions.appendChild(newTransactionContainer);

        const nameLabel = document.createElement('label');
        nameLabel.setAttribute('id', 'viewTransNameLabel');
        nameLabel.textContent = transaction.name;
        newTransactionContainer.appendChild(nameLabel);

        const amountLabel = document.createElement('label');
        amountLabel.textContent = transaction.amount;
        newTransactionContainer.appendChild(amountLabel);

        const accountLabel = document.createElement('label');
        accountLabel.textContent = transaction.account;
        newTransactionContainer.appendChild(accountLabel);

        const splitLabel = document.createElement('label');
        splitLabel.textContent = transaction.split;
        newTransactionContainer.appendChild(splitLabel);

        const preplannedExpenseLabel = document.createElement('label');
        preplannedExpenseLabel.textContent = transaction.preplannedExpense;
        newTransactionContainer.appendChild(preplannedExpenseLabel);

    });

    swapWindows('.homeOptions', '.optionViewTransactions');
});
