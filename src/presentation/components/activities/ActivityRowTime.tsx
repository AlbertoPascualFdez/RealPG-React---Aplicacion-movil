import { Text, useTheme } from "@ui-kitten/components"
import { Pressable, StyleProp, View, ViewStyle } from "react-native"
import { MyIcon } from "../ui/MyIcon"
import { useEffect, useState } from "react"
import { minutesToFormatedText } from "../../../config/helpers/DateHelpers"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { RootGloabStackParams } from "../../navigation/GlobalStackNavigation"
import type { Activity } from "../../../domain/entities/Activity"

interface Props {
    activity: Activity
    style?: StyleProp<ViewStyle>
}

export const ActivityRowTime = ({ activity, style }: Props) => {
    const navigation = useNavigation<NavigationProp<RootGloabStackParams>>();
    const theme = useTheme();

    //evita tener que llamar a la funcion minutesToFormatedText cada vez que pasa un segundo si esta un crono activo
    //no es una funcion con una carga fuerte, pero sirve de ejemplo de como se haria para que se llamara solo cuando haga falta
    const [minutesText, setMinutesText] = useState(minutesToFormatedText(activity.totalTime))
    useEffect(() => {
        setMinutesText(minutesToFormatedText(activity.totalTime))
    }, [activity.totalTime])

    return (
        <Pressable onPress={() => navigation.navigate("ActivityScreen", { activity: activity })} style={[{ flexDirection: "row", justifyContent: "space-between", backgroundColor: theme["background-basic-color-3"], borderRadius: 8, maxHeight: 50, height: 50, flex: 1, alignItems: "center", marginLeft: 10 }, style]}>
            <Text style={{ paddingLeft: 10 }}>{activity.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                <MyIcon name='clock' />
                <Text style={{ textAlign: "right", paddingHorizontal: 10 }}>{minutesText}</Text>
            </View>
        </Pressable>
    )
}
