import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Layout, ProgressBar, Text } from '@ui-kitten/components'
import { RootGloabStackParams } from '../navigation/GlobalStackNavigation';
import { FAB } from '../components/ui/FAB';
import { AppState, Image } from 'react-native';
import { useEffect} from 'react';
import { useCronoStore } from '../store/useCronoStore';
import { MainScreenBottom } from '../components/activities/MainScreenBottom';
import { usePokemonStore } from '../store/usePokemonStore';
import { getActualEvolution } from '../../config/helpers/PokemonHelpers';


export const MainScreen = () => {

    const navigation = useNavigation<NavigationProp<RootGloabStackParams>>();

    const {  loadCrono, addSecond, isRunning } = useCronoStore()
    const { actualPokemon} = usePokemonStore()
    

    //activa el cronometro si se inicio o se le dio a play
    useEffect(() => {
        let intervalo: NodeJS.Timeout | undefined;
        console.log("use effect")
        if (isRunning) {
            console.log("running")
            intervalo = setInterval(() => {
                addSecond();
            }, 1000);
        } else {
            clearInterval(intervalo);
        }

        return () => clearInterval(intervalo);
    }, [isRunning]);
    

    //si se minimizo la app mientras habia un crono activo, al volver se vuelven a cargar los datos del crono como si se hubiera cerrado del todo la app
    //si estaba pausado no es necesario realizar nada ya que se mantendran los datos anteriores
    useEffect(() => {
        console.log("isRunning ha cambiado")

        const handleAppStateChange = (nextAppState: any) => {
            if (nextAppState === 'active') {
                console.log('App has come to the foreground!');
                console.log({ isRunning });
                if (isRunning) {
                    console.log("loadingCrono")
                    loadCrono()
                }
            }

            console.log('AppState', nextAppState);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [isRunning]);


    return (
        <Layout style={{ flex: 1 }}>

            <Layout style={{ justifyContent: "center", height: "60%" }}>
                {
                    actualPokemon ?
                        <Image source={{ uri: getActualEvolution(actualPokemon).imageUrl }} style={{ height: "80%", width: "100%", objectFit: "contain", alignSelf: "center" }} />
                        : <Image source={require("../../assets/pokeball.png")} style={{ height: "80%", width: "100%", objectFit: "contain", alignSelf: "center" }} />
                }
                {
                    actualPokemon &&
                    <Layout style={{ marginHorizontal: 20 }}>
                        <Text style={{ textAlign: "center", marginBottom: 5, fontSize: 24 }}>Lvl {actualPokemon.level}</Text>
                        <ProgressBar size='large' progress={actualPokemon.levelExperience} />
                    </Layout>

                }
            </Layout>

            {/* Crono y ultimas activdades */}
            <MainScreenBottom />

            <FAB
                iconName='shopping-bag-outline'
                onPress={() => navigation.navigate("ShopScreen")}
                style={{ position: "absolute", right: 20, top: 20, width: 64, height: 64 }}
                iconHeight={40}
                iconWidth={40}
            />
            <FAB
                iconName='pokeball'
                pack='assets'
                onPress={() => navigation.navigate("PokemonListScreen")}
                style={{ position: "absolute", left: 20, top: 20, width: 64, height: 64 }}
                iconHeight={40}
                iconWidth={40}
            />
          
        </Layout>
    )
}