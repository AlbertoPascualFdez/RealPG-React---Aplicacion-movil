import { useNavigation } from '@react-navigation/native';
import { Layout, Text } from '@ui-kitten/components'
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, PanResponder, View } from 'react-native'
import { VictoryContainer, VictoryPie } from 'victory-native'


//TODO: poner el chart en un view. El view se podra rotar. Por tanto si se gira en el centro del chart se girarara todo. 


export const CustomVictoryPie = () => {
    const [startAngle, setStartAngle] = useState(0);
    const [endAngle, setEndAngle] = useState(360);
    const [rotationAngle, setRotationAngle] = useState(0);


    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            const { moveX, x0 } = gestureState;
            const deltaX = moveX - x0;
            const sensitivity = 0.5; // Sensibilidad de la rotación

            // Calcula el ángulo de rotación basado en el desplazamiento horizontal
            const newRotationAngle = deltaX * sensitivity;
            setRotationAngle(newRotationAngle);
        },
    });

    const rotation = useRef(new Animated.Value(0)).current;
    const touchStartTime = useRef(0);
    const navigation = useNavigation();

    const [data, setdata] = useState([
        { x: "Cats", y: 1 },
        { x: "Dogs", y: 1 },
        { x: "Birds", y: 1 }
    ])


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Código que deseas ejecutar después de 2 segundos
            console.log('Han pasado 2 segundos');
          /*   setdata([
                { x: "Cats", y: 35 },
                { x: "Dogs", y: 40 },
                { x: "Birds", y: 55 }
            ]) */
        }, 2000);

        // Limpia el timeout si el componente se desmonta antes de que se cumplan los 2 segundos
        return () => clearTimeout(timeoutId);
    }, []); // Este efecto se ejecutará solo una vez después de que el componente se monte


    return (
      
        <Animated.View {...panResponder.panHandlers}>

          <VictoryPie
            data={[
              { x: 'Hogar', y: 50 },
              { x: 'Bienestar', y: 75 },
              { x: 'Proyectos', y: 100 },
            ]}
            innerRadius={80}
            labelRadius={100}
            /* labelPosition={'centroid'} */
            style={{ labels: { fill: 'white' } }}
            labelPlacement={'vertical'}
          /*   startAngle={rotationAngle}
            endAngle={360 + rotationAngle} */
            events={[{
                childName:"all",
                target:"data",
                eventHandlers:{
                    onPressIn: () =>{
                        console.log("hola")
                        /* return [{mutation: (props) =>{
                            console.log("pulsa")
                        }}] */
                    },
                    onLongPress: () =>{
                        console.log("long")
                    }
                    
                }
            }]}
          />

      </Animated.View>


   
    )
}