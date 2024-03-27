import { Layout } from '@ui-kitten/components'
import { ScrollView} from 'react-native'

import { TopActivities } from '../components/activities/TopActivities';
import { CustomVictoryPie2 } from '../components/activities/CustomVictoryPie2';
import { getTopActivities, useActivitiesStore } from '../store/useActivitiesStore';
import { TextTitle } from '../components/ui/TextTitle';
import { useEffect, useState } from 'react';
import { Activity } from '../../domain/entities/Activity';

export const StatsScreen = () => {

  const { getCategoriesTime } = useActivitiesStore()

  const {activities} = useActivitiesStore();

  const [topActivities, setTopActivities] = useState<Activity[]>([]);

  useEffect(() => {
      const top = getTopActivities(activities);
      setTopActivities(top)

      console.log({top})
  }, [activities])

  return (
    <ScrollView>
      <TextTitle text='Top Actividades'/>

      <TopActivities  activities={topActivities}/>

      <TextTitle text='Horas por categoria'/>

      <Layout style={{ marginHorizontal: 10 }}>
        <CustomVictoryPie2 data={getCategoriesTime()} />
      </Layout>

    </ScrollView>
  )
}

