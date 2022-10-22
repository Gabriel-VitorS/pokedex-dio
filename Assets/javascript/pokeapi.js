const listPokemon = document.querySelector('#pokemon-list')
const btnBackPage = document.querySelector('#btnBackPage')
const btnNextPage = document.querySelector('#btnNextPage')
const selectType = document.querySelector('#selectTypes')
const btnSearch = document.querySelector('#btnSearchPokemon')
const inputSearch = document.querySelector('#inputSearch')
const removeSearch = document.querySelector('#basic-addon1')
const toastElList = document.querySelectorAll('.toast')[0]
const bsAlert = new bootstrap.Toast(toastElList, {delay: 5000})

let url = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=12'
let nextPage, backPage = ''

async function getListPokemon(link){
    load('show')
    listPokemon.innerHTML = ''

    removeSearch.classList.add('d-none')
    btnBackPage.classList.add('d-none')
    btnNextPage.classList.add('d-none')

    const data = await fetch(link).then( data => data.json() ).catch( err => console.log(err))

    if(data === undefined ) return

    data.previous === null ? btnBackPage.disabled = true : btnBackPage.disabled = false
    data.next === null ? btnNextPage.disabled = true : btnNextPage.disabled = false

    backPage = data.previous
    nextPage = data.next
    data.isListAll = true
    buildList(data)
    
}

async function buildList(data){
    let pokemons = ''
    listPokemon.innerHTML = ''

    if(data.hasOwnProperty('results')){
        
        for(let index in data.results){
            const detail = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.results[index].name}`).then( data => data.json() )
            
            if(detail.sprites.other['official-artwork'].front_default !== null){
                pokemons += `
                <div class="pokemon-cards d-flex flex-column justify-content-center align-items-center normal-color">
                    <div> <h5>${data.results[index].name[0].toUpperCase() + data.results[index].name.substring(1)}</h5></div> 

                    <div>
                        <img class="pokemon-image-list" src="${detail.sprites.other['official-artwork'].front_default}"  alt="">
                    </div>
                    <div class="div-circle ${detail.types[0].type.name}"> </div>
                </div>
                `
            }
        }
    }else{
        if(data.sprites.other['official-artwork'].front_default !== null){
            pokemons += `
            <div class="pokemon-cards d-flex flex-column justify-content-center align-items-center normal-color">
                <div> <h5>${data.name[0].toUpperCase() + data.name.substring(1)}</h5></div> 

                <div>
                    <img class="pokemon-image-list" src="${data.sprites.other['official-artwork'].front_default}"  alt="">
                </div>
                <div class="div-circle ${data.types[0].type.name}"> </div>
            </div>
            `
            btnBackPage.classList.add('d-none')
            btnNextPage.classList.add('d-none')
            removeSearch.classList.remove('d-none')
        }

    }

    if(data.isListAll){
        btnBackPage.classList.remove('d-none')
        btnNextPage.classList.remove('d-none')
    }
    
    listPokemon.innerHTML = pokemons
    load()
}

btnBackPage.addEventListener('click', ()=>{
    getListPokemon(backPage)
})

btnNextPage.addEventListener('click', ()=>{
    getListPokemon(nextPage)
})

selectType.addEventListener('change', async function (e){
    removeSearch.classList.add('d-none')
    pokemonList = new Object
    pokemonList.results = []
    pokemonList.isListAll = false

    if(e.target.value !== ''){
        const data = await fetch(`https://pokeapi.co/api/v2/type/${e.target.value}/`).then( data => data.json() ).catch( err => console.log(err))

        if(data === undefined ) return

        btnBackPage.classList.add('d-none')
        btnNextPage.classList.add('d-none')

        data.pokemon.map((value, index)=>{
            pokemonList.results.push(value.pokemon)
        })
        load('show')
        buildList(pokemonList)
    }else{
        getListPokemon(url)
    }
})

async function searchPokemon(pokemon){
    listPokemon.innerHTML = ''
    btnBackPage.classList.add('d-none')
    btnNextPage.classList.add('d-none')
    load('show')

    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
    .then( data => data.json())
    .catch( err => console.log(err))

    if(data === undefined){
        getListPokemon(url)
        bsAlert.show()
        return
    }

    data.isListAll = false
    buildList(data)
    
}

btnSearch.addEventListener('click', ()=>{ searchPokemon(inputSearch.value.toLowerCase()) })

inputSearch.addEventListener('keydown', (e)=>{ 
    if(e.keyCode === 13)
        searchPokemon(inputSearch.value.toLowerCase())
})

removeSearch.addEventListener('click', ()=>{ getListPokemon(url); inputSearch.value = ''})

function load(display){
    const loader = document.querySelector('#loader')
    if(display === 'show')
        loader.classList.remove('d-none')
    else
        loader.classList.add('d-none')
}

getListPokemon(url)