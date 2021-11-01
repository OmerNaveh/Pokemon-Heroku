const fs = require('fs')
const express = require('express');
const router = express.Router();
router.use(express.json())
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex()

router.get('/test', (req, res) => {
    req.headers.username = 'test'
    res.send(req.headers)
})

router.get('/get/:id', async (request, response, next) => {
    try {
        const {id} = request.params
        const pokemonInfo = await getPokemonInfo(id)
        response.send(pokemonInfo)
    } catch (error){
        error = {'massage': "404"}
        next(error)
    }
})
// router.get('/', async (request, response, next) => {
//     try {
//         const pokemonInfo = await getPokemonInfo(request.body.name)
//         response.send(pokemonInfo)
//     } catch (error) {
//         next(error)
//     }
// })

async function getPokemonInfo(id){
    const result = await P.getPokemonByName(id)
    return {
        'id' : result.id,
        'name': result.name, 
        'height':result.height, 
        'weight':result.weight, 
        'types':result.types, 
        'abilities':result.abilities,
        'front_pic':result.sprites['front_default'],
        'back_pic': result.sprites['back_default']
    }
}

router.put('/catch/:id', async (request, response, next) => {
    try {
        const {id} = request.params
        const username = request.headers.username
        const pokemonObj = await getPokemonInfo(id)
        if (fs.existsSync(`./users/${username}`)) {
            if (fs.existsSync(`./users/${username}/${id}.json`)) {
                throw {'massage': '403'}
            }
            fs.writeFileSync(`./users/${username}/${id}.json`, JSON.stringify(pokemonObj))
        } else {
            fs.mkdirSync(`./users/${username}`) // create user dir
            fs.writeFileSync(`./users/${username}/${id}.json`, JSON.stringify(pokemonObj)) //create pokemon json
        }
        response.send('caught pokemon')
    } catch (error) {
        next(error)
    }
})

router.delete('/release/:id', (request, response, next) => {
    try { 
        const {id} = request.params
        const username = request.headers.username
        if (fs.existsSync(`./users/${username}`)) {
            if (fs.existsSync(`./users/${username}/${id}.json`)) {
                fs.unlinkSync(`./users/${username}/${id}.json`)
                return response.send('released pokemon')
            }
        }
        throw {'massage': '403'}
    } catch (error) {
        next(error)
    }
})

router.get('/', (request, response, next) => {
    try {
        const username = request.headers.username
        if (fs.existsSync(`./users/${username}`)) {
            const caughtArr = []
            const pokeFiles = fs.readdirSync(`./users/${username}`)
            for (const file of pokeFiles) {
                caughtArr.push(JSON.parse(fs.readFileSync(`./users/${username}/${file}`)))
            }
            return response.send(JSON.stringify(caughtArr))
        }
        throw {'massage': '403'}
    } catch (error) {
        next(error)
    }
})


module.exports = router