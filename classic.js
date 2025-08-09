const charactersList = [];
let charactersWithLetter = [];
let clickedCharacters = [];
let todayCharacter = null;

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
            playable: character.PLAYABLE,
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
    let resultTable = document.getElementById("results");
    let nameCorrect = "correct"
    let genderCorrect = "correct"
    let affiliationCorrect = "correct";
    let occupationCorrect = "correct"
    let playableCorrect = "correct";
    let birthPlaceCorrect = "correct";
    let firstGameCorrect = "correct";
    
    if (character.name !== todayCharacter.name) {
        nameCorrect = "incorrect";
    }
    
    if (character.gender !== todayCharacter.gender) {
        genderCorrect = "incorrect";
    }
    //PARA  LA AFILIACIÓN TODAVÍA NO LA PONGO PORQUE HAY MÁS DE UNA Y ESO TENGO QUE COMPROBAR TODAS
    if(character.occupation !== todayCharacter.occupation){
        occupationCorrect = "incorrect";
    }
    if(character.playable !== todayCharacter.playable){
        playableCorrect = "incorrect";
    }
    if(character.birthPlace !== todayCharacter.birthPlace){
        birthPlaceCorrect = "incorrect";
    }
    if(character.firstGame !== todayCharacter.firstGame){
        firstGameCorrect = "incorrect";
    }

    resultTable.innerHTML = `<tr>
    <td class = "${nameCorrect}">Name: ${character.name}</td>
    <td class = "${genderCorrect}">Gender: ${character.gender}</td>
    <td class = "${affiliationCorrect}">Affiliation: ${character.affiliation}</td>
    <td class = "${occupationCorrect}">Occupation: ${character.occupation}</td>
    <td class = "${playableCorrect}">Playable: ${character.playable}</td>
    <td class = "${birthPlaceCorrect}">Birth Place: ${character.birthPlace}</td>
    <td class = "${firstGameCorrect}">First Game Appearance: ${character.firstGame}</td>
    <td><img src="${character.image}" alt="${character.name}" class = "charResultImage"></td>
    </tr>`;
}

//HACER QUE SE PONGA AMARILLA LAS AFILIACIONES EN CASO DE QUE COINCIDA CON ALGUNA O EN ROJO
//HACER QUE SE VAYAM AÑADIENDO LOS PERSONAJES EN LOS RESULTADOS