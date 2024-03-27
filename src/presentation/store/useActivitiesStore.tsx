import { create } from "zustand";
import { Activity, Category } from "../../domain/entities/Activity";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subtractYears } from "../../config/helpers/DateHelpers";


export interface ActivitiesState {
    activities: Activity[],
    lastId: number;
    lastActivities: Activity[],
    firstOpening: number //-1 no se sabe, 0 no se abrio aun, 1 si se abrio
    createActivity: (activity: Activity) => Promise<void>,
    getFilteredActivities: (category: string) => Activity[],
    saveActivities: () => Promise<void>,
    loadActivities: () => Promise<void>,
    updateActivity: (newActivityData: Activity) => Promise<void>,
    deleteActivity: (activity: Activity) => Promise<void>,
    updateLastActivities: (id: Number) => Promise<void>,
    getCategoriesTime: () => Category[],
    setFirstOpening:(value:number) => Promise<void>
}



export const useActivitiesStore = create<ActivitiesState>()((set, get) => ({
    firstOpening:-1,
    lastId: 0,
    lastActivities: [],
    activities: [],
    createActivity: async (activity: Activity) => {

        const activities = get().activities;
        activity.id = get().lastId;
        set({ lastId: get().lastId + 1 })
        set({ activities: [...activities, activity] });
        const demo = get().activities;
        console.log({ demo })
        const saveFn = get().saveActivities;
        saveFn();
    },
    getFilteredActivities: (category: string) => {
        return get().activities.filter(activity => activity.category === category)
    },
    saveActivities: async () => {
        console.log("Guardando actividades")
        try {
            await AsyncStorage.setItem("activities", JSON.stringify(get().activities));
            await AsyncStorage.setItem("lastId", get().lastId.toString());
        } catch (error) {
            throw new Error("Error al guardar los datos");

        }
    },
    loadActivities: async () => {
        console.log("Cargando actividades")
        try {
            const activitiesStr = await AsyncStorage.getItem("activities");
            const lastId = await AsyncStorage.getItem("lastId");
            const lastActivitiesIdsStr = await AsyncStorage.getItem("lastActivities");
            const firstOpeningStr = await AsyncStorage.getItem("firstOpening");

            if (activitiesStr) {
                const activities: Activity[] = JSON.parse(activitiesStr)

                //elimina las sesiones de las que hace mas de un anio (es informacion ya no relevante)
                const lastYearDate = subtractYears(new Date(), 1)
                activities.forEach(activity => {
                    activity.sessions = activity.sessions.filter(session => (new Date(session.date) >= lastYearDate))
                });
                set({ activities: activities })
            }

            if (lastId)
                set({ lastId: Number(lastId) })

            if (lastActivitiesIdsStr) {
                const lastActivitiesIds: Number[] = JSON.parse(lastActivitiesIdsStr)
                const lastActivities = get().activities.filter(activity => lastActivitiesIds.includes(activity.id))
                const lastActivitiesOrder: Activity[] = []

                lastActivitiesIds.forEach(id => {
                    const activity = lastActivities.find(act => act.id === id)
                    if (activity)
                        lastActivitiesOrder.push(activity);
                });

                set({ lastActivities: lastActivitiesOrder })
            }

            if(firstOpeningStr)
            set({firstOpening: parseInt(firstOpeningStr)})
            else
            set({firstOpening:0})

            return;

        } catch (error) {
            throw new Error("Error al leer los datos");

        }
    },
    updateActivity: async (newActivityData: Activity) => {
        const activities = get().activities;
        const lastActivities = get().lastActivities;

        const newActivities = activities.map(activity => {
            if (activity.id === newActivityData.id)
                return newActivityData;
            return activity
        })

        const newLastActivities = lastActivities.map(activity => {
            if (activity.id === newActivityData.id)
                return newActivityData;
            return activity
        })

        console.log("to update: ", { newActivityData }, { activities })

        set({ activities: newActivities, lastActivities: newLastActivities })
        const saveFn = get().saveActivities;
        saveFn();

    },
    deleteActivity: async (newActivityData) => {
        console.log("borrando actividad")
        const activities = get().activities;

        const newActivities = activities.filter(activity => activity.id !== newActivityData.id)
        set({ activities: newActivities })
        const saveFn = get().saveActivities;
        saveFn();

    },
    updateLastActivities: async (id: Number) => {
        console.log("funcion update last activities llamada")

        const activity = get().activities.find(a => a.id === id)
        if (activity) {
            let lastActivities = get().lastActivities;
            const index = lastActivities.findIndex(act => act.id === activity.id);
            if (index !== -1)//la actividad ya estaba entre las tres ultimas
            {
                lastActivities.splice(index, 1)[0];//se elimina de la lista
                lastActivities.unshift(activity)//se mete por el principio
            }
            else//si no estaba, la mete en al principio de la lista, y la corta en 3 si con ella ya son mas de 3
            {
                lastActivities.unshift(activity)
                if (lastActivities.length > 3)
                    lastActivities.pop();
            }

            const lastActivitiesIds = lastActivities.map(activity => activity.id)
            set({ lastActivities: lastActivities })
            await AsyncStorage.setItem("lastActivities", JSON.stringify(lastActivitiesIds))
            console.log({ lastActivities })
        }
    },
    getCategoriesTime: () => {

        const activities = get().activities
        const categoriesTime: { [name: string]: Category } = {}

        activities.forEach(activity => {
          
            if (categoriesTime[activity.category])
                categoriesTime[activity.category].minutes += activity.totalTime
            else
                categoriesTime[activity.category] = {name: activity.category, minutes:activity.totalTime}
        });

        const categoriesTimeArray = Object.values(categoriesTime);
        return (categoriesTimeArray.filter(cat => cat.minutes > 0))
    },
    setFirstOpening: async (value:number) =>{
        await AsyncStorage.setItem("firstOpening", value.toString());
        set({firstOpening: value})
        return;
    }
}))


//funcion auxiliar para dar las tres actividades con mas tiempo de la lista recibida
//utiliza la lista recibida ya que asi puede dar el top 3 de una categoria, o de todas las actividades por ejemplo
export function getTopActivities(activityList: Activity[]) {
    if(activityList.length === 0)
        return [];

    const top:Activity[] = []
    //top.push(activityList[0])

    activityList.forEach(activity => {
        //console.log({activity})

        if(top.length >= 1 && activity.totalTime > top[0].totalTime )//nueva act mejor que la primera top
        {
            top.unshift(activity)
            if(top.length > 3)
            top.pop()
        }
        else if(top.length === 2 && activity.totalTime > top[1].totalTime ) //nueva act mejor que segunda top y solo dos top
        {
            top.push(top[1])//la anterior segunda pasa a ser la nueva tercera
            top[1] = activity //la nueva pasa a ser la segunda
        }
        else if(top.length === 3 && activity.totalTime > top[1].totalTime ) //nueva act mejor que segunda top y ya 3 top
        {
            top[2] = top[1] //la anterior segunda pasa a ser la tercera
            top[1] = activity;//la nueva pasa a ser la segunda
        }
        else if(top.length === 3 && activity.totalTime > top[2].totalTime) //nueva act mejor que la tercera
            top[2] = activity//sustituye a la tercera
        else if(top.length < 3)//no es mejor que ningun de las que habia, pero aun no habia 3 actividades
            top.push(activity)

            //console.log({top})
    });

    //console.log({top})

    return top;
}