import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Home, Login, MovieDetail, WatchList } from "../screen";
import { Profile } from "../screen/Profile";
import { backgroundBlack, white, yellow } from "../style";

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
            animationEnabled: false,
          }}
        />
        <Screen
          name="Home"
          component={Home}
          options={{
            title: "My Movie App",
            headerTitleAlign: "center",
            headerTitleStyle: { fontSize: 30, color: yellow },
            headerTransparent: false,
            headerShown: true,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: backgroundBlack },
            animationEnabled: false,
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
            animationEnabled: false,
          }}
        />
        <Screen
          name="Profile"
          component={Profile}
          options={{
            title: "Profile",
            headerTitleAlign: "center",
            headerTitleStyle: { fontSize: 30, color: yellow },
            headerShadowVisible: true,
            headerTintColor: white,
            headerTransparent: true,
            headerShown: true,
            headerStyle: { backgroundColor: backgroundBlack },

            animationEnabled: false,
          }}
        />
      </Navigator>
    </NavigationContainer>
  );
};
