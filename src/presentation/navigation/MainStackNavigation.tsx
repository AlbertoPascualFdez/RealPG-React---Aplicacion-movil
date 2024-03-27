/* Esto serviria si no se quiere sustituir por completo la pantalla, sino que se quiere navegar
dentro de cada tab. De forma que al pulsar un boton no se cambia de pantalla, sino que se cambia
el contenido dle tab actual, permitiendo incluso la navegacion del topTab a otro tab */

/* import { createStackNavigator } from '@react-navigation/stack';
import { MainScreen } from '../screens/MainScreen';
import { PokemonListScreen } from '../screens/PokemonListScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { ActivityScreen } from '../screens/ActivityScreen';

export type RootMainStackParams = {
    MainScreen: undefined
    PokemonListScreen: undefined
    ShopScreen: undefined
    ActivityScreen: {activityId: number}
}

const Stack = createStackNavigator<RootMainStackParams>();

export const MainStackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown:false
      }}
      
    >
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="PokemonListScreen" component={PokemonListScreen} />
      <Stack.Screen name="ShopScreen"  options={{ headerShown: false }} component={ShopScreen} />
      <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
    </Stack.Navigator>
  );
} */