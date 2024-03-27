import { Layout, Text, useTheme } from '@ui-kitten/components'
import type { Activity } from '../../../domain/entities/Activity'
import { MyIcon } from '../ui/MyIcon'
import { Pressable, StyleSheet } from 'react-native'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { RootGloabStackParams } from '../../navigation/GlobalStackNavigation'
import { useCronoStore } from '../../store/useCronoStore'
import { RootTabParams } from '../../navigation/TopTabNavigation'

interface Props {
    activity: Activity
}

export const ActivityRowPlay = ({ activity }: Props) => {

    const theme = useTheme();
    const navigation = useNavigation<NavigationProp<RootGloabStackParams>>();

    const topTabNavigation = useNavigation<NavigationProp<RootTabParams>>();

    const {startCrono} = useCronoStore()

    return (
        <Layout style={[styles.row]} level="3" >
            <Pressable
                style={{ justifyContent: "center", borderRadius: 12, backgroundColor: theme["background-basic-color-3"], flex:1}}
                onPress={() => navigation.navigate("ActivityScreen", { activity })}
            >

                <Text style={{ marginLeft: 10 }}>{activity.name}</Text>
            </Pressable>
            <Pressable
                style={{ flexDirection: "row", alignItems: "center", borderRadius: 12, backgroundColor: theme["background-basic-color-3"] }}
                onPress={() => {
                    startCrono(activity);
                    topTabNavigation.navigate("MainScreen");
                }}

            >
                <Layout style={[styles.separator, { backgroundColor: theme["text-basic-color"], borderRadius: 12 }]} />
                <MyIcon name='arrow-right' width={48} height={48} style={{ marginRight: 10 }} />
            </Pressable>
        </Layout>
    )
}

const styles = StyleSheet.create({
    row: {
        justifyContent: "space-between",

        flexDirection: "row",
        marginLeft: 20,
        marginRight: 10,
        marginVertical: 7,
        borderRadius: 12

    },
    separator: {
        backgroundColor: "red",
        width: 2,
        height: "70%",
        opacity: 0.5,
        marginRight: 10

    }
});