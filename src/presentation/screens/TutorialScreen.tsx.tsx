import { StyleProp, View, ViewStyle } from 'react-native'
import { useState } from 'react'
import { Button, Text, Layout, ViewPager, useTheme } from '@ui-kitten/components'

import { RootGloabStackParams } from '../navigation/GlobalStackNavigation';
import { NavigationProp, useNavigation } from '@react-navigation/native';



export const TutorialScreen = () => {

    const navigation = useNavigation<NavigationProp<RootGloabStackParams>>();

    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <Layout>

            <ViewPager
                style={{ height: "90%" }}
                selectedIndex={selectedIndex}
                onSelect={index => setSelectedIndex(index)}

            >
                {/* Primera pnatalla */}
                <Layout style={{ flex: 1 }}>
                    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 28, top: -100 }}>
                            Bienvenido a
                        </Text>
                        <Text category='h1' style={{ fontSize: 60 }}>
                            RealPG
                        </Text>
                        <Text category='s1' style={{ fontSize: 15 }}>
                            Version React
                        </Text>
                        <Text style={{ fontSize: 28, top: 30 }}>
                            El RPG de tu vida
                        </Text>
                    </Layout>
                    <Button onPress={()=> setSelectedIndex(selectedIndex+1)} style={{ position: "absolute", bottom: 0, right: 30, paddingHorizontal: 20 }}>Siguiente</Button>
                </Layout>

                {/* Segunda pantalla */}
                <Layout
                    style={{ flex: 1 }}
                >
                    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center", gap:60, top:-50}}>
                        <Layout style={{flexDirection:"row", alignItems:"center", width:"90%"}}>
                            <Text style={{fontSize:80, marginRight:10}}>⌛</Text>
                            <Text style={{ fontSize: 20,flexShrink:1, marginRight:10 }} > Crea actividades que realices a diario y mide cuanto tiempo les dedicas </Text>
                        </Layout>
                         <Layout style={{flexDirection:"row", alignItems:"center", width:"90%"}}>
                            <Text style={{fontSize:80, marginRight:10}}>📊</Text>
                            <Text style={{ fontSize: 20,flexShrink:1, width:"100%",marginRight:10 }} >Revisa estadísticas sobre las actividades que realizas para aprender a organizarte mejor</Text>
                        </Layout>
                       

                    </Layout>
                    <Button onPress={() => setSelectedIndex(selectedIndex-1)} style={{ position: "absolute", bottom: 0, left: 30, paddingHorizontal: 20 }}>Anterior</Button>
                    <Button onPress={()=> setSelectedIndex(selectedIndex+1)} style={{ position: "absolute", bottom: 0, right: 30, paddingHorizontal: 20 }}>Siguiente</Button>
                </Layout>

                 {/* tercera pantalla */}
                 <Layout
                    style={{ flex: 1 }}
                >
                    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center", gap:60,top:-50}}>
                        <Layout style={{flexDirection:"row", alignItems:"center", width:"90%"}}>
                            <Text style={{fontSize:80, marginRight:10}}>🆙</Text>
                            <Text style={{ fontSize: 20,flexShrink:1, marginRight:10 }} > Sube de nivel y evoluciona a tus pojemon realizando tus actividades </Text>
                        </Layout>
                         <Layout style={{flexDirection:"row", alignItems:"center", width:"90%"}}>
                            <Text style={{fontSize:80, marginRight:10}}>💎</Text>
                            <Text style={{ fontSize: 20,flexShrink:1, width:"100%",marginRight:10 }} >Consigue diamantes por cada nivel que subas y obtén nuevos pokemon</Text>
                        </Layout>

                        <Text style={{fontSize:24, position:"absolute", bottom:50, marginHorizontal:20, textAlign:"center"}}>Comencemos por elegir cual sera tu primer pokemon</Text>
                       

                    </Layout>
                    <Button onPress={() => setSelectedIndex(selectedIndex-1)} style={{ position: "absolute", bottom: 0, left: 30, paddingHorizontal: 20 }}>Anterior</Button>
                    <Button onPress={() => navigation.navigate("FirstPokemonScreen")} style={{ position: "absolute", bottom: 0, right: 30, paddingHorizontal: 20 }}>Comenzar</Button>
                </Layout>
                

            </ViewPager>

            <ViewPagerIndicator selectedPage={selectedIndex} totalPages={3} style={{ height: "10%" }} />
    
        </Layout>
    );

}


interface PropsPageIndicator {
    totalPages: number,
    selectedPage: number,
    dotRadius?: number,
    style?: StyleProp<ViewStyle>
}
const ViewPagerIndicator = ({ dotRadius = 10, selectedPage, totalPages, style }: PropsPageIndicator) => {

    const theme = useTheme()

    const dots = []
    for (let i = 0; i < totalPages; i++) {
        dots.push((
            <View key={i}
                style={{
                    backgroundColor: selectedPage === i ? theme["text-basic-color"] : theme["text-disabled-color"],
                    width: dotRadius,
                    height: dotRadius,
                    borderRadius: 100,

                }}></View>
        ))
    }

    return (
        <Layout style={[{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }, style]}>
            {
                dots
            }
        </Layout>
    )
}