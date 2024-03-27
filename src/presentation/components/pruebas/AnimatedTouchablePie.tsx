import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import { Animated, Dimensions, PanResponder, Easing, StyleSheet } from "react-native";
import Svg, { G, Circle, Text } from "react-native-svg";


const radius = 70;
const circleCircumference = 2 * Math.PI * radius;

const groceries = 241;
const bills = 372;
const regular = 188;
const total = groceries + bills + regular;

const groceriesPercentage = (groceries / total) * 100;
const billsPercentage = (bills / total) * 100;
const regularPercentage = (regular / total) * 100;

const groceriesStrokeDashoffset =
    circleCircumference - (circleCircumference * groceriesPercentage) / 100;
const billsStrokeDashoffset =
    circleCircumference - (circleCircumference * billsPercentage) / 100;
const regularStrokeDashoffset =
    circleCircumference - (circleCircumference * regularPercentage) / 100;

const groceriesAngle = (groceries / total) * 360;
const billsAngle = (bills / total) * 360;
const regularAngle = groceriesAngle + billsAngle;

interface Props {
    size: number,
    data: { category: string, minutes: number }[]
}

export const AnimatedTouchablePie = ({ size, data }: Props) => {
    const rotation = useRef(new Animated.Value(0)).current;
    const touchStartTime = useRef(0);
    const navigation = useNavigation();


    const animatedStyle = {
        transform: [{ rotate: rotation.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] }) }],
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (_, gestureState) => {
                touchStartTime.current = new Date().getTime();

                navigation.setOptions({
                    gestureEnabled: false,
                });
            },
            onPanResponderMove: (_, gestureState) => {
                const { moveY, y0, moveX, x0 } = gestureState;
                const deltaY = (moveY - y0) / 1000; // Ajusta el divisor para una rotación más lenta
                const deltaX = (moveX - x0) / 1000; // Ajusta el divisor para una rotación más lenta


                let rotationValue = deltaY / 150 * 180; // Ajusta 150 según tu preferencia
                if (Math.abs((moveX - x0) / 1000))
                    rotationValue = deltaX / 150 * 180; // Ajusta 150 según tu preferencia
                Animated.timing(rotation, {
                    toValue: rotationValue,
                    duration: 1000, // Ajusta la duración de la animación para una rotación más lenta
                    easing: Easing.linear,
                    useNativeDriver: true,
                }).start();
            },
            onPanResponderRelease: (_, gestureState) => {
                const { vy, moveX, moveY, x0, y0 } = gestureState;
                const touchEndTime = new Date().getTime();
                const touchDuration = touchEndTime - touchStartTime.current;

                //en realidad solo con el vy=== 0 bastaria para detectra un touch y no un deslizamiento. El tiempo ya no es relevante
                //se deja unicamente a modo informativo
                if (touchDuration < 200 && vy === 0) { // Si la pulsación dura menos de 200ms, considerarla como corta
                    // Aquí puedes ejecutar el código del elemento hijo
                    console.log('Pulsación dentro corta', { vy });


                } else {
                    const rotationDirection = moveX < size / 2 ? -1 : 1; // Detecta si el deslizamiento se hizo en el lado izquierdo

                    const deltaY = (moveY - y0) / 1000; // Ajusta el divisor para una rotación más lenta
                    const deltaX = (moveX - x0) / 1000; // Ajusta el divisor para una rotación más lenta
                    let vel = vy;
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        vel = vel > 0 ? vel + 1 : vel - 1
                        console.log({ moveX }, { deltaX })
                    }


                    console.log('Pulsación dentro larga o deslizamiento rapido', { vy }, { vel });

                    Animated.decay(rotation, {

                        velocity: vel * rotationDirection,
                        deceleration: 0.997,
                        useNativeDriver: true,
                    }).start();
                }

                navigation.setOptions({
                    gestureEnabled: true,
                });
            },
        })
    ).current;

    //const [clickType, setClickType] = useState(click)
    const textoX = 50 + (Math.cos((Math.PI * (360 - groceriesStrokeDashoffset)) / 180) * radius) + '%';
    const textoY = 50 + (Math.sin((Math.PI * (360 - groceriesStrokeDashoffset)) / 180) * radius) + '%';

    return (
        <Animated.View style={[/* styles.innerView, */ { height: size, width: size }, animatedStyle]} >
            <Svg height={size} width={size} viewBox="0 0 180 180">
                <G rotation={-90} originX="90" originY="90">
                    {total === 0 ? (
                        <Circle
                            cx="50%"
                            cy="50%"
                            r={radius}
                            stroke="#F1F6F9"
                            fill="transparent"
                            strokeWidth="40"
                        />
                    ) : (
                        <>

                            <G>

                                <Circle {...panResponder.panHandlers}

                                    cx="50%"
                                    cy="50%"
                                    r={radius}
                                    stroke="#F05454"
                                    fill="transparent"
                                    strokeWidth="40"
                                    strokeDasharray={circleCircumference}
                                    strokeDashoffset={groceriesStrokeDashoffset}
                                    rotation={0}
                                    originX="45"
                                    originY="90"
                                    strokeLinecap="round"
                                />
                                <Text
                                /*  x="50%"
                                 y="50%"
                                 
                                 stroke="#F05454"
                                 fill="transparent"
                                 strokeDasharray={circleCircumference}
                                 strokeDashoffset={groceriesStrokeDashoffset}
                                 rotation={0}
                                 originX="0"
                                 originY="0"
                                 strokeLinecap="round" */
                                >
                                    Texto sobre el círculo
                                </Text>

                            </G>

                            <G>

                                <Circle {...panResponder.panHandlers}

                                    cx="50%"
                                    cy="50%"
                                    r={radius}
                                    stroke="#30475E"
                                    fill="transparent"
                                    strokeWidth="40"
                                    strokeDasharray={circleCircumference}
                                    strokeDashoffset={billsStrokeDashoffset}
                                    rotation={groceriesAngle}
                                    originX="90"
                                    originY="90"
                                    strokeLinecap="round" />
                                <Text
                                    x="50%"
                                    y="85%"


                                    textAnchor="middle"
                                    /*  fill="transparent" */

                                    /*   strokeDasharray={circleCircumference}
                                      strokeDashoffset={billsStrokeDashoffset} */
                                    rotation={groceriesAngle - 20}
                                    originX="90"
                                    originY="90"
                                    strokeLinecap="round"

                                >
                                    Texto sobre el círculo
                                </Text>
                            </G>

                            <G>


                                <Circle {...panResponder.panHandlers}

                                    cx="50%"
                                    cy="50%"
                                    r={radius}
                                    stroke="#222831"
                                    fill="transparent"
                                    strokeWidth="40"
                                    strokeDasharray={circleCircumference}
                                    strokeDashoffset={regularStrokeDashoffset}
                                    rotation={regularAngle}
                                    originX="90"
                                    originY="90"
                                    strokeLinecap="round"
                                />
                                <Text
                                    x="50%"
                                    y="50%"


                                    textAnchor="middle"
                                    /*  fill="transparent" */

                                    /*   strokeDasharray={circleCircumference}
                                      strokeDashoffset={billsStrokeDashoffset} */
                                    rotation={regularAngle - 20}
                                    
                                    originX="90"
                                    originY="90"
                                    strokeLinecap="round"

                                >
                                    Texto sobre el círculo2
                                </Text>

                            </G>

                        </>
                    )
                    }
                </G>
            </Svg>
            {/*  <Text style={styles.label}>{total}€</Text> */}
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        margin: 10
    },
    innerView: {
        width: 300,
        height: 300,
        backgroundColor: 'red',
    },
    graphWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        position: "absolute",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 24,
    },
});