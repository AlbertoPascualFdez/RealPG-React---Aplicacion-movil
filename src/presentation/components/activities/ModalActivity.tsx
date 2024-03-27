import { Button, Card, Input, Layout, Modal, Text } from '@ui-kitten/components'
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { useActivitiesStore } from '../../store/useActivitiesStore';
import { useCategorySelect } from '../../hooks/useCategorySelect';

interface Props {
    visible: boolean,
    hideModal: () => void
}

export const ModalActivity = ({ visible, hideModal }: Props) => {

    const [activityName, setActivityName] = useState("");
    const { createActivity } = useActivitiesStore();

    const {displayValue, selectComponent} = useCategorySelect();

    const newActivity = () => {
        createActivity({
            name: activityName,
            id: -1,
            category: displayValue,
            totalTime: 0,
            sessions: []
        })
    }

    return (
        <Modal
            visible={visible}
            backdropStyle={styles.backdrop}
            style={styles.container}
            onBackdropPress={() => hideModal()}
        >
            <Card disabled={true} style={{}}>
                <Text style={{ marginBottom: 10 }}>
                    Crear una nueva actividad
                </Text>
                {/* <Select label={"Selecciona una categoria"} selectedIndex={selectedIndex}
                    onSelect={(index: any) => setSelectedIndex(index)} value={displayValue}>
                    {
                        Categories.map((category, index) => (
                            <SelectItem key={category} title={category} />
                        ))
                    }
                </Select> */}

                {selectComponent}

                <Input style={{ marginTop: 10 }} label={"Nombre de la actividad"} value={activityName} onChangeText={(value) => setActivityName(value)} />
                <Layout style={{ flex: 1, alignItems: "center" }}>
                    <Button
                        style={{ marginTop: 20, width: "50%" }}
                        onPress={() => {
                            hideModal();

                            newActivity();
                            setActivityName("");
                        }}>
                        Confirmar
                    </Button>
                </Layout>
            </Card>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "80%",
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    select: {
        marginVertical: 10
    }
});