import { Layout, Text } from '@ui-kitten/components'
import type { Activity } from '../../../domain/entities/Activity'
import { ActivityRowTime } from './ActivityRowTime'

interface Props{
    activities: Activity[]
}

export const TopActivities = ({activities}:Props) => {

    return (
        <Layout style={{ marginHorizontal: 10 }}> 
        {
            activities.map((activity, index )=>(
                <TopActivityRow key={activity.id} top={index+1} activity={activity}/>
            ))
        }
        </Layout>
    )
}

interface TopRowProps{
    top: number,
    activity: Activity
}

export const TopActivityRow = ({top, activity}:TopRowProps) => {

    //const topRef = useRef(top)

    const topBackColor = top ===1 ? "rgb(224, 204, 18)": top=== 2? "#cfd4d4" : "rgb(182, 137, 78)"
    const topBorderColor = top ===1 ? "rgb(175, 159, 15))": top=== 2? "#a9adad" : "rgb(138, 104, 59)"
    

    return (
        <Layout style={{ flexDirection: "row", width: "100%", marginVertical:5 }}>

            <Text category='h4' style={{ backgroundColor: topBackColor, borderRadius: 100, width: 50, height: 50, textAlign: "center", textAlignVertical: "center", borderColor: topBorderColor, borderWidth: 3, color:"black" }}>{top}</Text>
            <ActivityRowTime activity={activity}/>
        </Layout>
    )
}




