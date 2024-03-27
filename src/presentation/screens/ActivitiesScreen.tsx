import { Layout, useTheme } from '@ui-kitten/components'
import { FAB } from '../components/ui/FAB'
import { Categories } from '../../RealPGApp';
import { ModalActivity } from '../components/activities/ModalActivity';
import { useState } from 'react';
import { useActivitiesStore } from '../store/useActivitiesStore';
import { Accordion } from '../components/ui/Accordion';
import { ActivityRowPlay } from '../components/activities/ActivityRowPlay';


export const ActivitiesScreen = () => {

    const theme = useTheme();

    const { getFilteredActivities } = useActivitiesStore()

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <Layout style={{ flex: 1 }}>
            {
                Categories.map(category => (
                    <Accordion
                        key={category}
                        title={category}
                        headerStyleActive={{ backgroundColor: theme["color-primary-500"] }}
                        headerStyleInactive={{ backgroundColor: theme["color-primary-600"] }}
                        style={{ marginVertical: 7 }}
                    >
                        {
                            getFilteredActivities(category).map(activity => {
                                return (<ActivityRowPlay key={activity.id} activity={activity} />)
                            }
                            )
                        }
                    </Accordion>
                ))
            }

            <FAB
                iconName='plus-outline'
                onPress={() => setModalVisible(true)}
                style={{ position: "absolute", right: 20, bottom: 40, width: 64, height: 64 }}
                iconHeight={40}
                iconWidth={40}
            />

            <ModalActivity visible={modalVisible} hideModal={() => setModalVisible(false)} />
        </Layout >
    )
}