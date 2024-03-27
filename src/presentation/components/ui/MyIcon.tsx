import { Icon, useTheme } from '@ui-kitten/components'
import { StyleProp, ViewStyle } from 'react-native'

interface Props{
    name: string;
    color?: string;
    white?:boolean;
    width?: number;
    height?: number;
    pack?:string;
    style?: StyleProp<ViewStyle>
}

export const MyIcon = ({name, color, white = false, width=30, height=30, pack="eva", style}:Props) => {
    const theme = useTheme();

    if(white)
        color = theme["color-info-100"]
    else if(!color)
        color = theme["text-basic-color"]
    else
        color = theme[color]
    
return (
    <Icon
        style={[style,{width:width, height:height}]} fill={color} name={name} pack={pack}
    />
)
}