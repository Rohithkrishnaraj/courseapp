import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import Dialog from "react-native-dialog";
import LottieView from "lottie-react-native";

export default function Dilaog({
  showDialog,
  handleCancel,
  handleSave,
  visible,
  setVisible,
  title,
  button,
}) {
  return (
    <Dialog.Container
      visible={visible}
      contentStyle={{
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Dialog.Title style={{ textAlign: "center" }}>
        <View style={{ width: 100, height: 100 }}>
          <LottieView
            source={require("../../assets/Done/Done.json")}
            style={{ width: 100, height: 100 }}
            autoPlay
            loop={false}
          />
        </View>
      </Dialog.Title>
      <Dialog.Description style={{ textAlign: "center" }}>
        Done
      </Dialog.Description>
      <Dialog.Button label={button} onPress={handleSave} />
    </Dialog.Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
