import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '@ui-kitten/components'
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native'
import { Circle, Svg } from 'react-native-svg';
import {  VictoryPie } from 'victory-native'
import type { Category } from '../../../domain/entities/Activity';
import { RootGloabStackParams } from '../../navigation/GlobalStackNavigation';
import { RootTabParams } from '../../navigation/TopTabNavigation';
import { useRotationPanAnimation } from '../../hooks/useRotationPanAnimation';


interface Props {
    data: Category[]
}

export const CustomVictoryPie2 = ({ data }: Props) => {

    const navigation = useNavigation<NavigationProp<RootGloabStackParams>>();
    const navigationTop = useNavigation<NavigationProp<RootTabParams>>();
    const theme = useTheme()
    const { width: size } = Dimensions.get('window');

    const { animatedStyle, panResponder } = useRotationPanAnimation({ navigation: navigationTop, size: size })

    const total = useRef(0)

    useFocusEffect(
        useCallback(() => {
            // Código que quieres ejecutar cuando esta pantalla se enfoque
            console.log('Screen 1 focused');

            return () => {
                // Código de limpieza si es necesario
                console.log('Screen 1 unfocused');
            };
        }, [])
    );

    useEffect(() => {
        let auxTotal = 0;
        data.forEach(category => {
            auxTotal += category.minutes
        });
        total.current = auxTotal
    }, [data])


    return (

        <Animated.View style={[{ height: size, width: size }, animatedStyle]}>
            <Svg>
                <Circle cx={size / 2} cy={size / 2} r={100} fill={theme["background-basic-color-3"]} {...panResponder.panHandlers} />
                <VictoryPie
                    width={size}
                    height={size}
                    radius={180}

                    data={data.map((category) => ({ x: category.name, y: category.minutes }))}
                    innerRadius={110}
                    labelRadius={135}
                    animate={{ easing: 'exp' }}

                    style={{ labels: { fill: 'white' } }}
                    labelPlacement={'perpendicular'}
                    labels={({ datum }) => `${datum.x} ${parseFloat(((datum.y / total.current) * 100).toFixed(1))}%`}
                    standalone={false}
                    events={[{
                        childName: "all",
                        target: "data",
                        eventHandlers: {
                            onPressIn: () => {
                                return [
                                    {
                                        target: "data",
                                        mutation: ({data, index}) => {
                                            console.log(data)
                                            console.log(index)

                                           const {x:categoryName} = data[index]
                                            
                                            navigation.navigate("CategoryStatsScreen", { categoryName: categoryName })
                                            return null;
                                        }
                                    }
                                ]
                            }
                        }
                    }]}
                />
            </Svg>
        </Animated.View>
    )
}


