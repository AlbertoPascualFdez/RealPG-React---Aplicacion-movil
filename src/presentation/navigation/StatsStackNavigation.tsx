/* import { createStackNavigator } from '@react-navigation/stack';
import { MainScreen } from '../screens/MainScreen';
import { PokemonListScreen } from '../screens/PokemonListScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { ActivitiesScreen } from '../screens/ActivitiesScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { CategoryStatsScreen } from '../screens/CategoryStatsScreen';

export type RootStatsStackParams = {
    StatsScreen: undefined
    ActivityScreen: {activityId: number}
    CategoryStatsScreen: {categoryId: number}
}

const Stack = createStackNavigator<RootStatsStackParams>();

export const StatsStackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown:false
      }}
    >
      <Stack.Screen name="StatsScreen" component={StatsScreen} />
      <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
      <Stack.Screen name="CategoryStatsScreen" component={CategoryStatsScreen} />
    </Stack.Navigator>
  );
} */