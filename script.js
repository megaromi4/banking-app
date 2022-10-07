"use strict";
const account1 = {
  userName: "Дмитрий Николаев",
  transactions: [500, 250, -300],
  transactionsDate: [
    "2021-11-13T11:48:50.942Z",
    "2021-12-13T18:48:50.942Z",
    "2022-12-13T21:48:50.942Z",
  ],
  pin: 1111,
};

const account2 = {
  userName: "Анна Смирнова",
  transactions: [500, 250, -300],
  transactionsDate: [
    "2021-11-13T11:48:50.942Z",
    "2021-12-13T18:48:50.942Z",
    "2022-12-13T21:48:50.942Z",
  ],
  pin: 2222,
};

const accounts = [account1, account2];
let currentAccount;

const form = document.forms.registration__form;
const transactionContainer = document.querySelector(".bank__history");
const balans = document.querySelector(".bank__balans");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.elements.registration__name.value;
  const password = +form.elements.registration__password.value;

  currentAccount = accounts.find((item) => item.userName === name);

  if (currentAccount) {
    if (currentAccount.pin === password) {
      form.elements.registration__name.value = "";
      form.elements.registration__password.value = "";
      document.querySelector(".registration").style.display = "none";
      document.querySelector(".bank").style.display = "block";
      document.querySelector(
        ".head"
      ).innerHTML = `Добро пожаловать <b>${currentAccount.userName}</b>!`;
      document.querySelector(
        ".info__date"
      ).innerHTML = `${new Date().toLocaleString()}`;
      displayTransaction();
      displayTotal();
    } else {
      alert("Не верный пароль");
      form.elements.registration__password.value = "";
    }
  } else {
    alert("Нет аккаунта");
  }
});

function displayTransaction() {
  currentAccount.transactions.forEach((item, ind) => {
    const date = new Date(
      currentAccount.transactionsDate[ind]
    ).toLocaleDateString();
    const type = item > 0 ? "deposit" : "widthdrawl";
    transactionContainer.innerHTML += `
        <div class="transaction__row">
            <div class="typeDate">
                <div class="transaction__date">${date}</div>
                <div class="transaction__type-${type}">${type}</div>
                <div class="transaction__value"><b>${item}</b></div>
            </div>
        </div>
        `;
  });
}

function displayTotal() {
  const total = currentAccount.transactions.reduce((a, b) => a + b);
  currentAccount.total = total;
  balans.innerHTML = `${total}$`;
  const deposit = currentAccount.transactions
    .filter((i) => i > 0)
    .reduce((a, b) => a + b);
  let widthdrawl = currentAccount.transactions.filter((i) => i < 0);
  if (widthdrawl.length > 0) {
    widthdrawl = widthdrawl.reduce((a, b) => a + b);
  }
  document.querySelector(".summary__num-plus").innerHTML = `${deposit}$`;
  document.querySelector(".summary__num-minus").innerHTML = Array.isArray(
    widthdrawl
  )
    ? "0$"
    : `${widthdrawl}$`;
}

function makeTransaction() {
  const recipient = document.querySelector("#trasfer__recipient").value;
  const sum = document.querySelector("#trasfer__sum").value;
  if (
    accounts.find((item) => item.userName === recipient) &&
    recipient !== currentAccount.userName &&
    sum <= currentAccount.total
  ) {
    currentAccount.transactions.push(-sum);
    currentAccount.transactionsDate.push(new Date().toISOString());
    transactionContainer.innerHTML += `
        <div class="transaction__row">
            <div class="typeDate">
                <div class="transaction__date">${new Date(
                  currentAccount.transactionsDate[
                    currentAccount.transactionsDate.length - 1
                  ]
                ).toLocaleDateString()}</div>
                <div class="transaction__type-widthdrawl">widthdrawl</div>
                <div class="transaction__value"><b>${-sum}</b></div>
            </div>
        </div>
        `;
    displayTotal();
  } else {
    alert("Пользователь не найден");
  }
}

document.querySelector("#transfer-btn").addEventListener("click", (e) => {
  e.preventDefault();
  makeTransaction();
});

document.querySelector("#loan-btn").addEventListener("click", (e) => {
  e.preventDefault();
  const sum = +document.querySelector("#loan__sum").value;
  if (currentAccount.transactions.some((i) => i >= sum * 0.1)) {
    currentAccount.transactions.push(sum);
    currentAccount.transactionsDate.push(new Date().toISOString());
    transactionContainer.innerHTML += `
        <div class="transaction__row">
            <div class="typeDate">
                <div class="transaction__date">${new Date(
                  currentAccount.transactionsDate[
                    currentAccount.transactionsDate.length - 1
                  ]
                ).toLocaleDateString()}</div>
                <div class="transaction__type-deposit">deposit</div>
                <div class="transaction__value"><b>${sum}</b></div>
            </div>
        </div>
        `;
    displayTotal();
    document.querySelector("#loan__sum").value = "";
  } else {
    alert("Займ отклонен");
    document.querySelector("#loan__sum").value = "";
  }
});

document.querySelector("#close-btn").addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.querySelector("#close__name").value;
  const pin = +document.querySelector("#close__password").value;
  if (name === currentAccount.userName && pin === currentAccount.pin) {
    const ind = accounts.findIndex((i) => i.userName === name);
    accounts.splice(ind, 1);
    document.querySelector(".registration").style.display = "block";
    document.querySelector(".bank").style.display = "none";
    console.log(accounts);
  } else {
    alert("Неверные данные");
  }
});
