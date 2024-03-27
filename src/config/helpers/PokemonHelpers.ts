import { Pokemon } from "../../domain/entities/Pokemon";

/**
 * 
 * @param pokemon Datos del pokemon a valorar
 * @returns Devuelve la evolucion correspondiente al nivel actual
 */
export const getActualEvolution = (pokemon: Pokemon) => {

    for (let i = 0; i < pokemon.evolutionLevels.length; i++) {
        if (pokemon.evolutionLevels[i] > pokemon.level)
            return pokemon.evolutions[i];

    }
    

    return pokemon.evolutions[pokemon.evolutions.length - 1];
}

export type PokeOrder = "none" | "nameAsc" | "nameDesc" | "levelAsc" | "levelDesc" | "idAsc" | "idDesc"

export const orderPokeList = (list: Pokemon[], order: PokeOrder) => {
    const orderedList = [...list];

    const comparator = (a: Pokemon, b: Pokemon) => {
        switch (order) {
            case 'nameAsc':
                return getActualEvolution(a).name.localeCompare(getActualEvolution(b).name);
            case 'nameDesc':
                return getActualEvolution(b).name.localeCompare(getActualEvolution(a).name);
            case 'levelAsc':
                return a.level - b.level;
            case 'levelDesc':
                return b.level - a.level;
            case 'idAsc':
                return a.idEvolChain - b.idEvolChain;
            case 'idDesc':
                return b.idEvolChain - a.idEvolChain;
            default:
                return 0; // No se realiza ningún ordenamiento
        }
    };

    return orderedList.sort(comparator);
}


export const pokeOrderToText = (order:PokeOrder) =>{
    switch (order) {
        case 'nameAsc':
            return "A-z"
        case 'nameDesc':
            return "A-z"
        case 'levelAsc':
            return "Lvl"
        case 'levelDesc':
            return "Lvl"
        case 'idAsc':
            return "#"
        case 'idDesc':
            return "#"
        default:
            return "";
    }
}


