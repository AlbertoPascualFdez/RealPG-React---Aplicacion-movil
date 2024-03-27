import { Button, Layout, Spinner, Text } from '@ui-kitten/components'
import { Pokemon } from '../../domain/entities/Pokemon'
import { usePokemonStore } from '../store/usePokemonStore'
import { Dimensions, Image, RefreshControl, View } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootGloabStackParams } from '../navigation/GlobalStackNavigation'
import { CustomStackHeader } from '../components/ui/CustomStackHeader'
import { ScrollView } from 'react-native-gesture-handler'
import { useGetPokemon } from '../hooks/useGetPokemon'


export const ShopScreen = () => {

    const navigation = useNavigation<NavigationProp<RootGloabStackParams>>();
    const screenWidth = Dimensions.get('window').width;
   
    const { buyPoke, coins } = usePokemonStore()
    const {isRefreshing,pokemonList,refresh} = useGetPokemon()

    const addNewPoke = (pokemon: Pokemon) => {
        buyPoke(pokemon)
        navigation.goBack();
    }

    return (
        <ScrollView refreshControl={
            <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => refresh()}
            />
        }>
            <Layout style={{ flex: 1 }}>

                <CustomStackHeader title='Selecciona un pokemon' />

                <Text style={{ textAlign: "right", marginVertical: 20, marginRight: 20, fontSize: 18 }}>Tienes {coins} 💎</Text>
                {
                    //Si lista de pokemon vacia entonces muestra spinner. Sino muestra los que haya encontrado
                    pokemonList.length === 0 ?
                        (<Layout style={{ height: "70%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Spinner size='giant' />
                        </Layout>)
                        :
                        (
                            <Layout style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                                {
                                    pokemonList.map((poke, index) => (
                                        <Layout key={index} style={{ height: screenWidth / 2, width: "50%", alignItems: "center", marginVertical: 10 }}>
                                            {
                                                poke && (
                                                    <>
                                                        <Image source={{ uri: poke.evolutions[0].imageUrl }} style={{ width: "100%", height: "80%", objectFit: "contain" }} />
                                                        <Button disabled={coins < 10} size='small' onPress={() => addNewPoke(poke)}>Comprar</Button>
                                                    </>
                                                )
                                            }
                                        </Layout>

                                    ))
                                }
                            </Layout>
                        )
                }


                <Text style={{ textAlign: "center", marginTop: 50, fontSize: 18 }}>Cada pokemon cuesta 10 💎</Text>
            </Layout>
        </ScrollView>
    )
}