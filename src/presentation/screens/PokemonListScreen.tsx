import { Button, Layout, List, Text, useTheme } from '@ui-kitten/components'
import { Dimensions, Image, Pressable } from 'react-native'
import { CustomStackHeader } from '../components/ui/CustomStackHeader'
import { usePokemonStore } from '../store/usePokemonStore'
import { PokeOrder, getActualEvolution, orderPokeList, pokeOrderToText } from '../../config/helpers/PokemonHelpers'
import type { Pokemon } from '../../domain/entities/Pokemon'
import { useEffect, useRef, useState } from 'react'
import { MyIcon } from '../components/ui/MyIcon'


export const PokemonListScreen = () => {
    const { obtainedPokes, actualPokemon } = usePokemonStore()

    const [order, setOrder] = useState<PokeOrder>("none")

    const [orderedPokes, setOrderedPokes] = useState(obtainedPokes);

    useEffect(() => {
        console.log("cambiando orden")
        setOrderedPokes(orderPokeList(obtainedPokes, order))
    }, [order])


    return (
        <Layout style={{ flex: 1 }}>
            <CustomStackHeader title='Mis pokemon' />
            <Layout style={{ flexDirection: "row", paddingHorizontal: "5%", gap: 7, paddingTop: 10, paddingBottom: 20, alignSelf: "center" }} level='3'>
                <OrderButton order='nameAsc' selectedOrder={order} setOrder={() => setOrder("nameAsc")} />
                <OrderButton order='nameDesc' selectedOrder={order} setOrder={() => setOrder("nameDesc")} />
                <OrderButton order='levelAsc' selectedOrder={order} setOrder={() => setOrder("levelAsc")} />
                <OrderButton order='levelDesc' selectedOrder={order} setOrder={() => setOrder("levelDesc")} />
                <OrderButton order='idAsc' selectedOrder={order} setOrder={() => setOrder("idAsc")} />
                <OrderButton order='idDesc' selectedOrder={order} setOrder={() => setOrder("idDesc")} />
                <OrderButton order='none' selectedOrder={order} setOrder={() => setOrder("none")} />
            </Layout>
            <List
            showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item.idEvolChain.toString()}
                numColumns={3}
                data={orderedPokes}
                renderItem={({ item }) => <PokeItem pokemon={item} />}
            />
        </Layout>
    )
}

interface PokeItemProps {
    pokemon: Pokemon
}
const PokeItem = ({ pokemon }: PokeItemProps) => {
    //nota: si en vez de obtener el actual asi, se le pasa como prop, aunque este cambie no provoca el re-renderizado de los componentes.
    //tendrian que tener un state que cambiara al cambiar el valor del prop con un useeffect para provocar el re renderizado
    const { changeActualPoke, actualPokemon } = usePokemonStore()
    const theme = useTheme();
    const pokeInfo = useRef(getActualEvolution(pokemon)).current
    const { width } = Dimensions.get('window');

    return (
        <Pressable style={{ width: width / 3, height: width / 3, backgroundColor: actualPokemon?.idEvolChain === pokemon.idEvolChain ? theme["color-primary-500"] : undefined, }} onPress={() => changeActualPoke(pokemon)}>
            <Image source={{ uri: pokeInfo.imageUrl }} style={{ height: "80%", objectFit: "contain" }} />
            <Text style={{ textAlign: "center" }}>{pokeInfo.name}</Text>
        </Pressable>
    )
}

interface OrderButtonProps {
    order: PokeOrder,
    selectedOrder: PokeOrder,
    setOrder: () => void
}

const OrderButton = ({ order, selectedOrder, setOrder }: OrderButtonProps) => {

    if (order === "none")
        return (
            <Button
                size='small'
                style={{ flex: 1 }}
                appearance={order === selectedOrder ? "filled" : "outline"}
                onPress={() => setOrder()}
                accessoryRight={
                    <MyIcon name='pokeball' pack='assets' width={24} height={24} />
                }
            >
            </Button>
        )

    return (
        <Button
            size='small'
            style={{ flex: 1}}
            appearance={order === selectedOrder ? "filled" : "outline"}
            onPress={() => setOrder()}
            accessoryRight={
                <>
                    <Text>{pokeOrderToText(order)}</Text>
                    {orderDirectionToIcon(order)}
                </>
            }
        >
            {/* <Text style={{width:"100%", backgroundColor:"red", height:"100%"}}>{pokeOrderToText(order)}</Text>  */}
        </Button>)
}

const orderDirectionToIcon = (order: PokeOrder) => {
    if (order.includes("Asc"))
        return <MyIcon  name='arrow-upward' width={20} height={20} />
    else
        return <MyIcon name='arrow-downward' width={20} height={20} />
}



