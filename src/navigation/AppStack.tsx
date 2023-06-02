import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Detail, Home, Login, MovieDetail, Profile, WatchList } from "../screen";

const { Navigator, Group, Screen } = createStackNavigator<TAppStackParamList>(); //Destructure the return method from createStackNavigator into two variable

export const AppStack = () => {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
        <Screen name="Login" component={Login} />
        <Screen name="MovieDetail" component={MovieDetail} options={{ animationEnabled: true }} />
        <Group>
          <Screen name="Home" component={Home} />
          <Screen name="WatchList" component={WatchList} />
          <Screen name="Profile" component={Profile} />
          <Screen name="Detail" component={Detail} />
        </Group>
      </Navigator>
    </NavigationContainer>
  );
};
