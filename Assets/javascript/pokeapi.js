const listPokemon = document.querySelector('#pokemon-list')
const btnBackPage = document.querySelector('#btnBackPage')
const btnNextPage = document.querySelector('#btnNextPage')

let url = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=12'
let nextPage, backPage = ''

async function getListPokemon(link){
    let pokemons = ''
    listPokemon.innerHTML = ''

    const data = await fetch(link).then( data => data.json() ).catch( err => console.log(err))

    if(data === undefined ) return

    data.previous === null ? btnBackPage.disabled = true : btnBackPage.disabled = false
    data.next === null ? btnNextPage.disabled = true : btnNextPage.disabled = false

    backPage = data.previous
    nextPage = data.next

    for(let index in data.results){
        const detail = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.results[index].name}`).then( data => data.json() )

        pokemons += `
        <div class="pokemon-cards d-flex flex-column justify-content-center align-items-center normal-color">
            <div> <h5>${data.results[index].name[0].toUpperCase() + data.results[index].name.substring(1)}</h5></div> 

            <div>
                <img class="pokemon-image-list" src="${detail.sprites.other.dream_world.front_default}"  alt="">
            </div>
            <div class="div-circle ${detail.types[0].type.name}"> </div>
        </div>
        `
    }
    
    listPokemon.innerHTML = pokemons

    
}

btnBackPage.addEventListener('click', ()=>{
    getListPokemon(backPage)
})

btnNextPage.addEventListener('click', ()=>{
    getListPokemon(nextPage)
})

getListPokemon(url)