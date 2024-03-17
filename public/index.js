'use strict'

//login screen
const containerLogin = document.querySelector('.container_login');
const inputLogin = document.querySelectorAll('.container_login input');
const buttonLogin = document.querySelector('.btnLogin');
const buttonLogout = document.querySelector('.btnLogout');
//Options screen
const containerOptions = document.querySelector('.homeOptions');
const optionsAddTransBtn = document.querySelector('#btnAddTransactionOption');
const optionsViewTransBtn = document.querySelector('#btnViewTransactionsOption');
const optionsViewBalancesBtn = document.querySelector('#btnViewBalances');

//Globalish
const buttonBack = document.querySelectorAll('.btnBack');
//add transaction screen
const containerAddTransaction = document.querySelector('.optionAddTransaction');
const containerAddTransOptions = document.querySelector('.addTransOptions');
const buttonSplitOrPersonal = document.querySelectorAll('.btnAddTransOptions');
const containerAddTransInfo = document.querySelector('.addTransInfo');
const addTransInputName = document.querySelector('#transName');
const addTransInputAmount = document.querySelector('#transAmount');
const addTransInputAccount = document.querySelector('#transAccount');
const btnAddTransaction = document.querySelector('.btnAddTransaction');
const containerAddTransComplete = document.querySelector('.addTransComplete');
//view transaction screen
const containerViewTransOutline = document.querySelector('.optionViewTransactions');
const containerForTransactionData = document.querySelector('.viewTransactions');
//view account balances screen
const containerViewBalances = document.querySelector('.optionViewBalances');
const containerForAccountData = document.querySelector('.viewBalances');

// FUNCTION DECLARATION

//MY REEEEAALYY COOL FUNCTION TO REDIRECT to overcome SPAGHETTI navigation
const clearWindows = function (windowToBeLeftOpen) {

    const containerDivs = [
        containerLogin,
        containerOptions,
        containerAddTransaction,
        containerAddTransOptions,
        containerAddTransInfo,
        containerAddTransComplete,
        containerViewTransOutline,
        containerViewBalances
    ]

    containerDivs.forEach(div => {
        if ((!div.classList.contains('hidden')) && (!div.classList.contains(windowToBeLeftOpen))) {
            div.classList.add('hidden');
        }
        if (div.classList.contains(windowToBeLeftOpen)) {
            div.classList.remove('hidden');
        }
    });

    // Dropdown for selecting account during add trans
    while (addTransInputAccount.firstChild) {
        addTransInputAccount.removeChild(addTransInputAccount.firstChild);
    }
    // Container for viewing transactions
    while (containerForTransactionData.firstChild) {
        containerForTransactionData.removeChild(containerForTransactionData.firstChild);
    }
    //Container for viewing budget accounts
    while (containerForAccountData.firstChild) {
        containerForAccountData.removeChild(containerForAccountData.firstChild);
    }

    const inputElements = [
        addTransInputAmount,
        addTransInputName
    ];

    inputElements.forEach(element => {
        element.value = '';
    });
};

// Redirect function  -- the old and trusty 
const swapWindows = function (startingWindow, newWindow) {
    const windowToHide = document.querySelector(startingWindow);
    console.log(`Window closed: ${windowToHide.classList}`);
    windowToHide.classList.add('hidden');

    const windowToShow = document.querySelector(newWindow);
    console.log(`Window opened: ${windowToShow.classList}`);
    windowToShow.classList.remove('hidden');
}

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
//Global back button redirect
buttonBack.forEach(button => {
    button.addEventListener('click', function () {
        clearWindows('homeOptions');
    });
});
// LOG IN button redirect
buttonLogin.addEventListener('click', function () {
    clearWindows('homeOptions');
});
// LOG OUT button redirect
buttonLogout.addEventListener('click', function () {
    clearWindows('container_login');
});
// ADD TRANSACTION button redirect - including moving through the whole process
optionsAddTransBtn.addEventListener('click', async function () {

    clearWindows('optionAddTransaction');
    containerAddTransOptions.classList.remove('hidden');

    let budgetAccountsArray = null;

    try {
        budgetAccountsArray = await getCollection('budgetAccounts');
    } catch (error) {
        console.error(error);
    }

    //Populating dropdown box with 'options' which are all documents in budgetAccounts collection
    budgetAccountsArray.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.textContent = option.name;
        addTransInputAccount.appendChild(optionElement);
    })
    //Defaulting select box to not have text
    addTransInputAccount.selectedIndex = -1;

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
        const name = addTransInputName.value;
        const amount = addTransInputAmount.value;
        const account = addTransInputAccount.value;

        //Creating object to send through API        
        const transactionData = {
            name: name,
            account: account,
            amount: Number(amount),
            split: splitOrPersonal === 'Split' ? true : false,
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

optionsViewTransBtn.addEventListener('click', async function () {

    clearWindows('optionViewTransactions');

    const transactions = await getCollection('transactions');

    transactions.forEach(transaction => {

        const newAccountData = document.createElement('div');
        newAccountData.classList.add('transaction_container');
        containerForTransactionData.appendChild(newAccountData);

        const nameLabel = document.createElement('label');
        nameLabel.setAttribute('id', 'viewTransNameLabel');
        nameLabel.textContent = transaction.name;
        newAccountData.appendChild(nameLabel);

        const amountLabel = document.createElement('label');
        amountLabel.textContent = transaction.amount;
        newAccountData.appendChild(amountLabel);

        const accountLabel = document.createElement('label');
        accountLabel.textContent = transaction.account;
        newAccountData.appendChild(accountLabel);

        const splitLabel = document.createElement('label');
        splitLabel.textContent = transaction.split;
        newAccountData.appendChild(splitLabel);

        const preplannedExpenseLabel = document.createElement('label');
        preplannedExpenseLabel.textContent = transaction.preplannedExpense;
        newAccountData.appendChild(preplannedExpenseLabel);

    });
});

optionsViewBalancesBtn.addEventListener('click', async function () {

    clearWindows('optionViewBalances');

    const budgetAccounts = await getCollection('budgetAccounts');

    budgetAccounts.forEach(account => {

        const newAccountData = document.createElement('div');
        newAccountData.classList.add('budgetAccounts_container');
        containerForAccountData.appendChild(newAccountData);

        const nameLabel = document.createElement('label');
        nameLabel.textContent = account.name;
        nameLabel.classList.add('buttonForBudgetLabels');
        newAccountData.appendChild(nameLabel);

        const amountLabel = document.createElement('label');
        amountLabel.textContent = account.amount;
        amountLabel.classList.add('buttonForBudgetLabels');
        newAccountData.appendChild(amountLabel);

    });
});