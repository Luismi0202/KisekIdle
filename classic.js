const charactersList = [];
let charactersWithLetter = [];

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
            const newChara = document.createElement("div");
            
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

        }
    }
});
