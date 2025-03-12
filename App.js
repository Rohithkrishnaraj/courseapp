import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Touchable,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createCoursesTable,
  createLessonsTable,
  createUnitsTable,
  createExtrasTable,
} from "./DB/DbStorage";
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
  Datepicker,
  LearningDashboard,
  CourseDetails,
  UnitPreview,
  Login,
  Signup,
  UserDashboard,
  Course,
} from "./screens";

const Stack = createNativeStackNavigator();

export default function App({}) {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await createCoursesTable();
        await createLessonsTable();
        await createUnitsTable();
        await createExtrasTable();
        console.log("All database tables initialized successfully");
      } catch (error) {
        console.error("Error initializing database:", error);
        Alert.alert(
          "Database Error",
          "Failed to initialize database. Please restart the app."
        );
      }
    };

    initializeDatabase();
  }, []);

  return (
    <SafeAreaView className="w-full h-full">
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Course"
            component={Course}
            options={({ navigation }) => ({
              headerLeft: null,
              headerTitle: (props) => (
                <View className="flex flex-row justify-between items-center w-full pr-20  h-20">
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
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LearningDashboard"
            component={LearningDashboard}
            options={{
              headerTitle: "My Learning",
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: '#F9FAFB',
              },
            }}
          />
          <Stack.Screen
            name="CourseDetails"
            component={CourseDetails}
            options={{
              headerTitle: "Course Details",
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: '#F9FAFB',
              },
            }}
          />
          <Stack.Screen
            name="CourseList"
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
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LessonForm"
            component={LessonForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ContentForm"
            component={ContentForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FinalView"
            component={FinalView}
            options={{ headerTitle: "Content" }}
          />
          <Stack.Screen
            name="UserDashboard"
            component={UserDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UnitPreview"
            component={UnitPreview}
            options={{
              headerTitle: "Unit Content",
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: '#F9FAFB',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
