import { Button } from "@ui-kitten/components"
import { MyIcon } from "./MyIcon"
import { StyleProp, ViewStyle } from "react-native"

interface Props {
    iconName:string;
    iconWidth?: number
    iconHeight?: number
    style?: StyleProp<ViewStyle>
    onPress: () => void,
    pack?:string
    
}

export const FAB = ({ style, iconName, onPress, iconHeight=30, iconWidth=30, pack="eva"}: Props) => {

    return (
        <Button 
        style={[
            style,
            {
                shadowColor: "black",
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowOpacity: 0.4,
                shadowRadius: 10,
                elevation: 3,
                borderRadius: 100,
            }
        ]}
        accessoryLeft={ <MyIcon name={iconName} white height={iconHeight} width={iconWidth} pack={pack}/>   }
        
        onPress={onPress}
        />
    )
}