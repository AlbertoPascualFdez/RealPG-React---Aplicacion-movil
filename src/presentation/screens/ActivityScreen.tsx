import { StackScreenProps } from '@react-navigation/stack'
import { Layout, Text, Button } from '@ui-kitten/components'
import { RootGloabStackParams } from '../navigation/GlobalStackNavigation'
import { MyIcon } from '../components/ui/MyIcon'
import { useCategorySelect } from '../hooks/useCategorySelect'
import { useEffect, useRef, useState } from 'react'
import { useActivitiesStore } from '../store/useActivitiesStore'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import type { Activity, Session } from '../../domain/entities/Activity'
import { subtractYears, subtractMonths, subtractDays, minutesToFormatedText } from '../../config/helpers/DateHelpers'
import { CustomStackHeader } from '../components/ui/CustomStackHeader'

interface Props extends StackScreenProps<RootGloabStackParams, "ActivityScreen"> { }

export const ActivityScreen = ({ route }: Props) => {

    const activity: Activity = route.params.activity

    const { displayValue = activity.category, selectComponent } = useCategorySelect(false, activity.category)
    const [activityName, setActivityName] = useState(activity.name);

    const [isDeleted, setIsDeleted] = useState(false);

    const navigation = useNavigation<NavigationProp<RootGloabStackParams>>();

    const { updateActivity, deleteActivity } = useActivitiesStore()

    const [referenceDates, setReferenceDates] = useState({ lastYear: new Date(), lastMonth: new Date(), lastWeek: new Date() })

    const [initialRender, setInitialRender] = useState(false)//para evitar llamada innecesaria a updateActivity al montar el componente por primera vez

    //actualizacion de datos al cambiar la categoria (podria hacerse como el cambio de nombre, pero se deja a modo de ejemplo)
    useEffect(() => {
        if (initialRender === false)
            setInitialRender(true)
        else
            updateActivity({ ...activity, category: displayValue });
    }, [displayValue])

    //actualizacion de datos al cambiar el nombre (retrasada al salir de la pantalla)
    useEffect(() => {
        setReferenceDates({
            lastYear: subtractYears(new Date(), 1),
            lastMonth: subtractMonths(new Date(), 1),
            lastWeek: subtractDays(new Date(), 7),
        })

    }, [])

    //referencias necesarias que el valor del estado se pierde en el listener de la navegacion
    const lastIsDeletedRef = useRef(isDeleted);
    const lastActivityNameRef = useRef(activityName);
    useEffect(() => {
        lastIsDeletedRef.current = isDeleted;
    }, [isDeleted]);
    useEffect(() => {
        lastActivityNameRef.current = activityName;
    }, [activityName]);


    //actualizacion de los datos si hubo cambios en categoria o nombre al salir de la pantalla
    useEffect(() => {
        const removeListener = navigation.addListener("beforeRemove", (e) => {
            e.preventDefault()
            console.log("evento dectado")
            if (lastIsDeletedRef.current) {
                deleteActivity(activity);
            }
            console.log({activity}, {activityName})
            if(activity.name !==  lastActivityNameRef.current)
            {
                console.log("cambiando nombre")
                updateActivity({ ...activity, name:  lastActivityNameRef.current });
            }
            navigation.dispatch(e.data.action);
        })

        return removeListener
    }, [navigation])



    return (
        <Layout style={{ flex: 1 }}>
            <CustomStackHeader title={activityName} onChangeTitle={(name) => setActivityName(name)}/>

            {/* Category */}
            <Layout style={{ justifyContent: "center", alignSelf: "center", flexDirection: "row", width: "70%", marginTop: 20 }}>
                <Text style={{ flex: 1, textAlign: "center" }} category='h5'>Categoria</Text>
                {selectComponent}
            </Layout>

            <Layout style={{ flex: 1, marginHorizontal: "10%", marginTop: 20 }}>
                <TimeRow title='Semana' minutes={getMinutesSinceDate(referenceDates.lastWeek, activity.sessions)} />
                <TimeRow title='Mes' minutes={getMinutesSinceDate(referenceDates.lastMonth, activity.sessions)} />
                <TimeRow title='Año' minutes={getMinutesSinceDate(referenceDates.lastYear, activity.sessions)} />
                <TimeRow title='Total' minutes={activity.totalTime} />
            </Layout>

            <Button onPress={() => setIsDeleted(!isDeleted)} style={{ alignSelf: "center", marginBottom: 40 }} status={isDeleted ? "primary" : "danger"}>
                {
                    isDeleted ?
                        <Text>Deshacer Borrado</Text>
                        : <Text>Eliminar</Text>
                }
            </Button>
        </Layout>
    )
}


/* Superposicion de un elemento por encima de cualquier cosa 
   <Layout style={{position:"absolute", backgroundColor:"rgba(255, 255, 255, 0)", width:"100%", height:"100%"}}>
</Layout> 
*/

interface timeRowProps {
    minutes: number,
    title: string
}
const TimeRow = ({ minutes, title }: timeRowProps) => {

    const textMinutes = minutesToFormatedText(minutes);

    return (
        < Layout style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
            {/* left */}
            < Layout style={{ flexDirection: "row", alignItems: "center" }}>
                <MyIcon name='clock' width={48} height={48} />
                <Text style={{ marginLeft: 20, fontSize: 18 }}>{title}</Text>
            </Layout >
            {/* right */}
            < Layout style={{ justifyContent: "center" }}>
                <Text>{textMinutes}</Text>
            </Layout >
        </Layout >
    )
}


const getMinutesSinceDate = (date: Date, sessions: Session[]) => {
    let minutes = 0;
    sessions.forEach(session => {

        if (new Date(session.date).getTime() >= date.getTime()) {

            minutes += session.minutes
        }

    });
    return minutes;
}

