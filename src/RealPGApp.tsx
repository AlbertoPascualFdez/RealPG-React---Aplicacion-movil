import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { View, useColorScheme } from 'react-native';

import { ApplicationProvider, IconRegistry, Layout, Spinner, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
//import { getCustomMapping } from './presentation/styles/CustomMapping';
import { GloabStackNavigation } from './presentation/navigation/GlobalStackNavigation';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AssetIconsPack } from './config/ui/CustomIconsProvider';
import { useActivitiesStore } from './presentation/store/useActivitiesStore';
import { useEffect } from 'react';
import { useCronoStore } from './presentation/store/useCronoStore';
import { usePokemonStore } from './presentation/store/usePokemonStore';
import { TutorialScreen } from './presentation/screens/TutorialScreen.tsx';

export const RealPgApp = () => {

    const colorScheme = useColorScheme();

    const customColors = {
        "color-primary-500": "#00bdad",
        "color-primary-600": "#016363",
        "color-primary-focus": "#01998c",
        "color-primary-active": "#01998c",
    }

    const customColorsDark = {

    }

    const customColorsLight = {
        //"background-basic-color-1": "# CE8D66"
        "color-primary-600": "#02a0a0",
        "background-basic-color-1": "#F5E4D7",
        "background-basic-color-2": "#d3bfae",
        "background-basic-color-3": "#cab6a6"

    }
    const theme = colorScheme === "dark" ? { ...eva.dark, ...customColors } : { ...eva.light, ...customColors, ...customColorsLight }


    const backgroundColor = colorScheme === "dark" ? theme["color-basic-800"] :"#F5E4D7";

    /*     console.log({DarkTheme})
        console.log("theme: ", theme["text-basic-color"])
        console.log("text theme color: ", theme["text-basic-color"]) */

    const { loadActivities, firstOpening } = useActivitiesStore();
    const { loadCrono } = useCronoStore();
    const { loadPokes, actualPokemon } = usePokemonStore()
    useEffect(() => {
        loadActivities();
        loadCrono();
        loadPokes();
    }, [])


    return (
        <>
            <IconRegistry icons={[EvaIconsPack, AssetIconsPack]} />
            <ApplicationProvider {...eva} theme={theme} /* customMapping={getCustomMapping(theme)} */>
                {
                    firstOpening === -1 &&
                    (<View style={{flex:1, justifyContent:"center", alignItems:"center"}}><Spinner size='giant'/></View>)
                   
                }
                {
                    firstOpening >= 0 &&
                    (
                        <NavigationContainer
                        theme={{
                            dark: colorScheme === "dark",
                            colors: {
                                primary: theme["color-primary-500"],
                                background: backgroundColor, //fondo por defecto layouts
                                card: backgroundColor, //cabecera navegacion
                                text: theme[theme["text-basic-color"]],
                                border: theme["color-basic-800"],
                                notification: theme["color-primary-500"]
                            }
                        }}
                    >
                        <GloabStackNavigation />
                    </NavigationContainer>
                    )
                }
            </ApplicationProvider>
        </>
    )
}


export const Categories = ["Bienestar", "Casa", "Deporte", "Estudios", "Ocio", "Otros", "Proyectos", "Trabajo", "Viajes"]
