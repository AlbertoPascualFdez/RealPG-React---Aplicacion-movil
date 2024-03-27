import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MainScreen } from '../screens/MainScreen';
import { ActivitiesScreen } from '../screens/ActivitiesScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { useTheme } from '@ui-kitten/components';

export type RootTabParams = {
    MainScreen: undefined,
    ActivitiesScreen: undefined
    StatsScreen: undefined
}

const Tab = createMaterialTopTabNavigator<RootTabParams>();

export const TopTabNavigation = () => {

  const theme = useTheme();

  return (
    <Tab.Navigator
        initialRouteName='MainScreen'
        screenOptions={{
          tabBarInactiveTintColor:theme[theme["text-disabled-color"]],
          tabBarActiveTintColor:theme["text-basic-color"]
        }}
    >
      <Tab.Screen options={{title:"Actividades"}} name="ActivitiesScreen" component={ActivitiesScreen} />
      <Tab.Screen options={{title:"Inicio"}} name="MainScreen" component={MainScreen} />
      <Tab.Screen options={{title:"estadisticas"}} name="StatsScreen" component={StatsScreen} />
    </Tab.Navigator>
  );
}
