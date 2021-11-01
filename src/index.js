//elements
const inputById= document.getElementById('inputById');
const searchByIdButton = document.getElementById('searchByIdButton');
const byIdName = document.getElementById('byIdName')
const byIdHeight = document.getElementById('byIdHeight')
const byIdWeight = document.getElementById('byIdWeight')
const byIdImg = document.getElementById('byIdImg')
const idSearchHeading = document.getElementById('idSearchHeading')
const pokemonDet = document.getElementById('pokemonDet');
const Types = document.getElementById('Types') 


//main functions
const getPokemonById = async (Id) => {  //fetching data from api
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${Id}`);
        if(response.data.name ===undefined){ //in case someone doesnt enter a value
            throw('error') 
        }
        else{
            return response.data;
        }
    } catch (error) {
        errorHandler(error);
        return
    }
}

const changeDomDescById = async (id) =>{ //changing the Dom
    try {
        const data = await getPokemonById(id);
        inputById.value = '' //reset input value
        byIdName.innerText ='Name: ' + data.name;
        byIdHeight.innerText ='Height: ' + data.height;
        byIdWeight.innerText = 'Weight: ' + data.weight;
        byIdImg.src= data.sprites['front_default'];
        byIdImg.addEventListener('mouseover', (e) => changepostion(data.sprites))
        errorHandler(); //reset this label after change in case of an error
        addPokemonTypes(data.types);
        deleteDropDown();
        deleteReloadBtn();
        return 
    } catch (error) {
        return
    }
}

//side functions
const changepostion = (data) =>{ //switches between frond and back images
    byIdImg.src = data['back_default'];
    byIdImg.addEventListener('mouseout' , () =>{
        byIdImg.src= data['front_default']; })
}
const errorHandler = (error) =>{
    if(error){
        idSearchHeading.innerText = 'This Pokemon does not exist in Pokedex' //in case of an error
        idSearchHeading.style.color = 'red'
        pokemonDet.style.visibility = 'hidden';
    }
    else{
        idSearchHeading.innerText = 'Pokemon Info:' //reset this label after change in case of an error
        idSearchHeading.style.color = 'black';
        pokemonDet.style.visibility = 'visible'
    }
}

const addPokemonTypes = (typesArr) =>{ //creates buttons according to pokemon types
    deleteExistingTypes(); //delete already created typed to avoid duplication
    for(let type of typesArr){
        const button = document.createElement('button');
        button.innerText= type.type.name;
        button.classList.add('pokeTypes', 'btn');
        button.addEventListener('click', ()=>{showAllPokemonByType(type.type.name)})
        Types.append(button);
    }
}

const deleteExistingTypes = () =>{ //reset the Dom buttons after change
    const buttons = document.getElementsByClassName('pokeTypes');
    for(let button of buttons){
        if(buttons.length>0){
        button.remove()
        deleteExistingTypes(); //recursion because without it the first type always remains
        }
    }
}

const showAllPokemonByType = async (type) => { //changes Dom according to api Data to how all pokemon by type
    const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
    const allPokemonsRec = response.data.pokemon;
    deleteDropDown();
    const selectElem = createDropDown();
    firstDeafaultOption(selectElem);
    for(let pokeName of allPokemonsRec ){
        createOption(pokeName.pokemon.name, selectElem);
    }
    selectElem.addEventListener('change', reloadtoNewPokemonOption) //creates reloadPokedex btn on change of selection
}
const createOption = (pokeName , parentElem) =>{ //creates option elements
    const optionElem =document.createElement('option');
    optionElem.value = pokeName;
    optionElem.textContent = pokeName;
    parentElem.append(optionElem);
}
const firstDeafaultOption = (parentElem)=>{ //creates first disabled option so all pokemon will be available for selection
    const optionElem =document.createElement('option');
    optionElem.disabled ='true';
    optionElem.selected = 'true';
    optionElem.textContent = 'Select Pokemon';
    parentElem.append(optionElem);
}
const createDropDown = () =>{ //creates the select element
    const drpDownTypes = document.createElement('select');
    drpDownTypes.id= 'pokemonNames';
    pokemonDet.append(drpDownTypes);
    return drpDownTypes;
}

const deleteDropDown = () =>{
    try {
        const elem = document.getElementById('pokemonNames');
        elem.remove();
    } catch (error) {
        return
    }
}

const reloadtoNewPokemonOption = () =>{ //creates button to research by new selected pokemon
    try {
        deleteReloadBtn(); //delete existing button if there is one
        const selectedPokemon= document.getElementById('pokemonNames').value
        const newPokemonBtn = document.createElement('button');
        newPokemonBtn.id = 'newPokemonBtn';
        newPokemonBtn.classList.add('btn', 'btn-outline-success', 'reloadBtn')
        pokemonDet.append(newPokemonBtn);
        newPokemonBtn.textContent = `Find ${selectedPokemon}`;
        newPokemonBtn.addEventListener('click', ()=> {changeDomDescById(selectedPokemon)})
    } catch (error) {
        return
    }
}
const deleteReloadBtn = () =>{
    try {
        const btn= document.getElementById('newPokemonBtn')
        btn.remove();
    } catch (error) {
        return
    }
}
//general event listeners
searchByIdButton.addEventListener('click',(e)=> changeDomDescById(inputById.value))
