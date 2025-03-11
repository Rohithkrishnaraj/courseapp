import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";

import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Home,
  Register,
  Profile,
  CourseList,
  Lesson,
  Units,
  ListsComponents,
  CouresForm,
  LessonForm,
  ContentForm,
  FinalView,
  Datepicker
} from "./screens";

const Stack = createNativeStackNavigator();

export default function App({}) {
  return (
    <SafeAreaView className="w-full h-full">
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="OneClick"
            component={CourseList}
            options={({ navigation }) => ({
              headerLeft: null,
              headerTitle: (props) => (
                <View className="flex flex-row justify-between items-center w-full pr-20 h-20">
                  <View className="flex flex-row">
                    <Image
                      source={require("./assets/AppIcon/AppIcon.png")}
                      className="w-9 h-9"
                    />
                    <View className="flex flex-col" />
                    <Text
                      {...props}
                      style={{
                        fontSize: 25,
                        fontWeight: "bold",
                        padding: 5,
                        borderRadius: 10,
                        letterSpacing: 3,
                      }}
                    >
                      {props.children}
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      onPress={() => navigation.navigate("CouresForm")}
                    >
                      <Text className="text-lg text-white font-medium tracking-wider">
                        Add Course
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Lesson"
            component={Lesson}
            options={{
              headerTitle: "Lessons"
            }}
          />
          <Stack.Screen
            name="Units"
            component={Units}
            options={{ headerTitle: "Units" }}
          />
          <Stack.Screen
            name="CouresForm"
            component={CouresForm}
            options={{ headerTitle: "Add Course" }}
          />
          <Stack.Screen
            name="LessonForm"
            component={LessonForm}
            options={{ headerTitle: " Add Lesson" }}
          />
          <Stack.Screen
            name="ContentForm"
            component={ContentForm}
            options={{ headerTitle: "Create New Content" }}
          />
          <Stack.Screen
            name="FinalView"
            component={FinalView}
            options={{ headerTitle: "Content" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
