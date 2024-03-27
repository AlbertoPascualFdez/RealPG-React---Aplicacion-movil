import type { EvolutionInfo, Pokemon } from "../../domain/entities/Pokemon";
import type { PokeAPIEvolutionChain } from "../interfaces/pokeApiEvolutionChain";


export const pokeApiEvolutionToEntity = (pokeApiEv: PokeAPIEvolutionChain): Pokemon | null => {

    const evolutions: EvolutionInfo[] = []
    const evolutionLevels: number[] = []

    evolutions.push({ name: pokeApiEv.chain.species.name, imageUrl: "" })

    const firstEvo = pokeApiEv.chain.evolves_to[0];

    //ssi no tiene una evolucion
    if(!firstEvo)
        return null;

    //si la primera evolucion no evoluciona por nivel
    if(!firstEvo.evolution_details[0].min_level)
        return null;

    evolutions.push({ name: firstEvo.species.name, imageUrl: "" })
    evolutionLevels.push(firstEvo.evolution_details[0].min_level)

    const secondEvo = firstEvo.evolves_to[0];
    //si tiene segunda evolucion
    if(secondEvo)
    {
        if(secondEvo.evolution_details[0].min_level)
        {
            evolutions.push({ name: secondEvo.species.name, imageUrl: "" })
            evolutionLevels.push(secondEvo.evolution_details[0].min_level)
        }
    }

    return {
        idEvolChain: pokeApiEv.id,
        evolutions: evolutions,
        evolutionLevels:evolutionLevels,
        level: 0,
        levelExperience: 0
    }
}