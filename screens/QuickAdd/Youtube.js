import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

export default function Map() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [links, setLinks] = useState([]);

  const handleSaveLink = () => {
    if (youtubeLink.trim()) {
      setLinks([...links, youtubeLink]);
      setYoutubeLink("");
    }
  };

  return (
    <View className="border border-gray-300 rounded-md">
      <View className="py-6 px-4">
        <View className="flex flex-col ">
          <Text className="py-2">Youtube URL</Text>
          <TextInput
            value={youtubeLink}
            onChangeText={(value) => setYoutubeLink(value)}
            placeholder="URL link"
            className="block w-4/5 rounded-md border border-gray-400 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-1 mb-1"
          />
        </View>
      </View>
      <View className="flex flex-row items-center justify-center">
        {links.map((link, index) => (
          <View className="flex flex-row items-center justify-center" key={index}>
            <Text key={index} className="text-lg px-0"> {link}</Text>
            <AntDesign name="copy1" size={20} color="black" />
          </View>
        ))}
      </View>
      <View className="flex flex-row items-center justify-around my-4">
        <TouchableOpacity
          onPress={handleSaveLink}
          className="bg-gray-100 hover:bg-blue-600 text-white font-bold w-2/5 h-10 rounded-md flex items-center justify-center mt-6"
        >
          <Text className="text-gray-800 tracking-wider">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSaveLink}
          className="bg-blue-400 hover:bg-blue-600 text-white font-bold w-2/5 h-10 rounded-md flex items-center justify-center mt-6"
        >
          <Text className="text-gray-50 tracking-wider">Save</Text>
        </TouchableOpacity>
      </View>

      
    </View>
  );
}
