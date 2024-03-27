import { Text, useTheme } from '@ui-kitten/components'
interface Props{ text:string}
export const TextTitle = ({text}:Props) => {
    const theme = useTheme()
return (
    <Text style={{ fontSize: 20, textAlign: "center", backgroundColor: theme["color-primary-600"], paddingVertical: 10, margin: 10, borderRadius: 8 }} >{text}</Text>
)
}