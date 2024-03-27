import { Layout } from '@ui-kitten/components'
import { CustomStackHeader } from '../components/ui/CustomStackHeader'
import { StackScreenProps } from '@react-navigation/stack'
import { RootGloabStackParams } from '../navigation/GlobalStackNavigation'
import { TextTitle } from '../components/ui/TextTitle'
import { TopActivities } from '../components/activities/TopActivities'
import { getTopActivities, useActivitiesStore } from '../store/useActivitiesStore'
import { useState } from 'react'
import type { Activity } from '../../domain/entities/Activity'
import { ActivityRowTime } from '../components/activities/ActivityRowTime'
import { ScrollView } from 'react-native'

interface Props extends StackScreenProps<RootGloabStackParams, "CategoryStatsScreen"> { }
export const CategoryStatsScreen = ({ route }: Props) => {
   
    const categoryName: string = route.params.categoryName;

    const { getFilteredActivities } = useActivitiesStore()

    const [categoryActivities, setCategoryActivities] = useState<Activity[]>(getFilteredActivities(categoryName))

    return (
        <Layout style={{flex:1}}>
            <CustomStackHeader title={categoryName} />

            <TextTitle text='Top actividades' />
            <TopActivities activities={getTopActivities(categoryActivities)} />

            <TextTitle text='Actividades de la categoria' />
            <ScrollView>
                {
                    categoryActivities.map((activity, index) => (
                        <ActivityRowTime activity={activity} key={activity.id}  style={{marginVertical:5, marginLeft:10, marginRight:10}}/>
                    ))
                }
            </ScrollView>
        </Layout>
    )
}