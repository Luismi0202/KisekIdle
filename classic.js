const charactersList = [];
let charactersWithLetter = [];
let clickedCharacters = [];
let todayCharacter = null;
let guessed = false;
let tries = 0;
let todayDate = new Date();
const squares = ["🟥","🟨","🟩"]
const numbers = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];
let triesList = [];
loadGameState();

//READING THE JSON
fetch("./characters.json")
.then(response => response.json())
.then(data => { 
    data.forEach(character => {
        charactersList.push({
            name: character.NAME,
            gender: character.GENDER,
            affiliation: character.AFFILIATION,
            occupation: character.OCCUPATION,
            playable: character["PLAYABLE?"],
            birthPlace: character.BIRTH_PLACE,
            firstGame: character.FIRST_GAME_APPEARANCE,
            alias: character.ALIAS,
            image: character.IMAGE
        });
    });
    selectDailyCharacter();
})
.catch(error => {
    console.error("Error fetching characters:", error);
});

function searchByAlias(searchedAlias, character) {
    if (!character.alias) return null;
    const aliases = character.alias.split(",").map(a => a.trim());
    for (const alias of aliases) {
        if (alias.toUpperCase().startsWith(searchedAlias.toUpperCase())) {
            return alias;
        }
    }
    return null;
}

//INPUT FIELD SEARCH
document.getElementById("searchInput").addEventListener("input", function() {
    const searchTerm = this.value.trim().toUpperCase();

    charactersWithLetter = []; //IT WILL ALWAYS BE EMPTY AT THE BEGGINING

    const foundCharacters = document.getElementById("foundChara");
    foundCharacters.innerHTML = "";
    
    if (searchTerm !== "") {
        for (const character of charactersList) {
            if (clickedCharacters.includes(character)) continue; //SKIP IF ALREADY CLICKED
            const nameAndSurname = character.name.split(" ");
            const name = nameAndSurname[0]; 
            const surname = nameAndSurname[1] || ""; //THE SURNAME CAN BE EMPTY IF I DON'T PUT THE SURNAME ON THE CSV

            if (name.toUpperCase().startsWith(searchTerm) || surname.toUpperCase().startsWith(searchTerm)) {
                charactersWithLetter.push({character,matchedAlias: null}); 
            }
            else{
                const matchedAlias = searchByAlias(searchTerm,character);
                if(matchedAlias !== null){
                    charactersWithLetter.push({character,matchedAlias})
                }
            }
        }
    }

    if(charactersWithLetter.length != 0){
        
        for (const item of charactersWithLetter) {
            const character = item.character;
            const newChara = document.createElement("button");
            
            const name = document.createElement("div");
            name.classList.add("charaName");
            name.textContent = character.name;

            const image = document.createElement("img");
            image.classList.add("charaImg");
            image.src = character.image;

            newChara.appendChild(name);
            newChara.appendChild(image);

            if(item.matchedAlias != null){
                const alias = document.createElement("div");
                alias.classList.add("charaAlias");
                alias.textContent = item.matchedAlias;
                newChara.appendChild(alias);
            }

            foundCharacters.appendChild(newChara);
            newChara.classList.add("foundChara");
            
            newChara.addEventListener("click", function() {
                selectCharacter(character);
                clickedCharacters.push(character);
            });
        }
    }
});

function selectDailyCharacter(){
    if (charactersList.length === 0) return null;

    const today = new Date();
    const dateString = today.toISOString().slice(0, 10);

    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = (hash * 31 + dateString.charCodeAt(i)) % charactersList.length;
    }

    todayCharacter = charactersList[hash];
}

