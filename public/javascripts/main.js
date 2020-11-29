/*
 * This files holds all the code to for your card game
 */

//Run once broswer has loaded everything
window.onload = function () {
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

if (sessionStorage.getItem("startup") === null){
    $('.ui.basic.modal.startup')
    .modal("show");
    deal = true; 
    sessionStorage.setItem("startup", "true");
}

startup();

function startup() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2")
    .then(response => response.json())
    .then(data => {
        deckid = data.deck_id;
    });
    if (deal){
        document.getElementById("start")
        .addEventListener("click",function(e){
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
        }, false)
        },false);
    }
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
                    document.getElementById("dnum").innerHTML = dealerscore;
                    document.getElementById("pnum").innerHTML = playerscore;
                    playerGamePlay();
                })
            }, false)
        });
    }, false)
}

function getValDealer(cardval){
    if (cardval == "KING" || cardval == "QUEEN" || cardval == "JACK"){
        return 10; 
    }
    else if (cardval == "ACE"){
        if (def){
        ++dealeraces;
            if ((dealerscore + 11) >= 17){
                return 11; 
            }
            else {
                return 1; 
            }
        }
        else {
            if ((dealerscore + 11) > 21){
                return 1; 
            }
            else{
                ++dealeraces;
                return 11; 
            }   
        }
    }
    else {
        return parseInt(cardval);
    }
}

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

function playerGamePlay(){
    if (playerscore == 21)
    {
        document.getElementById("dnum").innerHTML = dealerscore;
        document.getElementById("hit").disabled = true; 
        document.getElementById("stay").disabled = true;
        setTimeout(function(){  
            displayend("player");}, 2000);
    }
    document.getElementById("stay")
    .addEventListener("click",function(e){
        stay = true; 
        document.getElementById("hit").disabled = true; 
        document.getElementById("stay").disabled = true; 
        dealerGamePlay();
     }, false);
     document.getElementById("hit")
    .addEventListener("click",function(e){
        dealCard(); 
     }, false);
}

function dealCard(){
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
            var pcb = "pcardb" + playercard;
            var pc = "pcard" + playercard;
            playercard++;
            document.getElementById(pcb).classList.remove("flipper");
            void document.getElementById(pcb).offsetWidth;
            document.getElementById(pcb).classList.add("flipper");
            document.getElementById(pcb).style.backgroundImage = ("url("+ url +")");
            document.getElementById(pc).style.visibility = "visible";
            playerscore += getValPlayer(data.cards[0].value);
            checkAcesPlayer(); 
            document.getElementById("pnum").innerHTML = playerscore;
            if (playerscore > 21) {
                dealerscore += deal2card;
                document.getElementById("deck15").style.visibility = "hidden";
                document.getElementById("dcard2").style.visibility = "visible";
                document.getElementById("dnum").innerHTML = dealerscore;
                document.getElementById("hit").disabled = true; 
                document.getElementById("stay").disabled = true;
                setTimeout(function(){  
                    displayend("dealer");}, 2000);
            }
            else if (playerscore == 21) {
                dealerscore += deal2card;
                document.getElementById("deck15").style.visibility = "hidden";
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

function checkAcesPlayer() {
    if (playerscore > 21){
        if (playeraces == 1){
            playerscore = playerscore - 11; 
            playerscore += 1; 
            playeraces = 0; 
        }
    }
}

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

function dealerGamePlay(){
    def = false;
    dealerscore += deal2card;
    checkAcesDealer(); 
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
    else if (dealerscore >= 17){
        document.getElementById("deck15").style.visibility = "hidden";
        document.getElementById("dcardb2").classList.remove("flipper");
        void document.getElementById("dcardb2").offsetWidth;
        document.getElementById("dcardb2").classList.add("flipper");
        document.getElementById("dcard2").style.visibility = "visible";
        document.getElementById("dnum").innerHTML = dealerscore;
        determineWinner();
    }
    else {
        document.getElementById("deck15").style.visibility = "hidden";
        document.getElementById("dcardb2").classList.remove("flipper");
        void document.getElementById("dcardb2").offsetWidth;
        document.getElementById("dcardb2").classList.add("flipper");
        document.getElementById("dcard2").style.visibility = "visible";
        document.getElementById("dnum").innerHTML = dealerscore;
        slide = 11; 
        dealCardDealer();
    }
}

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
            document.getElementById("dnum").innerHTML = dealerscore;
            if (dealerscore < 17){
                dealCardDealer();
            }
            else if (dealerscore > 21) {
                document.getElementById("hit").disabled = true; 
                document.getElementById("stay").disabled = true;
                setTimeout(function(){  
                    displayend("player");}, 2000);
            } 
            else if (dealerscore == 21) {
                document.getElementById("hit").disabled = true; 
                document.getElementById("stay").disabled = true;
                setTimeout(function(){  
                    displayend("dealer");}, 2000);
            }
            else {
                determineWinner();
            }           
        });
    }, false)
}

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

