import { Button, Layout, Spinner, Text, useTheme } from '@ui-kitten/components'
import { usePokemonStore } from '../store/usePokemonStore';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, RefreshControl, ScrollView } from 'react-native';
import type { Pokemon } from '../../domain/entities/Pokemon';
import { useGetPokemon } from '../hooks/useGetPokemon';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootGloabStackParams } from '../navigation/GlobalStackNavigation';
import { useActivitiesStore } from '../store/useActivitiesStore';

export const FirstPokemonScreen = () => {

    const { addPoke, actualPokemon } = usePokemonStore()
    const [selectedPoke, setSelectedPoke] = useState<Pokemon | null>(null)
    const { pokemonList, isRefreshing, refresh } = useGetPokemon();
    const {setFirstOpening} = useActivitiesStore();
    const screenWidth = Dimensions.get('window').width;
    const navigation = useNavigation<NavigationProp<RootGloabStackParams>>();
    const theme = useTheme();

    const pokemonChoosen = async () => {
        if (!selectedPoke)
            return
        console.log({selectedPoke})
        await addPoke(selectedPoke);
        console.log({actualPokemon});

        setFirstOpening(1);
        navigation.reset({
            index:0,
            routes:[{name:"TopTabNavigation"}]
        })
    }

    const refreshPokes = () => {
        setSelectedPoke(null);
        refresh();
    }

    return (
        <>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => refreshPokes()}
                />

            }>

                <Layout style={{ flex: 1 }}>

                    <Text style={{ fontSize: 24, marginHorizontal: 30, textAlign: "center", marginTop: 20 }}>Elige cual sera tu primer pokemon</Text>
                    {
                        //Si lista de pokemon vacia entonces muestra spinner. Sino muestra los que haya encontrado
                        pokemonList.length === 0 ?
                            (<Layout style={{ height: screenWidth, width: "100%", justifyContent: "center", alignItems: "center" }}>
                                <Spinner size='giant' />
                            </Layout>)
                            :
                            (
                                <Layout style={{ marginHorizontal: 10, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                                    {
                                        pokemonList.map((poke, index) => {
                                            if (poke)
                                                return (
                                                    <Pressable onPress={() => setSelectedPoke(poke)} key={index} style={{ backgroundColor: poke.idEvolChain === selectedPoke?.idEvolChain ? theme["color-primary-500"] : undefined, height: screenWidth / 2, width: "50%", alignItems: "center", marginVertical: 10 }}>
                                                        <Image source={{ uri: poke.evolutions[0].imageUrl }} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                                    </Pressable>
                                                )
                                            else
                                                return <></>
                                        })
                                    }
                                </Layout>
                            )
                    }


                </Layout>




            </ScrollView>

            <Button onPress={() => pokemonChoosen()} size="large" disabled={selectedPoke === null} style={{ position: "absolute", bottom: 100, alignSelf: "center" }}>Confirmar</Button>
        </>

    )
}