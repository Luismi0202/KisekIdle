const charactersList = [];

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
        })
    })
})
.catch(error => {
    console.error("Error fetching characters:", error);
});

document.getElementById("searchInput").addEventListener("input", function() {
    const searchTerm = this.value.toLowerCase();
    

});