function selectCharacter(character){
    tries++;
    let resultTable = document.getElementById("results");

    if (resultTable.rows.length === 0) {
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const headers = [
            "Character",
            "Gender",
            "Affiliations",
            "Occupation",
            "Playable",
            "Birth Place",
            "First Game Appearance"
        ];
        headers.forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            th.classList.add("resultHeader");
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        resultTable.appendChild(thead);
    }

    let correctAudio = null;
    let currentTry = ""
    let genderCorrect = "correct";
    let affiliationCorrect = "correct";
    let occupationCorrect = "correct";
    let playableCorrect = "correct";
    let birthPlaceCorrect = "correct";
    let firstGameCorrect = "correct";

    if(character !== todayCharacter){
        if (character.gender !== todayCharacter.gender) {
            genderCorrect = "incorrect";
            currentTry += `${squares[0]} `;
        }
        else{
            currentTry += `${squares[2]} `;
        }
        const selectedAffiliations = (character.affiliation || "").split("|").map(a => a.trim());
        const todayAffiliations = (todayCharacter.affiliation || "").split("|").map(a => a.trim());
        const hasPartialAffiliation = selectedAffiliations.some(aff => todayAffiliations.includes(aff));

        if (character.affiliation === todayCharacter.affiliation) {
            currentTry += `${squares[2]} `;
        } else if (hasPartialAffiliation) {
            affiliationCorrect = "semicorrect";
            currentTry += `${squares[1]} `;
        } else {
            affiliationCorrect = "incorrect";
            currentTry += `${squares[0]} `;
        }

        if(character.occupation !== todayCharacter.occupation){
            occupationCorrect = "incorrect";
            currentTry += `${squares[0]} `;
        }
        else{
            currentTry += `${squares[2]} `;
        }

        if(character.playable !== todayCharacter.playable){
            playableCorrect = "incorrect";
            currentTry += `${squares[0]} `;
        }
        else{
            currentTry += `${squares[2]} `;
        }
        
        if(character.birthPlace !== todayCharacter.birthPlace){
            birthPlaceCorrect = "incorrect";
            currentTry += `${squares[0]} `;
        }
        else{
            currentTry += `${squares[2]} `;
        }
        
        if(character.firstGame !== todayCharacter.firstGame){
            firstGameCorrect = "incorrect";
            currentTry += `${squares[0]} `;
        }
        else{
            currentTry += `${squares[2]} `;
        }
        triesList.push(currentTry);
    }
    else{
        triesList.push("🟩 🟩 🟩 🟩 🟩 🟩")
        correctAudio = new Audio("./sounds/DINDONG.mp3");
        guessed = true;
        document.getElementById("victory").innerHTML = `
        <h2>Congratulations! You guessed the character!</h2>
        <img src="${character.image}" alt="${character.name}" class="victoryImage">
        <p>You guessed: ${character.name}</p>
        <p>Number of tries: ${tries}</p>
        <p>Come back tomorrow!</p>`;
        document.getElementById("searchInput").style.display = "none";
        document.getElementById("foundChara").style.display = "none";
        makeShareDiv();
    }

    const tr = document.createElement("tr");
    tr.classList.add("resultRow");
    const tdData = [
        {cls: "", html: `<img src="${character.image}" alt="${character.name}" class="charResultImage">`},
        {cls: genderCorrect, txt: `${character.gender}`},
        {cls: affiliationCorrect, txt: `${character.affiliation ? character.affiliation.split("|").join(", ") : "None"}`},
        {cls: occupationCorrect, txt: `${character.occupation}`},
        {cls: playableCorrect, txt: `${character.playable}`},
        {cls: birthPlaceCorrect, txt: `${character.birthPlace}`},
        {cls: firstGameCorrect, txt: `${character.firstGame}`},
    ];

    let tbody = resultTable.querySelector("tbody");
    if (!tbody) {
        tbody = document.createElement("tbody");
        resultTable.appendChild(tbody);
    }
    tbody.insertBefore(tr,tbody.firstChild);

    tdData.forEach((data, i) => {
            const td = document.createElement("td");
            td.classList.add("fadeInTd");
            td.style.animationDelay = `${i * 0.15}s`;
            if (data.cls) td.classList.add(data.cls);
            if (data.html) {
                td.innerHTML = data.html;
            } else {
                td.textContent = data.txt;
            }
            tr.appendChild(td);
            saveGameState();
    });

    correctAudio?.play();

    document.getElementById("foundChara").innerHTML = "";
    document.getElementById("searchInput").value = "";
}


function saveGameState() {
    localStorage.setItem("resultsTable", document.getElementById("results").innerHTML);
    localStorage.setItem("victoryDiv", document.getElementById("victory").innerHTML);
    localStorage.setItem("shareDiv", document.getElementById("share").innerHTML);
    localStorage.setItem("guessed", guessed ? "1" : "0");
    localStorage.setItem("todayDate", todayDate);
    localStorage.setItem("triesList", JSON.stringify(triesList));
}

function isToday(date){
    return date.getFullYear() === todayDate.getFullYear() &&
           date.getMonth() === todayDate.getMonth() &&
           date.getDate() === todayDate.getDate();
}

function loadGameState() {
    const savedDate = localStorage.getItem("todayDate");
    if(isToday(new Date(savedDate))){
        const results = localStorage.getItem("resultsTable");
        const victory = localStorage.getItem("victoryDiv");
        const share = localStorage.getItem("shareDiv");
        const wasGuessed = localStorage.getItem("guessed") === "1";
        if (results) document.getElementById("results").innerHTML = results;
        if (victory) document.getElementById("victory").innerHTML = victory;
        if (share) document.getElementById("share").innerHTML = share;
        if (wasGuessed) {
            guessed = true;
            document.getElementById("searchInput").style.display = "none";
            document.getElementById("foundChara").style.display = "none";
        }
    }
}

function makeShareDiv(){
    const shareDiv = document.getElementById("share");
    const shareText1 = `I guessed today's trails/kiseki character on KisekIdle in ${tries} tries!`;
    const shareText2 = `Here's my tries:`
    const shareText3 = `${lastTries()}`

    const clipboardButton = document.createElement("button");
    clipboardButton.textContent = "Copy";
    clipboardButton.classList.add("clipboardButton");
    clipboardButton.addEventListener("click", function() {
        const shareText = `${shareText1}\n${shareText2}\n${shareText3}`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert("Copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
    });

    const shareButton = document.createElement("button");
    shareButton.textContent = "Share";
    shareButton.classList.add("shareButton");
    shareButton.addEventListener("click", function() {
    const shareText = `${shareText1}\n${shareText2}\n${shareText3}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, "_blank"); 
    });

    shareDiv.innerHTML = `
    <h2 id="shareHeader">Share your results!</h2>
    <div id= "shareText">
    <p>${shareText1}</p>
    <p>${shareText2}</p>
    <pre>${shareText3}</pre>
    </div>
    `;
    shareDiv.appendChild(clipboardButton);
    shareDiv.appendChild(shareButton);

}

function lastTries(){
    if(triesList.length <=5){
        return triesList.join("\n");
    }
    else{
        let listString = triesList.slice(0,5).join("\n");
        listString += `\n and ${numbersToEmoji(triesList.length - 5)} more...`;
        return listString;
    }
}

function numbersToEmoji(number) {
    let numbStr = number.toString();
    let result = "";

    for(let char of numbStr) {
        let digit = parseInt(char);
        result += numbers[digit];
    }
    return result;
}