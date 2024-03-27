import { Button, Layout, Text, useTheme } from '@ui-kitten/components'
import { useCronoStore } from '../../store/useCronoStore';
import { MyIcon } from '../ui/MyIcon';
import { useActivitiesStore } from '../../store/useActivitiesStore';
import { ActivityRowPlay } from './ActivityRowPlay';


export const MainScreenBottom = () => {
    const { isStarted } = useCronoStore();

    return (
        <>
            {
                isStarted ?
                    <CronoStartedView />
                    : <LastActivitiesView/>
            }
        </>

    )
}

const CronoStartedView = () => {
    const { getFormatedCrono, runningActivity, resetCrono, pauseCrono, isRunning, playCrono, stopCrono } = useCronoStore()

    const theme = useTheme()
    return (
        <Layout>
            <Text style={{ fontSize: 28, borderRadius:8, paddingVertical:4, textAlign: "center", backgroundColor: theme["background-basic-color-3"],marginHorizontal:30}}>{runningActivity?.name}</Text>
            <Text style={{ fontSize: 48, textAlign: "center" }}>{getFormatedCrono()}</Text>

            <Layout style={{ flexDirection: "row", flex: 1, justifyContent: "center", marginTop: 20, gap: 30 }}>
                <Button onPress={() => resetCrono()} style={{ borderRadius: 100, width: 75, height: 75 }} accessoryLeft={<MyIcon name='refresh' white />} />

                {
                    isRunning ?
                        <Button onPress={() => { pauseCrono() }} style={{ borderRadius: 100, width: 75, height: 75 }} accessoryLeft={<MyIcon name='pause' pack='assets' white />} />
                        : <Button onPress={() => { playCrono() }} style={{ borderRadius: 100, width: 75, height: 75 }} accessoryLeft={<MyIcon name='arrow-right' white />} />
                }

                <Button onPress={() => { stopCrono() }} style={{ borderRadius: 100, width: 75, height: 75 }} accessoryLeft={<MyIcon name='stop' pack='assets' white />} />
            </Layout>
        </Layout>
    )
}

const LastActivitiesView = () => {
    const {lastActivities} = useActivitiesStore()

    return (
        <Layout>
            <Text style={{fontSize:18, textAlign:"center", marginVertical:10}}>Actividades recientes</Text>
            {
                lastActivities.map(activity => (
                    <ActivityRowPlay activity={activity} key={activity.id}/>
                ))
            }
        </Layout>
    )
}