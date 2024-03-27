import { create } from "zustand";
import type { Activity, Session } from "../../domain/entities/Activity";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActivitiesStore } from "./useActivitiesStore";
import { usePokemonStore } from "./usePokemonStore";


export interface CronoState{
    seconds:number,
    minutes:number,
    hours:number,
    isRunning:boolean,
    isStarted: boolean,
    runningActivity: Activity | null,
    startTimeRunningActivity: Date | null,
    timeLastPlay: number, //tiempo que paso desde que se pulso por ultima vez play. 0 si no se pulso nunca
    getFormatedCrono: () => string
    addSecond: () => void
    startCrono: (activity: Activity) => Promise<void>
    stopCrono: () => Promise<void>
    playCrono: () => void
    pauseCrono: () => void
    resetCrono: () => void
    loadCrono: () => Promise<void>
    
}

export const useCronoStore = create<CronoState>()((set,get) =>({
    timeLastPlay: 0,
    isStarted: false,
    startTimeRunningActivity: null,
    runningActivity: null,
    seconds:0,
    minutes:0,
    hours:0,
    isRunning:false,
    getFormatedCrono: ()=>  {
        const seconds = get().seconds
        const minutes = get().minutes
        const hours = get().hours

        const h = hours >= 10 ? hours.toString() : "0" + hours;
        const m = minutes >= 10 ? minutes.toString() : "0" + minutes;
        const s = seconds >= 10 ? seconds.toString() : "0" + seconds;

        return h + ":" + m + ":" + s;
    },
    /**
     * Comienza el cronometro
     * @param activity 
     */
    startCrono:async (activity: Activity) =>{

        const startTime = new Date();
        useActivitiesStore.getState().updateLastActivities(activity.id);

        set({
            timeLastPlay: 0,
            isStarted:true,
            hours: 0,
            minutes:0,
            seconds:0,
            runningActivity: activity,
            startTimeRunningActivity: startTime
        })
        console.log("running crono")
        set({isRunning:true})

        await AsyncStorage.multiSet([["startTimeRunningActivity",startTime.toISOString()],["runningActivity", JSON.stringify(activity)], ["isRunning", "true"], ["timeLastPlay","0"]]);
    },
    resetCrono: () =>{
        const startFn = get().startCrono
        const activity = get().runningActivity;
        if(activity)
            startFn(activity);
    },
    /**
     * Continua el cronometro activo
     */
    playCrono: () =>{
        console.log("playing crono")
        const startTime = new Date();
        set({isRunning:true, startTimeRunningActivity: startTime})

        AsyncStorage.multiSet([["startTimeRunningActivity",startTime.toISOString()],["isRunning", "true"]]);
    },
    /**
     * Pausa el cronometro activo. Almacena el tiempo que llevaba hasta esta pausa
     */
    pauseCrono: async () =>{
        console.log("pausing crono")
        set({isRunning:false})
        if(get().startTimeRunningActivity!== null)
        {
            const time = get().hours *60*60 + get().minutes*60 + get().seconds;

            //actualiza el tiempo que lleva corriendo el crono
            await AsyncStorage.multiSet([["timeLastPlay",time.toString()],["isRunning", "false"]]);
        }
    },
    /**
     * Finaliza un cronometro
     */
    stopCrono: async () =>{
        console.log("stoping crono")

        set({isRunning:false, isStarted:false})

        const activity = get().runningActivity;
        if(activity)
        {
            console.log("stoping: ", {activity});
            const totalMinutes =get().hours * 60 + get().minutes + Math.round(get().seconds /60);
            if(totalMinutes >= 1)
            {
                activity.totalTime += totalMinutes;
                const session: Session = {
                    date: get().startTimeRunningActivity?.toISOString() || new Date().toISOString(),
                    minutes: totalMinutes
                }
                activity.sessions.push(session)
                useActivitiesStore.getState().updateActivity(activity);
                usePokemonStore.getState().addExperienceActual(totalMinutes);
            }
            
        }

        await AsyncStorage.multiRemove(["startTimeRunningActivity","runningActivity", "timeLastPlay"]);


    },
    /**
     * Carga los datos de un cronometro si se dejo alguno activo al cerrar la aplicacion
     */
    loadCrono: async () =>{
        const lastActivity = await AsyncStorage.getItem("runningActivity")
        const startTime = await AsyncStorage.getItem("startTimeRunningActivity")
        const isRunning = await AsyncStorage.getItem("isRunning")
        if(isRunning !== null && lastActivity!== null && startTime !== null)
        {
 
            const timeLastPlay = await AsyncStorage.getItem("timeLastPlay");
            let timeMiliseconds = timeLastPlay? Number(timeLastPlay) * 1000: 0;
            //si el crono no estaba corriendo,el tiempo actual es el que se guardo en la ultima pausa en timeLastPlay
            //si estaba corriendo, el tiempo actual es el que hubiera previamente mas lo que haya pasado desde que se pulso el ultimo play
            // Nota: si nunca se pauso el tiempo previo sera 0 y el calculo se realizara con la hora de inicio del crono
            if(isRunning === "true") {
                const actualDate = new Date();
                const startDate = new Date(Date.parse(startTime));
                timeMiliseconds += (actualDate.getTime() - startDate.getTime());
            }
            const actualDate = new Date();

            
            const differenceSeconds = Math.floor(timeMiliseconds / 1000);
            console.log({differenceSeconds})
            const differenceMinutes = Math.floor(differenceSeconds / 60);
            const hours = Math.floor(differenceMinutes / 60);
            const minutes = Math.floor(differenceMinutes % 60);
            const seconds = Math.floor(differenceSeconds % 60);
            //const differenceDays = Math.round(hours / 24);
            
            set({
                hours: hours,
                minutes: minutes,
                seconds: seconds,
                isStarted:true,
                isRunning:isRunning==="true",
                runningActivity: JSON.parse(lastActivity),
                startTimeRunningActivity: startTime === null? null: new Date(startTime)
            })
            const demoAct = get().runningActivity
            const demoStart =  get().startTimeRunningActivity
            console.log("Crono loaded: ",  {demoAct},{demoStart},{actualDate}, {minutes}, {seconds}, {timeSeconds: timeMiliseconds/1000} )
        }
        
    },
    addSecond: () =>{

        if (get().seconds === 59) {
            if (get().minutes === 59) {
                set({
                    hours: get().hours+1,
                    minutes:0,
                    seconds:0
                })
            }
            else {
                set({
                    hours: get().hours,
                    minutes:get().minutes+1,
                    seconds:0
                })
            }
        } else {
            set({
                hours: get().hours,
                minutes:get().minutes,
                seconds:get().seconds+1
            })
        }
    },
    
}))

