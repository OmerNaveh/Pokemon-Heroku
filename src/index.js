//elements
const inputById= document.getElementById('inputById');
const searchByIdButton = document.getElementById('searchByIdButton');
const byIdName = document.getElementById('byIdName')
const byIdID = document.getElementById('byIdID')
const byIdHeight = document.getElementById('byIdHeight')
const byIdWeight = document.getElementById('byIdWeight')
const byIdImg = document.getElementById('byIdImg')
const idSearchHeading = document.getElementById('idSearchHeading')
const pokemonDet = document.getElementById('pokemonDet');
const Types = document.getElementById('Types');
const userNameInput = document.getElementById('userNameInput');
const signInBtn = document.getElementById('signInBtn');
const gottaCatchEmSect = document.getElementById('gottaCatchEmSect');
const catchBtn = document.getElementById('catchBtn');
const releaseBtn = document.getElementById('releaseBtn');
const catchreleaseSect = document.getElementById('catchreleaseSect');

let username = undefined;

//main functions
const getPokemonById = async (Id) => {  //fetching data from api
    try {
        const response = await axios.get(`http://localhost:3000/pokemon/get/${Id}`, 
        {headers:{"username": username}});
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
        if(!username){
            errorHandler("username");
        }
        else{
        const data = await getPokemonById(id);
        inputById.value = '' //reset input value
        byIdID.innerText = data.id
        byIdName.innerText ='Name: ' + data.name;
        byIdHeight.innerText ='Height: ' + data.height;
        byIdWeight.innerText = 'Weight: ' + data.weight;
        byIdImg.src= data['front_pic'];
        data.sprites = {'front_pic' : data['front_pic'],'back_pic': data['back_pic']} //adjust to new local api
        byIdImg.addEventListener('mouseover', (e) => changepostion(data.sprites))
        errorHandler(); //reset this label after change in case of an error
        addPokemonTypes(data.types);
        addCatchRelease(data.id)
        deleteDropDown();
        deleteReloadBtn();
        return }
    } catch (error) {
        return
    }
}

//side functions
const changepostion = (data) =>{ //switches between frond and back images
    byIdImg.src = data['back_pic'];
    byIdImg.addEventListener('mouseout' , () =>{
        byIdImg.src= data['front_pic']; })
}
const errorHandler = (error) =>{
    if(error){
        if(error=== "username"){
            idSearchHeading.innerText = 'Must Enter User Name' //in case of an error
            idSearchHeading.style.color = 'red'
            pokemonDet.style.visibility = 'hidden';
        }
        else
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
signInBtn.addEventListener('click',signInSectChange)
catchBtn.addEventListener('click', async (e)=>{
    try {
        const pokeId= byIdID.textContent
        const res= await axios.put(`http://localhost:3000/pokemon/catch/${pokeId}`, 
        {body: {}},{headers:{"username": username}}); 
        showemAll(); 
        clearErrMsg();  
    } catch (error) {
        clearErrMsg();
        const errMsg = btnErrorMsg();
        errMsg.textContent = 'you already have this pokemon'
        catchreleaseSect.append(errMsg)
    }
})
releaseBtn.addEventListener('click',async (e)=>{
    try {
        const pokeId= byIdID.textContent
        await axios.delete(`http://localhost:3000/pokemon/release/${pokeId}`, 
        {headers:{"username": username}},{body: {}});
        showemAll()
        clearErrMsg()
    }catch (error) {
        clearErrMsg()
        const errMsg = btnErrorMsg();
        errMsg.textContent = 'you dont have this pokemon'
        catchreleaseSect.append(errMsg)
    }
})

//sign in functions

function signInSectChange(){
    username = userNameInput.value
    const welcomeLabel = document.createElement('label')
    welcomeLabel.textContent = `welcome ${username}`;
    welcomeLabel.classList.add('welcomeLabel')
    const signOutBtn = document.createElement('button')
    signOutBtn.textContent = 'Sign Out';
    signOutBtn.classList.add('signOutBtn');
    signInBtn.replaceWith(signOutBtn);
    userNameInput.replaceWith(welcomeLabel);
    showemAll();
    //event listener to return changes
    signOutBtn.addEventListener('click', ()=>{
        welcomeLabel.replaceWith(userNameInput);
        userNameInput.value = "";
        username = undefined;
        signOutBtn.replaceWith(signInBtn);
        resetPokeList();
        errorHandler('username')
    })
}
async function showemAll(){
    try {
        resetPokeList();
        const response = await axios.get(`http://localhost:3000/pokemon/`, 
        {headers:{"username": username}});
        const pokeArr = response.data
        for(let pokemon of pokeArr){
            addpokemontosect(pokemon.name)
        }  
    } catch (error) {
       return; 
    }
}

function addpokemontosect(name){
    const pokemon = document.createElement("li");
    pokemon.classList.add('pokeList');
    pokemon.textContent = name;
    gottaCatchEmSect.append(pokemon);
    pokemon.addEventListener('click', (e)=>{changeDomDescById(name)})
}
function resetPokeList(){
    const pokeli = document.getElementsByClassName('pokeList');
    for(let pokemon of pokeli){
        if(pokeli.length>0){
            pokemon.remove();
            resetPokeList(); //recursion because without it the first pokemon always remains
            }  
    }
}

function btnErrorMsg(){
    const label = document.createElement('label');
    label.classList.add('errorMsg');
    return label;
}
function clearErrMsg(){
    const errMsg = document.getElementsByClassName('errorMsg');
    for(let msg of errMsg){
        if(errMsg.length>0){
            msg.remove();
            resetPokeList(); //recursion
            }  
    }
}

