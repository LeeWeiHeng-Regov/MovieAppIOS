import React, { ReactNode } from "react";

import { ContextProvider } from "./src/context/Context";
import { AppStack } from "./src/navigation/AppStack";

function App(): JSX.Element {
  return (
    <ContextProvider>
      <AppStack />
    </ContextProvider>
  );
}

export default App;
