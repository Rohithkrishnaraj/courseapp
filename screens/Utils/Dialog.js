import React, { useEffect, useState } from "react";
import { Button, StyleSheet, View, Dimensions } from "react-native";
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
  const { width, height } = Dimensions.get("window");



  useEffect(() => {
    if (visible) {
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 2500);
      
      return () => clearTimeout(timeoutId); // Clear the timeout when component unmounts or when the visibility changes
    }
  }, [visible, handleSave]);

  


  return (
    <Dialog.Container
      visible={visible}
      contentStyle={{
        width: width,
        height: height,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        borderWidth: 0,
      }}
    >
      <Dialog.Title style={{ textAlign: "center" }}>
        <View className="flex justify-center items-center w-64 h-64">
          <LottieView
            source={require("../../assets/Done/Done.json")}
            style={{ width: "100%", height: "100%" }}
            autoPlay
            loop={false}
          />
        </View>
      </Dialog.Title>
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
