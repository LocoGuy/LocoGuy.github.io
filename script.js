let coins = [];

function initCoins() {
  coins = [];
  coins.push({
    name: "LINK",
    api: "chainlink",
    amount: 15,
    imgUrl:
      "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  });

  coins.push({
    name: "EWT",
    api: "energy-web-token",
    amount: 36,
    imgUrl:
      "https://www.energyweb.org/wp-content/uploads/2022/11/cropped-ew-favicon-192x192.png",
  });

  coins.push({
    name: "XRP",
    api: "ripple",
    amount: 300,
    imgUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
  });

  coins.push({
    name: "DOT",
    api: "polkadot",
    amount: 15,
    imgUrl:
      "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
  });

  coins.push({
    name: "ETH",
    api: "ethereum",
    amount: 0.053,
    imgUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  });
}

function initCards() {
  const coinsDiv = document.getElementById("card-group");
  coinsDiv.innerHTML = "";

  coins.forEach((coinData) => {
    const childDiv = createCoinCard(coinData);
    coinsDiv.appendChild(childDiv);
  });
}

function createCoinCard(coinData) {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card coin-card mb-3 text-center";

  const img = document.createElement("img");
  img.src = coinData.imgUrl;
  img.className = "card-img-top mx-auto coinImage mt-3";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const cardTitle = document.createElement("h5");
  cardTitle.className = "card-title";
  cardTitle.innerText = coinData.name;

  const cardAmount = document.createElement("p");
  cardAmount.className = "card-text";
  cardAmount.innerText = coinData.amount;

  const cardPrice = document.createElement("p");
  cardPrice.className = "card-footer";
  cardPrice.innerText = "-";
  cardPrice.id = `coinPrice-${coinData.api}`;

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardAmount);

  cardDiv.appendChild(img);
  cardDiv.appendChild(cardBody);
  cardDiv.appendChild(cardPrice);

  return cardDiv;
}

function SetProfitLine(textToAppend, intValue) {
  var profitElement = document.getElementById("profitElement");
  var currentText = profitElement.innerText;
  profitElement.innerText = currentText + textToAppend;
  profitElement.style.color = "green";

  if (intValue < 0) profitElement.style.color = "red";
}

function ClearParaCoinPrices() {
  document.getElementById("paraCoinPrices").innerText = "";
  document.getElementById("profitElement").innerText = "";
}

async function CallApiUrlAndGetJson(apiUrl) {
  //console.log(apiUrl);
  let response = await fetch(apiUrl);
  if (response.ok) {
    let json = await response.json();
    return json;
  } else {
    alert("HTTP-Error: " + response.status);
  }
  return "";
}

function GetPrice2(json, coinInfo, currency) {
  var coinPrice = json[coinInfo][currency];
  return coinPrice;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

async function GetCryptoInfos() {
  var refreshButton = document.getElementById("refreshIcon");
  refreshButton.classList.add("fa-spin");

  await sleep(1234);

  var currencies = ["chf"];

  var selectedCoins = coins.map((coin) => {
    return coin.api;
  });
  //console.log("selectedCoins", selectedCoins);

  var apiCoins = selectedCoins.join("%2C");
  //console.log("apiCoins", apiCoins);
  var apiCurrencies = currencies.join("%2C");
  var apiUrl =
    "https://api.coingecko.com/api/v3/simple/price?ids=" +
    apiCoins +
    "&vs_currencies=" +
    apiCurrencies;

  //console.log("apiUrl", apiUrl);

  var jsonData = await CallApiUrlAndGetJson(apiUrl);
  //console.log("jsonData", jsonData);

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  var totalPrice = 0;

  selectedCoins.forEach((coinElement) => {
    var coinPriceValue = GetPrice2(jsonData, coinElement, "chf");
    //console.log("coinPriceValue", coinPriceValue);

    var coinPriceElement = document.getElementById(`coinPrice-${coinElement}`);
    //console.log("coinPriceElement", coinPriceElement);

    const coinAmount = coins.find((c) => c.api === coinElement)?.amount;
    //console.log("coinAmount", coinAmount);

    var coinValueCalc = coinAmount * coinPriceValue;
    var coinValueCalc2 = parseFloat(coinValueCalc).toFixed(2);
    coinPriceElement.innerText = "CHF " + coinValueCalc2;
    totalPrice += coinValueCalc;
  });

  ClearParaCoinPrices();
  var sumValue = parseFloat(totalPrice).toFixed(2);
  const totalPriceElement = document.getElementById("paraCoinPrices");
  totalPriceElement.innerText = "CHF " + sumValue;

  var investment = 1950;
  var percentageValue = (sumValue / investment) * 100 - 100;
  SetProfitLine(parseFloat(percentageValue).toFixed(2) + " %", percentageValue);

  refreshButton.classList.remove("fa-spin");
}

async function RunMainScript() {
  initCoins();
  initCards();
  //console.log(coins);
  await GetCryptoInfos();
}
