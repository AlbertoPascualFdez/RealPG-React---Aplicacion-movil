import { createStackNavigator } from '@react-navigation/stack';
import { PokemonListScreen } from '../screens/PokemonListScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { TopTabNavigation } from './TopTabNavigation';
import { CategoryStatsScreen } from '../screens/CategoryStatsScreen';
import type { Activity } from '../../domain/entities/Activity';
import { TutorialScreen } from '../screens/TutorialScreen.tsx';
import { FirstPokemonScreen } from '../screens/FirstPokemonScreen.tsx';
import { usePokemonStore } from '../store/usePokemonStore.tsx';
import { useActivitiesStore } from '../store/useActivitiesStore.tsx';

export type RootGloabStackParams = {
    TopTabNavigation: undefined
    PokemonListScreen: undefined
    ShopScreen: undefined
    ActivityScreen: {activity: Activity}
    CategoryStatsScreen: {categoryName: string}
    TutorialScreen: undefined
    FirstPokemonScreen:undefined
}

const Stack = createStackNavigator<RootGloabStackParams>();

export const GloabStackNavigation = () => {
const {firstOpening} = useActivitiesStore()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown:false
      }}
      initialRouteName={firstOpening===1? "TopTabNavigation" : "TutorialScreen"}
    >
      <Stack.Screen name="TopTabNavigation" component={TopTabNavigation} />
      <Stack.Screen name="PokemonListScreen" component={PokemonListScreen} />
      <Stack.Screen name="ShopScreen"  options={{ headerShown: false }} component={ShopScreen} />
      <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
      <Stack.Screen name="CategoryStatsScreen" component={CategoryStatsScreen} />
      <Stack.Screen name="TutorialScreen" component={TutorialScreen} />
      <Stack.Screen name="FirstPokemonScreen" component={FirstPokemonScreen} />
    </Stack.Navigator>
  );
}