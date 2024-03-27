import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Input, Layout, Text, useTheme } from '@ui-kitten/components'
import { Pressable } from 'react-native'
import { RootGloabStackParams } from '../../navigation/GlobalStackNavigation';
import { MyIcon } from './MyIcon';

interface Props {
    title: string
    onChangeTitle?: (newTitle: string) => void
}
export const CustomStackHeader = ({ title, onChangeTitle }: Props) => {
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp<RootGloabStackParams>>();

    return (

        <Layout style={{ backgroundColor: theme["background-basic-color-3"], flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>

            {
                onChangeTitle ?
                    <Input onChangeText={(value) => onChangeTitle(value)} status='basic' style={{ backgroundColor: theme["background-basic-color-3"], borderWidth: 0, flex: 1, alignSelf: 'center', paddingVertical: 10 }} textStyle={{ textAlign: "center" }}>{title}</Input>
                    : <Text category='h4' style={{ flex: 1, alignSelf: 'center', textAlign: 'center', paddingVertical: 10 }}>{title}</Text>
            }

            <Pressable onPress={() => navigation.goBack()} style={{ position: "absolute", left: 10 }}>
                <MyIcon name='arrow-back' width={34} height={34} style={{ marginRight: 10, }} />
            </Pressable>

        </Layout>
    )
}