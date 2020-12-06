//Run once broswer has loaded everything
window.onload = function () {
/* variables to keep track of animations, divs, and scores */
var deckid; 
var dealerscore = 0;
var deal2card = 0;
var playerscore = 0;
var deck = 12;
var playercard = 3;
var dealercard = 3;
var stay = false;
var slide = 5; 
var deal = false; 
var dealeraces = 0; 
var playeraces = 0; 
var def = true; 
var firstcardace = false; 

/* only run startup modal if it is the first time the game has loaded or if game opens in new page */
if (sessionStorage.getItem("startup") === null){
    $('.ui.basic.modal.startup')
    .modal("show");
    deal = true; 
    sessionStorage.setItem("startup", "true");
}

startup();


/* function to start the game, deals cards to the dealer with animations */
function startup() {
    /* retrieve deck of cards from the api */
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2")
    .then(response => response.json())
    .then(data => {
        deckid = data.deck_id;
    });
    /* function to run if there was a startup modal */
    if (deal){
        document.getElementById("start")
        .addEventListener("click",function(e){
        /* deal to dealer with card slide animation */
        const d = document.getElementById("deck16");
        d.style.animation = "slide 1s ease-in-out 0s backwards";
        d.addEventListener("animationend", () => {
            fetch("https://deckofcardsapi.com/api/deck/" + deckid + "/draw/?count=1")
            .then(response => response.json())
            .then(data => { 
                /* set url for the card face png as the back of the card*/
                var url = data.cards[0].image;
                /* reset flip animation */
                document.getElementById("dcardb1").classList.remove("flipper");
                void document.getElementById("dcardb1").offsetWidth;
                document.getElementById("dcardb1").classList.add("flipper");
                document.getElementById("dcardb1").style.backgroundImage = ("url("+ url +")");
                document.getElementById("dcardb1").style.visibility = "visible";
                /* add value of the first card to the dealer's score */
                dealerscore += getValDealer(data.cards[0].value);
                if (dealerscore == 11){
                    firstcardace = true; 
                }
                const e = document.getElementById("deck15");
                e.style.animation = "slide2 1s ease-in-out 1s forwards";
                e.addEventListener("animationend", () =>{
                    fetch("https://deckofcardsapi.com/api/deck/" + deckid + "/draw/?count=1")
                    .then(response => response.json())
                    .then(data => { 
                        var url = data.cards[0].image;
                        /* set the background image and get the value for the dealer's 2nd card, but don't display it yet */
                        document.getElementById("dcardb2").style.backgroundImage = ("url("+ url +")");
                        deal2card += getValDealer(data.cards[0].value);
                        playerStart();
                    })
                }, false)
            });
        }, false)
        },false);
    }
    /* function to run if there was no startup modal, gets the game started right away */
    /* same as if statement, but without eventlistener for the click */
    else {
        const d = document.getElementById("deck16");
        d.style.animation = "slide 1s ease-in-out 0s backwards";
        d.addEventListener("animationend", () => {
            fetch("https://deckofcardsapi.com/api/deck/" + deckid + "/draw/?count=1")
            .then(response => response.json())
            .then(data => { 
                var url = data.cards[0].image;
                document.getElementById("dcardb1").classList.remove("flipper");
                void document.getElementById("dcardb1").offsetWidth;
                document.getElementById("dcardb1").classList.add("flipper");
                document.getElementById("dcardb1").style.backgroundImage = ("url("+ url +")");
                document.getElementById("dcardb1").style.visibility = "visible";
                dealerscore += getValDealer(data.cards[0].value);
                if (dealerscore == 11){
                    firstcardace = true; 
                }
                const e = document.getElementById("deck15");
                e.style.animation = "slide2 1s ease-in-out 1s forwards";
                e.addEventListener("animationend", () =>{
                    fetch("https://deckofcardsapi.com/api/deck/" + deckid + "/draw/?count=1")
                    .then(response => response.json())
                    .then(data => { 
                        var url = data.cards[0].image;
                        document.getElementById("dcardb2").style.backgroundImage = ("url("+ url +")");
                        deal2card += getValDealer(data.cards[0].value);
                        playerStart();
                    })
                }, false)
            });
        }, false);
    }
}

/* function to deal the player their first two cards with animations */
function playerStart(){
    const d = document.getElementById("deck14");
    d.style.animation = "slide3 1s ease-in-out 0s backwards";
    d.addEventListener("animationend", () => {
        fetch("https://deckofcardsapi.com/api/deck/" + deckid + "/draw/?count=1")
        .then(response => response.json())
        .then(data => { 
            var url = data.cards[0].image;
            document.getElementById("pcardb1").classList.remove("flipper");
            void document.getElementById("pcardb1").offsetWidth;
            document.getElementById("pcardb1").classList.add("flipper");
            document.getElementById("pcardb1").style.backgroundImage = ("url("+ url +")");
            document.getElementById("pcard1").style.visibility = "visible";
            playerscore += getValPlayer(data.cards[0].value);
            const e = document.getElementById("deck13");
            e.style.animation = "slide4 1s ease-in-out 1s backwards";
            e.addEventListener("animationend", () =>{
                fetch("https://deckofcardsapi.com/api/deck/" + deckid + "/draw/?count=1")
                .then(response => response.json())
                .then(data => { 
                    var url = data.cards[0].image;
                    document.getElementById("pcardb2").classList.remove("flipper");
                    void document.getElementById("pcardb2").offsetWidth;
                    document.getElementById("pcardb2").classList.add("flipper");
                    document.getElementById("pcardb2").style.backgroundImage = ("url("+ url +")");
                    document.getElementById("pcard2").style.visibility = "visible";
                    playerscore += getValPlayer(data.cards[0].value);
                    /* create a delay since the flip takes a little longer */
                    setTimeout(function(){
                        document.getElementById("dnum").innerHTML = dealerscore;
                        document.getElementById("pnum").innerHTML = playerscore;
                    },1000);
                    
                    playerGamePlay();
                })
            }, false)
        });
    }, false)
}

/* get the value of a given card for the dealer, Aces are dynamic and are given different values */
function getValDealer(cardval){
    if (cardval == "KING" || cardval == "QUEEN" || cardval == "JACK"){
        return 10; 
    }
    else if (cardval == "ACE"){
        if ((dealerscore + 11) > 16 && (dealerscore + 11) <= 21){
            return 11; 
        }
        else if ((dealerscore + 11) > 21){
            return 1; 
        }
        else{
            ++dealeraces;
            return 11; 
        }   
    }
    else {
        return parseInt(cardval);
    }
}

/* get the value of a given card for the player, Aces are dynamic and are given different values */
function getValPlayer(cardval){
    if (cardval == "KING" || cardval == "QUEEN" || cardval == "JACK"){
        return 10; 
    }
    else if (cardval == "ACE"){   
        if ((playerscore + 11) > 21){
            return 1; 
        }
        else{
            ++playeraces;
            return 11; 
        }
    }
    else {
        return parseInt(cardval);
    }
}

/* function run to begin the game for the player after being dealt two cards */
function playerGamePlay(){
    /* if the playerscore is already 21 after the dealt cards, show the dealer's second card and display the end modal */
    if (playerscore == 21)
    {
        document.getElementById("deck15").style.visibility = "hidden";
        document.getElementById("dcardb2").classList.remove("flipper");
        void document.getElementById("dcardb2").offsetWidth;
        document.getElementById("dcardb2").classList.add("flipper");
        document.getElementById("dcard2").style.visibility = "visible";
        document.getElementById("dnum").innerHTML = dealerscore;
        document.getElementById("hit").disabled = true; 
        document.getElementById("stay").disabled = true;
        setTimeout(function(){  
            displayend("player");}, 2000);
    }
    /* set an event listener for when the stay button is pressed */
    document.getElementById("stay")
    .addEventListener("click",function(e){
        stay = true; 
        /* disable both buttons so that there is no unexpected behavior */
        document.getElementById("hit").disabled = true; 
        document.getElementById("stay").disabled = true; 
        /* go to the dealer's gameplay next */
        setTimeout(function(){
            dealerGamePlay();
        }, 1000);
        
     }, false);
     /* set event listener for when the hit button is clicked */
     document.getElementById("hit")
    .addEventListener("click",function(e){
        dealCard(); 
     }, false);
}

/* function for dealing cards to the player with the hit button is clicked */
function dealCard(){
    /* get the updated deck div */
    var d_id = "deck" + deck;
    const d = document.getElementById(d_id);
    --deck;
    /* get the specified slide animation number for the deck id*/
    var style_id = "slide" + slide;
    ++slide;
    d.style.animation = style_id + " 1s ease-in-out 0s backwards";
    d.addEventListener("animationend", () => {
        /* fetch the card and then display with a slide and a flip */
        fetch("https://deckofcardsapi.com/api/deck/" + deckid + "/draw/?count=1")
        .then(response => response.json())
        .then(data => { 
            var url = data.cards[0].image;
            var pcb = "pcardb" + playercard;
            var pc = "pcard" + playercard;
            playercard++;
            document.getElementById(pcb).classList.remove("flipper");
            void document.getElementById(pcb).offsetWidth;
            document.getElementById(pcb).classList.add("flipper");
            document.getElementById(pcb).style.backgroundImage = ("url("+ url +")");
            document.getElementById(pc).style.visibility = "visible";
            playerscore += getValPlayer(data.cards[0].value);
            /* see if any of the aces change the score as 11's can become 1's */
            checkAcesPlayer(); 
            /* display the playerscore */
            setTimeout(function(){
                document.getElementById("pnum").innerHTML = playerscore;
            },1000);
            /* statement to enter if player busts, displays the dealer's second card and displays end modal */
            if (playerscore > 21) {
                dealerscore += deal2card;
                document.getElementById("deck15").style.visibility = "hidden";
                document.getElementById("dcardb2").classList.remove("flipper");
                void document.getElementById("dcardb2").offsetWidth;
                document.getElementById("dcardb2").classList.add("flipper");
                document.getElementById("dcard2").style.visibility = "visible";
                document.getElementById("dnum").innerHTML = dealerscore;
                document.getElementById("hit").disabled = true; 
                document.getElementById("stay").disabled = true;
                setTimeout(function(){  
                    displayend("dealer");}, 2000);
            }
            /* statement to enter if player gets blackjack, displays the dealer's second card and displays end modal */
            else if (playerscore == 21) {
                dealerscore += deal2card;
                document.getElementById("deck15").style.visibility = "hidden";
                document.getElementById("dcardb2").classList.remove("flipper");
                void document.getElementById("dcardb2").offsetWidth;
                document.getElementById("dcardb2").classList.add("flipper");
                document.getElementById("dcard2").style.visibility = "visible";
                document.getElementById("dnum").innerHTML = dealerscore;
                document.getElementById("hit").disabled = true; 
                document.getElementById("stay").disabled = true;
                setTimeout(function(){  
                    displayend("player");}, 2000);
            }             
        });
    }, false)
}

/* because aces are dynamic (can be either 1 or 11 depending on other cards), 
this function is called to adjust the player's score after each card played */
function checkAcesPlayer() {
    if (playerscore > 21){
        if (playeraces == 1){
            playerscore = playerscore - 11; 
            playerscore += 1; 
            playeraces = 0; 
        }
    }
}

/* because aces are dynamic (can be either 1 or 11 depending on other cards), 
this function is called to adjust the dealers's score after each card played */
function checkAcesDealer(){
    if (dealeraces && ((deal2card + 11) == 21)){
        dealerscore = 21; 
    }
    else if (dealerscore > 16 && dealerscore != 21){
        if (dealeraces){
            dealerscore = dealerscore - 11; 
            dealerscore += 1; 
            dealeraces = 0; 
        }
    }
}

/* function to check if the first card was an ace and adjust score off of that as dealer must take the 11
if over 16 */
function adjustiface(){
    if (dealerscore > 17){
        dealeraces = 0;
    }
}


/* function for when the stay button is clicked and the player did not bust or get blackjack */
function dealerGamePlay(){
    def = false;
    dealerscore += deal2card;
    if (firstcardace){
        adjustiface();
    }
    checkAcesDealer(); 
    /* statement to enter if the dealer has blackjack, displays the second card and goes to the end modal */
    if (dealerscore == 21){
        document.getElementById("deck15").style.visibility = "hidden";
        document.getElementById("dcardb2").classList.remove("flipper");
        void document.getElementById("dcardb2").offsetWidth;
        document.getElementById("dcardb2").classList.add("flipper");
        document.getElementById("dcard2").style.visibility = "visible";
        document.getElementById("dnum").innerHTML = dealerscore;
        document.getElementById("hit").disabled = true; 
        document.getElementById("stay").disabled = true;
        setTimeout(function(){  
            displayend("dealer");}, 2000);
    }
    /* statement to enter if the dealer has more than 16 points, displays the second card and determines winner */
    else if (dealerscore >= 17){
        document.getElementById("deck15").style.visibility = "hidden";
        document.getElementById("dcardb2").classList.remove("flipper");
        void document.getElementById("dcardb2").offsetWidth;
        document.getElementById("dcardb2").classList.add("flipper");
        document.getElementById("dcard2").style.visibility = "visible";
        document.getElementById("dnum").innerHTML = dealerscore;
        determineWinner();
    }
    /* statement to enter if dealer does not have blackjack or does not have more than 16 points, 
    deals cards to the dealer until they get at least 17 points or blackjack */
    else {
        document.getElementById("deck15").style.visibility = "hidden";
        document.getElementById("dcardb2").classList.remove("flipper");
        void document.getElementById("dcardb2").offsetWidth;
        document.getElementById("dcardb2").classList.add("flipper");
        document.getElementById("dcard2").style.visibility = "visible";
        document.getElementById("dnum").innerHTML = dealerscore;
        slide = 11; 
        setTimeout(function(){
            dealCardDealer();
        }, 1000);
    }
}

/* deals cards to the dealer with animations and flips */
function dealCardDealer(){
    var d_id = "deck" + deck;
    const d = document.getElementById(d_id);
    --deck;
    var style_id = "slide" + slide;
    ++slide;
    d.style.animation = style_id + " 1s ease-in-out 0s backwards";
    d.addEventListener("animationend", () => {
        fetch("https://deckofcardsapi.com/api/deck/" + deckid + "/draw/?count=1")
        .then(response => response.json())
        .then(data => { 
            var url = data.cards[0].image;
            var dcb = "dcardb" + dealercard;
            var dc = "dcard" + dealercard;
            dealercard++;
            document.getElementById(dcb).classList.remove("flipper");
            void document.getElementById(dcb).offsetWidth;
            document.getElementById(dcb).classList.add("flipper");
            document.getElementById(dcb).style.backgroundImage = ("url("+ url +")");
            document.getElementById(dc).style.visibility = "visible";
            dealerscore += getValDealer(data.cards[0].value);
            checkAcesDealer();
            setTimeout(function(){
                document.getElementById("dnum").innerHTML = dealerscore;
            },1000);
            /* if the score is less than 17, deal another card */
            if (dealerscore < 17){
                dealCardDealer();
            }
            /* if dealer busts, show end modal */
            else if (dealerscore > 21) {
                document.getElementById("hit").disabled = true; 
                document.getElementById("stay").disabled = true;
                setTimeout(function(){  
                    displayend("player");}, 2000);
            }
            /* if dealer gets blackjack, display end modal */
            else if (dealerscore == 21) {
                document.getElementById("hit").disabled = true; 
                document.getElementById("stay").disabled = true;
                setTimeout(function(){  
                    displayend("dealer");}, 2000);
            }
            /* if dealer has more than 17 but less than 21, determine who won */
            else {
                determineWinner();
            }           
        });
    }, false)
}
/* determine the winner based on the dealer's score and the player's score and then send them to the correct modal */
function determineWinner() {
    if (playerscore == dealerscore)
    {
        document.getElementById("hit").disabled = true; 
        document.getElementById("stay").disabled = true;
        setTimeout(function(){  
            displayend("tie");}, 2000);
    }
    else if (playerscore > dealerscore)
    {
        document.getElementById("hit").disabled = true; 
        document.getElementById("stay").disabled = true;
        setTimeout(function(){  
            displayend("player");}, 2000);
    }
    else{
        document.getElementById("hit").disabled = true; 
        document.getElementById("stay").disabled = true;
        setTimeout(function(){  
            displayend("dealer");}, 2000);
    }
}

/* modals to display depending on the winner, reloads the DOM without refreshing the page */
function displayend(ending){
    if (ending == "dealer"){
        $('.ui.basic.modal.dealerwon')
        .modal("show");
        document.getElementById("dealerstart")
        .addEventListener("click",function(e){
            location.reload();
        }, false);
    }
    else if (ending == "player"){
        $('.ui.basic.modal.playerwon')
        .modal("show");
        document.getElementById("playerstart")
        .addEventListener("click",function(e){
            location.reload();
        }, false);
    }
    else{
        $('.ui.basic.modal.tie')
        .modal("show");
        document.getElementById("tiestart")
        .addEventListener("click",function(e){
            location.reload();
        }, false);
    }
}

};

