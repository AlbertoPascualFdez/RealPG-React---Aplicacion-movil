import { useRef } from "react";
import { Animated, PanResponder, Easing } from "react-native";

interface Props {
    navigation?: any,
    size: number
}

export const useRotationPanAnimation = ({ navigation = null, size }: Props) => {

    const rotation = useRef(new Animated.Value(0)).current;
    const touchStartTime = useRef(0);

    //logica de animacion de rotacion
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (_, gestureState) => {
                touchStartTime.current = new Date().getTime();
                console.log("pan start")
                if (navigation) {
                    navigation.setOptions({
                        gestureEnabled: false,
                    });
                }
            },
            onPanResponderMove: (_, gestureState) => {
                const { moveY, y0, moveX, x0 } = gestureState;
                const deltaY = (moveY - y0) / 1000; // Ajusta el divisor para una rotación más lenta
                const deltaX = (moveX - x0) / 1000; // Ajusta el divisor para una rotación más lenta


                let rotationValue = deltaY / 150 * 180; // Ajusta 150 
                if (Math.abs((moveX - x0) / 1000))
                    rotationValue = deltaX / 150 * 180; // Ajusta 150 
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
                    // console.log('Pulsación dentro corta', { vy });
                } else {
                    const rotationDirection = moveX < size / 2 ? -1 : 1; // Detecta si el deslizamiento se hizo en el lado izquierdo

                    const deltaY = (moveY - y0) / 1000; // Ajusta el divisor para una rotación más lenta
                    const deltaX = (moveX - x0) / 1000; // Ajusta el divisor para una rotación más lenta
                    let vel = vy;
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        vel = vel > 0 ? vel + 1 : vel - 1
                        console.log({ moveX }, { deltaX })
                    }
                    //console.log('Pulsación dentro larga o deslizamiento rapido', { vy }, { vel });

                    Animated.decay(rotation, {

                        velocity: vel * rotationDirection,
                        deceleration: 0.997,
                        useNativeDriver: true,
                    }).start();
                }

                if (navigation) {
                    navigation.setOptions({
                        gestureEnabled: true,
                    });
                }

            },
        })
    ).current;


    const animatedStyle = {
        transform: [{ rotate: rotation.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] }) }],
    };


    return {
        animatedStyle: animatedStyle,
        panResponder: panResponder
    }
}