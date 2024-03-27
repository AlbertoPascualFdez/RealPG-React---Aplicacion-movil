import { Text } from '@ui-kitten/components'
import { PropsWithChildren, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleProp, StyleSheet, UIManager, View, ViewStyle } from 'react-native';
import { MyIcon } from './MyIcon';

interface Props extends PropsWithChildren {
    title: string,
    style?: StyleProp<ViewStyle>
    headerStyleActive?: StyleProp<ViewStyle>
    headerStyleInactive?: StyleProp<ViewStyle>
}

export const Accordion = ({ children, title, headerStyleActive, headerStyleInactive, style }: Props) => {

    const [expanded, setExpanded] = useState(false)


    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    return (

        <View style={style}>
            <Pressable
                style={[expanded ? headerStyleActive : headerStyleInactive, { paddingVertical: 7 }]}
                onPress={() => {
                    LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 200 });
                    setExpanded(!expanded);
                }}>
                <View style={styles.accordionHeader} >
                    <Text style={{ marginLeft: 10 }}>{title}</Text>

                    {
                        expanded ?
                            <MyIcon name="chevron-up-outline" style={[{ marginRight: 10 }]} />
                            : <MyIcon name="chevron-down-outline" style={[{ marginRight: 10 }]} />
                    }
                </View>
            </Pressable>

            {/* Contenido */}
            {
                expanded &&
                <View>
                    {children}
                </View>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    accordion: {
    },
    accordionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    accordionHeaderExpandedIcon: {
        transform: [{ rotateY: "180deg" }]
    }
});