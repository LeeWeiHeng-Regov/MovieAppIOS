import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Home, Login, MovieDetail, WatchList } from "../screen";
import { Profile } from "../screen/Profile";

const { Navigator, Screen } = createStackNavigator<TAppStackParamList>(); //Destructure the return method from createStackNavigator into two variable

export const AppStack = () => {
  return (
    <NavigationContainer>
      <Navigator>
        <Screen
          name="Login"
          component={Login}
          options={{
            title: "Login",
            headerTitleAlign: "center",
            headerTitleStyle: { fontSize: 30 },
            headerTransparent: false,
            headerShown: true,
          }}
        />
        <Screen
          name="Home"
          component={Home}
          options={{
            title: "My Movie App",
            headerTitleAlign: "center",
            headerTitleStyle: { fontSize: 30, color: "#0CFF00" },
            headerTransparent: false,
            headerShown: true,
            headerStyle: { backgroundColor: "black" },
          }}
        />
        <Screen
          name="MovieDetail"
          component={MovieDetail}
          options={{
            title: "MovieDetail",
            headerTitleAlign: "center",
            headerTitleStyle: { fontSize: 30 },
            headerTransparent: false,
            headerShown: false,
          }}
        />
        <Screen
          name="WatchList"
          component={WatchList}
          options={{
            title: "Watch List",
            headerTitleAlign: "center",
            headerTitleStyle: { fontSize: 30 },
            headerTransparent: false,
            headerShown: false,
          }}
        />
        <Screen
          name="Profile"
          component={Profile}
          options={{
            title: "Profile",
            headerTitleAlign: "center",
            headerTitleStyle: { fontSize: 30 },
            headerTransparent: false,
            headerShown: false,
          }}
        />
      </Navigator>
    </NavigationContainer>
  );
};
