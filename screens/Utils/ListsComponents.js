import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React,{useState} from "react";
import { AntDesign } from "@expo/vector-icons";
import ListBox from "./ListBoxButton";
import Icon from "react-native-vector-icons/EvilIcons";


export default function ListsComponents({ data, selectedindex,navigation,handlenavigate}) {
  
    const [searchText, setSearchText] = useState("");
  const renderItems = ({ item, index }) => {
    return (
      <TouchableOpacity
        className={`w-full  flex flex-col items-center justify-center`} 
      >
        <ListBox classprops="w-4/5 mx-auto h-20 my-1 bg-blue-200 rounded-md flex px-4 justify-center items-center"  navigationprops={handlenavigate}>
          <View className="flex flex-row">
            <Text
              key={index}
              className="text-xl w-60 text-center tracking-wider font-medium"
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <TouchableOpacity>
              <AntDesign name="right" size={20} color="#6a717f" />
            </TouchableOpacity>
          </View>
        </ListBox>
        <View></View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="h-full bg-gray-50">
      <View className="relative flex-row justify-evenly mt-4  mx-2  ">
        <View className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none -top-2 ">
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
          className="bg-transparent border border-gray-300 placeholder:tracking-widest hover:bg-blue-800  focus:outline-none focus:ring-blue-300 font-medium rounded-md  text-xl h-12 w-full  px-6  pl-16 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          placeholder="Search..."
          required
        />
      </View>

      <SafeAreaView className="w-full bg-gray-50 h-5/6 py-10 mt-4">
        <FlatList
          data={data[selectedindex]}
          keyExtractor={(item) => item.count}
          renderItem={renderItems}
        />
      </SafeAreaView>
    </View>
  );
}
