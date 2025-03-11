import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import ListBox from "./Utils/ListBoxButton";
import { getAllUnitsForLesson, deleteUnit } from "../DB/DbStorage";
import HTMLView from "react-native-htmlview";
import Icon from "react-native-vector-icons/EvilIcons";

export default function Units({ navigation, route }) {
  const [searchText, setSearchText] = useState("");
  const [unitdata, setunitdata] = useState([]);

  const { LessonId } = route.params;

  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      fetchunitdata();
    });
    return focusHandler;
  }, [navigation]);

  const fetchunitdata = async () => {
    try {
      const fetch = await getAllUnitsForLesson(LessonId);
      setunitdata(fetch);
    } catch (err) {
      console.log("Error in unit fetch", err);
    }
  };

  const handleDelete = async (unitId, unitName) => {
    Alert.alert(
      "Delete Unit",
      `Are you sure you want to delete "${unitName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUnit(unitId);
              await fetchunitdata(); // Refresh the list after deletion
            } catch (error) {
              console.error("Error deleting unit:", error);
              Alert.alert("Error", "Failed to delete unit");
            }
          }
        }
      ]
    );
  };

  const handleEdit = (unit) => {
    navigation.navigate("ContentForm", {
      lessonid: LessonId,
      isEditing: true,
      unitData: unit
    });
  };

  const renderItems = ({ item }) => {
    const navigate = () => {
      navigation.navigate("FinalView", {
        unitid: item.id,
        LessonId: LessonId,
        unitname: item.name,
        unitDecsription: item.description,
      });
    };

    return (
      <TouchableOpacity
        className={`w-full flex flex-col items-center justify-center`}
      >
        <View 
          className={`w-4/5 mx-auto h-20 my-1 ${item.colour ? item.colour : "bg-teal-300"} rounded-md flex px-4 items-center`}
        >
          <View 
            className="flex flex-row justify-between  items-center w-full"
          >
            <TouchableOpacity 
              className="flex-1 " 
              onPress={navigate}
            >
              <Text
                className="text-xl text-left tracking-wider font-medium"
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </TouchableOpacity>

            <View 
              className="flex flex-row items-center gap-4"
            >
              <TouchableOpacity 
                onPress={() => handleEdit(item)}
              >
                <MaterialIcons name="edit" size={24} color="#4B5563" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleDelete(item.id, item.name)}
              >
                <MaterialIcons name="delete" size={24} color="#EF4444" />
              </TouchableOpacity>
              <AntDesign 
                name="right" 
                size={20} 
                color="#6a717f" 
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="h-full bg-gray-50">
      <View className="relative flex-row justify-evenly mt-4 mx-auto w-4/5">
        <View className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none -top-2">
          <Icon
            name="search"
            style={{
              width: 60,
              height: 60,
              fontSize: 40,
              textAlign: "left",
              alignItems: "center",
              padding: 12,
              color: "#d5d9dc",
            }}
          />
        </View>
        <TextInput
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          className="bg-transparent border border-gray-300 placeholder:tracking-widest hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xl h-12 w-full px-6 pl-16 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          placeholder="Search..."
          required
        />
      </View>

      <SafeAreaView className="w-full bg-gray-50 h-5/6 py-6">
        {unitdata && unitdata.length > 0 ? (
          <FlatList
            data={unitdata}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItems}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {unitdata === null ? (
              <>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
              </>
            ) : (
              <Text>No units available</Text>
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
