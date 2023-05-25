import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";

import { justifyCenter, white } from "../style";

export const Loader = () => {
  return (
    <Modal transparent={true}>
      <View style={{ flex: 1, ...justifyCenter }}>
        <ActivityIndicator size={"large"} color={white} />
      </View>
    </Modal>
  );
};
