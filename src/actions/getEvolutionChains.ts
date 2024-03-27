import { pokeApi } from "../config/api/pokeApi"
import { Pokemon } from "../domain/entities/Pokemon"
import { PokeAPIEvolutionChain } from "../infrastructure/interfaces/pokeApiEvolutionChain"
import { PokeAPIPokemon } from "../infrastructure/interfaces/pokeapiPokemon"
import { pokeApiEvolutionToEntity } from "../infrastructure/mappers/pokemonMapper"

export const getRandomPoke = async (invalidIds: number[], initialTryNumber = 0): Promise<{invalidIdsFound: number[], pokemon: Pokemon | null }> => {

    const invalidIdsFound: number[] = []
    let tryNumber = initialTryNumber;
    try {
        console.log("getting random")
        const { data: info } = await pokeApi.get(`/evolution-chain`)

        const idsToFetch: number[] = [];
        let idToFetch = -1;
        const maximumTries = 20;

        let pokemon: Pokemon | null = null

        while (idToFetch === -1 && tryNumber < maximumTries) {
            tryNumber++;
            const id = randomExcluding(1, info.count, invalidIds);
            console.log({ id })

            if(!id)//no quedan ids validos
            return ({invalidIdsFound, pokemon:null});

            const { data } = await pokeApi.get<PokeAPIEvolutionChain>(`/evolution-chain/${id}`)
            const poke = pokeApiEvolutionToEntity(data);
            //comprobar si poke pedido es valido
            if (!poke) {
                console.log("adding invalid pokemon from fetch")
                invalidIdsFound.push(id)
                invalidIds.push(id);
                continue
            }
            idToFetch = id;

            idsToFetch.push(id);
            pokemon = poke
        }

        if (!pokemon)
            return({pokemon:null, invalidIdsFound})    
        //throw new Error("No se han podido conseguir el poke");

        console.log("id listo: " + idToFetch + " Numero de intentos: " + tryNumber)

        const pokeInfoPromises = pokemon.evolutions.map(ev => pokeApi.get<PokeAPIPokemon>(`/pokemon/${ev.name}`))
        const pokeInfoData = await Promise.all(pokeInfoPromises);
        pokemon.evolutions = pokeInfoData.map(pokeData => {
            let imgUrl = pokeData.data.sprites.front_default;//imagen por defecto
            if(pokeData.data.sprites.other)
                if(pokeData.data.sprites.other["official-artwork"]) //imagen preferible si disponible
                    imgUrl = pokeData.data.sprites.other["official-artwork"].front_default;
                return({ name: pokeData.data.name, imageUrl: imgUrl })
        })

        return {pokemon, invalidIdsFound};

    } catch (error) {//hay ids de evoluciones que deberian existir pero que  realmente no existen, por ejemplo el 227
        return getRandomPoke(invalidIds, tryNumber );//se vuelve a llamar pero teniendo en cuenta los intentos previos.Asi asegura que en algun momento finalizara ya que en el while siempre aumenta
            //return ({invalidIdsFound, pokemon:null});

    }

}

const generateRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomExcluding(min: number, max: number, exclude: number[]) {
    // Crea un conjunto de todos los números posibles en el rango
    let possibleNumbers = new Set<number>();
    for (let i = min; i <= max; i++) {
        possibleNumbers.add(i);
    }

    // Elimina los números de exclusión del conjunto
    for (let num of exclude) {
        possibleNumbers.delete(num);
    }

    // Convierte el conjunto en un array para seleccionar un elemento aleatorio
    let possibleArray = Array.from(possibleNumbers);

    // Genera un número aleatorio del conjunto reducido
    let randomNumber = possibleArray[Math.floor(Math.random() * possibleArray.length)];

    return randomNumber;
}

