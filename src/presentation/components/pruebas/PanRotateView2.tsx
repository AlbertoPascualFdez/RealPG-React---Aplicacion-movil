import React, { useEffect, useRef, useState } from 'react';
import { View, PanResponder, Animated, Easing, StyleSheet, Pressable, Text, Dimensions } from 'react-native';

import { Button, Layout } from '@ui-kitten/components';
import Svg, { G, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

export const PanRotateView2 = () => {
    const rotation = useRef(new Animated.Value(0)).current;
    const touchStartTime = useRef(0);

    const [clickType, setClickType] = useState("");


    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            // Reactivar los gestos de navegación antes de salir de la pantalla
            navigation.setOptions({
                gestureEnabled: true,
            });
        });

        return unsubscribe;
    }, [navigation]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (_, gestureState) => {
                touchStartTime.current = new Date().getTime();

                navigation.setOptions({
                    gestureEnabled: false,
                });
            },
            /*  onPanResponderMove: (_, gestureState) => {
                 const { moveY, y0 } = gestureState;
                 const deltaY = (moveY - y0) / 1000; // Ajusta el divisor para una rotación más lenta
                 const rotationValue = deltaY / 150 * 180; // Ajusta 150 según tu preferencia
                 Animated.timing(rotation, {
                     toValue: rotationValue,
                     duration: 1000, // Ajusta la duración de la animación para una rotación más lenta
                     easing: Easing.linear,
                     useNativeDriver: true,
                 }).start();
             }, */
            onPanResponderRelease: (_, gestureState) => {
                const { vy } = gestureState;
                const touchEndTime = new Date().getTime();
                const touchDuration = touchEndTime - touchStartTime.current;

                if (touchDuration < 200) { // Si la pulsación dura menos de 200ms, considerarla como corta
                    // Aquí puedes ejecutar el código del elemento hijo
                    console.log('Pulsación corta');
                    setClickType('short');
                    setTimeout(() => {
                        setClickType(""); // Reinicia clickType después de 1 segundo
                    }, 500);
                } else {
                    console.log('Pulsación larga');
                    setClickType('long');
                    animate(rotation, vy)
                    /*  Animated.decay(rotation, {
                         velocity: vy,
                         deceleration: 0.997,
                         useNativeDriver: true,
                     }).start(); */
                }

                navigation.setOptions({
                    gestureEnabled: true,
                });
            },
        })
    ).current;

    const animate = (rotation: any, vy: any) => {
        Animated.decay(rotation, {
            velocity: vy,
            deceleration: 0.997,
            useNativeDriver: true,
        }).start();
    }

    useEffect(() => {
        console.log({ clickType });
    }, [clickType])


    const animatedStyle = {
        transform: [{ rotate: rotation.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] }) }],
    };

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            <Animated.View style={[styles.innerView, animatedStyle]} >
                {/* <MyPie/> */}
                <MyPie3 clickType={clickType} />
            </Animated.View>
        </View>
    );
};

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

interface Props2 {
    clickType: any
}

export const MyPie3 = ({ clickType }: Props2) => {
    const rotation = useRef(new Animated.Value(0)).current;
    const touchStartTime = useRef(0);
    const navigation = useNavigation();
    const { width: screenWidth } = Dimensions.get('window');

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
                const { moveY, y0 } = gestureState;
                const deltaY = (moveY - y0) / 1000; // Ajusta el divisor para una rotación más lenta
               
                let rotationValue = deltaY / 150 * 180; // Ajusta 150 según tu preferencia
                
                Animated.timing(rotation, {
                    toValue: rotationValue,
                    duration: 2000, // Ajusta la duración de la animación para una rotación más lenta
                    easing: Easing.linear,
                    useNativeDriver: true,
                }).start();
            },
            onPanResponderRelease: (_, gestureState) => {
                const { vy,moveX } = gestureState;
                const touchEndTime = new Date().getTime();
                const touchDuration = touchEndTime - touchStartTime.current;
               
                if (touchDuration < 200) { // Si la pulsación dura menos de 200ms, considerarla como corta
                    // Aquí puedes ejecutar el código del elemento hijo
                    console.log('Pulsación dentro corta');


                } else {
                    console.log('Pulsación dentro larga');
                    const rotationDirection = moveX < screenWidth / 2 ? -1 : 1; // Detecta si el deslizamiento se hizo en el lado izquierdo
                    Animated.decay(rotation, {
                       
                        velocity: vy * rotationDirection,
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

    console.log("click cambiado: " + clickType)
    return (
        <Animated.View style={[styles.innerView, { backgroundColor: "blue" }, animatedStyle]} >
            <Svg height="300" width="300" viewBox="0 0 180 180">
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
                                originX="90"
                                originY="90"
                                strokeLinecap="round"
                            />

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

                        </>
                    )
                    }
                </G>
            </Svg>
            <Text style={styles.label}>{total}€</Text>
        </Animated.View>
    )
}


