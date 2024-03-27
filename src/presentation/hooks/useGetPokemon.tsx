import { useState, useEffect } from 'react'
import { getRandomPoke } from '../../actions/getEvolutionChains'
import { Pokemon } from '../../domain/entities/Pokemon'
import { usePokemonStore } from '../store/usePokemonStore'

export const useGetPokemon = () => {

    const [isRefreshing, setIsRefreshing] = useState(false)

    const [pokemonList, setPokemonList] = useState<(Pokemon | null)[]>([])

    const { addInvalidIds, addPoke, invalidIds, obtainedPokes, coins } = usePokemonStore()
  

    useEffect(() => {
        getPokes()
    }, [])

    /** 
     * @param extraInvalids Ids invalidos extra ademas de los invalidos globales
     * @returns Devuelve un pokemon aleatorio valido
     */
    const getPoke = async (extraInvalids: number[] = []) => {

        const { pokemon, invalidIdsFound } = await getRandomPoke([...invalidIds, ...extraInvalids])
        addInvalidIds(invalidIdsFound)

        console.log({ invalidIds })
        return pokemon;
    }

    const refresh = async () => {
        setPokemonList([]);
        setIsRefreshing(true);
        await getPokes();
        setIsRefreshing(false);
    }

    const getPokes = async () => {

        const extraInvalids = []//para no repetir pokemon en las 4 peticiones
        const pokes: Pokemon[] = []
        for (let i = 0; i < 4; i++) {
            const poke = await getPoke(extraInvalids);
            if (poke) {
                extraInvalids.push(poke.idEvolChain);
                //  setPokemonList([...pokemonList, poke])
                pokes.push(poke);
            }
        }
        setPokemonList(pokes);
    }
return {
    isRefreshing,
    pokemonList,
    refresh,
    getPokes

}
}