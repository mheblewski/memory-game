const cards = [
    {
        name: "one",
        img: "url(images/one.png)"
    },
    {
        name: "two",
        img: "url(images/two.png)"
    },
    {
        name: "three",
        img: "url(images/three.png)"
    },
    {
        name: "four",
        img: "url(images/four.png)"
    },
    {
        name: "five",
        img: "url(images/five.png)"
    },
    {
        name: "six",
        img: "url(images/six.png)"
    },
    {
        name: "seven",
        img: "url(images/seven.png)"
    },
    {
        name: "eight",
        img: "url(images/eight.png)"
    }
];

const backgroundImg = "url(images/back.png)";
let showedCards = [];
let canRun = true;
let turns = 0;
let matchCounter = 0;
let seconds = 0, minutes = 0;
let timerTimeout;

startGame = () => {
    resetTurns();
    startTimer();
    const cardsToShow = makeCardsArray();
    showCards(cardsToShow);
}

makeCardsArray = () => {
    return shuffle(cards.concat(cards));
}

showCards = (cardsToShow) =>{
    const grid = document.getElementById('grid');
    grid.className = "grid-shadow";
    cleanUpGrid(grid);
    cardsToShow.forEach((card, index) => {
        const cardDiv = makeCardDiv(card, index);
        grid.appendChild(cardDiv);
    });
}

makeCardDiv = (card, cardNumber) => {
    const cardDiv = document.createElement('div');
    cardDiv.dataset.name = card.name;
    cardDiv.dataset.cardNumber = cardNumber;
    cardDiv.className = "card";
    cardDiv.addEventListener("click", cardClicked.bind(this, cardDiv));
    const cardFront = makeFrontOfCard(card);
    const cardBack = makeBackOfCard(card);
    cardDiv.appendChild(cardFront);
    cardDiv.appendChild(cardBack);
    return cardDiv;
}

makeFrontOfCard = (card) => {
    const frontOfCard = document.createElement("div");
    frontOfCard.className = "front";
    frontOfCard.style.background = card.img;
    return frontOfCard;
}

makeBackOfCard = (card) => {
    const backOfCard = document.createElement("div");
    backOfCard.className = "back";
    backOfCard.style.background = backgroundImg;
    return backOfCard;
}

resetTurns = () => {
    turns = 0;
    const turnsDiv = document.getElementById("turns");
    turnsDiv.innerHTML = "Turns: " + turns;
}

shuffle = (cards) => {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
}

cardClicked = (card) => {
    const sameCard = showedCards.length > 0 ? showedCards[0].dataset.cardNumber === card.dataset.cardNumber : false;
    if(!canRun || sameCard){
        return;
    }
    if(showedCards.length < 2){
        showedCards[showedCards.length] = card;
        turnFront(card);
    }
    if(showedCards.length === 1){
        return;
    }
    canRun = false;
    incrementTurns();
    setTimeout(finishTurn, 1000);
}

incrementTurns = () => {
    turns++;
    const turnsDiv = document.getElementById("turns");
    turnsDiv.innerHTML = "Turns: " + turns;
}

finishTurn = () => {
    const [firstCard, secondCard] = showedCards;
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    if(isMatch){
        destroyCards(showedCards);
        matchCounter++;
    } else {
        turnBackCards(showedCards);
    }
    prepareNewTurn();
    if(matchCounter === cards.length){
        finishGame();
    }
}

finishGame = () => {
    stopTimer();
}

prepareNewTurn = () => {
    showedCards = [];
    canRun = true;
}

destroyCards = (cards) => {
    cards.forEach((card) => {
        card.removeEventListener("click", cardClicked);
        card.style.opacity = 0;
    });
}

turnBackCards = (cards) => {
    cards.forEach((card) => turnBack(card));
}

turnBack = (card) => {
    card.style.transform = "rotateY(0)";
}

turnFront = (card) => {
    card.style.transform = "rotateY(-180deg)";
}

cleanUpGrid = (grid) => {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
}

startTimer = () => {
    let timer = document.getElementById("timer");
    clearTimer(timer);
    triggerTimer(timer);
}

triggerTimer = (timer) => {
    timerTimeout = setTimeout(nextSecond.bind(this, timer), 1000);
}

nextSecond = (timer) => {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    
    timer.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    triggerTimer(timer);
}

clearTimer = (timer) => {
    clearTimeout(timerTimeout);
    timer.innerHTML = "00:00";
    seconds = 0;
    minutes = 0;
}

stopTimer = () => {
    clearTimeout(timerTimeout);
}