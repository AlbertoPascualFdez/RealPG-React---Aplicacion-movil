import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pokemon } from "../../domain/entities/Pokemon";
import { ToastAndroid } from "react-native";


export interface PokemonState {
    obtainedPokes: Pokemon[],
    invalidIds: number[],
    coins: number,
    loadPokes: () => Promise<void>,
    addPoke: (poke: Pokemon) => Promise<void>
    buyPoke: (poke: Pokemon) => Promise<void>
    addInvalidIds: (id: number[]) => Promise<void>
    actualPokemon: Pokemon | null;
    changeActualPoke: (poke: Pokemon) => void
    addExperienceActual: (minutes: number) => void,
    updatePokemon: (pokemon: Pokemon) => Promise<void>,
}



export const usePokemonStore = create<PokemonState>()((set, get) => ({
    actualPokemon: null,
    coins: 10,
    obtainedPokes: [],
    invalidIds: [],
    loadPokes: async () => {
        console.log("Cargando pokes")
        try {

            const data = await AsyncStorage.multiGet(["obtainedPokes", "invalidIds", "actualPokemon", "coins"])

            if (data[0][1])
                set({ obtainedPokes: JSON.parse(data[0][1]) })

            if (data[1][1])
                set({ invalidIds: JSON.parse(data[1][1]) })

            if (data[2][1])
                set({ actualPokemon: JSON.parse(data[2][1]) })

            if (data[3][1])
                set({ coins: Number((data[3][1])) })

        } catch (error) {
            throw new Error("Error al leer los datos");

        }
    },
    addInvalidIds: async (ids: number[]) => {
        console.log("addingInvalid: " + ids)
        const invalidIds = get().invalidIds;

        set({ invalidIds: [...invalidIds, ...ids] })
        await AsyncStorage.setItem("invalidIds", JSON.stringify(invalidIds));
    },
    buyPoke: async (poke:Pokemon) =>{
        if(get().coins < 10)
        return;

        await get().addPoke(poke);
        const newCoins = get().coins-10
        set({coins:newCoins})
        await AsyncStorage.setItem("coins", newCoins.toString())
    },
    addPoke: async (poke: Pokemon) => {
       

        console.log("adding poke: " + { poke })
        const pokes = get().obtainedPokes;
        pokes.push(poke)
       
        set({ obtainedPokes: pokes, actualPokemon: poke})

        //AsyncStorage.setItem("obtainedPokes", JSON.stringify(pokes))
        //AsyncStorage.setItem("actualPokemon", JSON.stringify(poke))
        await AsyncStorage.multiSet([["obtainedPokes", JSON.stringify(pokes)],["actualPokemon", JSON.stringify(poke)]])
        await get().addInvalidIds([poke.idEvolChain])
        //addInvalidFn([poke.idEvolChain]);
    },
    changeActualPoke: (poke: Pokemon) => {
        set({ actualPokemon: poke })
        AsyncStorage.setItem("actualPokemon", JSON.stringify(poke))
    },
    addExperienceActual: (minutes: number) => {

        //1 minuto es 0,1 nivel

        /** 1 --- 0,1
         *  minutes --- x
         * x = (0,1 * minutes) / 1 
         */

        const poke = get().actualPokemon;
        if (!poke)
            return;

        const demoMultiplier = 1;

        const gainedExperience = minutes * 0.1 * demoMultiplier;
        let totalExperience = poke.levelExperience + gainedExperience;
        const exp = poke.levelExperience;
        console.log({ minutes }, { gainedExperience }, { exp }, { totalExperience })

        const obtainedCoins = Math.floor(totalExperience);
        if(totalExperience >= 1)
            ToastAndroid.show(`Has obtenido ${obtainedCoins} 💎`, ToastAndroid.SHORT)

        poke.level += Math.floor(totalExperience);
        poke.levelExperience = totalExperience % 1;

        set({ actualPokemon: poke, coins: get().coins +obtainedCoins })
        AsyncStorage.multiSet([["actualPokemon", JSON.stringify(poke)], ["coins", (get().coins+obtainedCoins).toString()]])
        get().updatePokemon(poke);
    },
    updatePokemon: async (pokemon: Pokemon) => {
        const obtainedPokemon = get().obtainedPokes;

        const newObtaineds = obtainedPokemon.map(poke => {
            if (poke.idEvolChain === pokemon.idEvolChain)
                return pokemon;
            return poke
        })

        set({ obtainedPokes: newObtaineds })
        AsyncStorage.setItem("obtainedPokes", JSON.stringify(newObtaineds))
    },

}))