import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

import { ContextProvider } from "./src/context/Context";
import { AppStack } from "./src/navigation/AppStack";

function App(): JSX.Element {
  return (
    <ContextProvider>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <AppStack />
      </KeyboardAvoidingView>
    </ContextProvider>
  );
}

export default App;
