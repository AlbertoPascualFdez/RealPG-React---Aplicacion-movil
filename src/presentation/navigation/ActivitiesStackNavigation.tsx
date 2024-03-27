/* import { createStackNavigator } from '@react-navigation/stack';
import { MainScreen } from '../screens/MainScreen';
import { PokemonListScreen } from '../screens/PokemonListScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { ActivitiesScreen } from '../screens/ActivitiesScreen';
import { ActivityScreen } from '../screens/ActivityScreen';

export type RootActivitiesStackParams = {
    ActivitiesScreen: undefined
    ActivityScreen: {activityId: number}
}

const Stack = createStackNavigator<RootActivitiesStackParams>();

export const ActivitiesStackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown:false
      }}
    >
      <Stack.Screen name="ActivitiesScreen" component={ActivitiesScreen} />
      <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
    </Stack.Navigator>
  );
} */