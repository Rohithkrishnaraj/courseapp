import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import PickColor from "../Utils/PickColor";
import { Feather } from '@expo/vector-icons';

export default function AddFolder() {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([]);
  const [selectedColor, setSelectedColor] = useState("bg-indigo-500"); // Set default color
  const inputref = useRef(null);

  useEffect(() => {
    inputref.current.focus();
  }, []);

  const handleAddItem = () => {
    if (!text.trim()) return; // Don't add empty notes
    
    const newItem = { 
      text: text, 
      description: description,
      color: selectedColor 
    };
    setItems([...items, newItem]);
    
    // Reset input fields but keep the selected color
    setText("");
    setDescription("");
  };

  return (
    <View className="bg-white rounded-md w-full border border-gray-300">
      <View className="flex flex-row items-center border-b">
        <View className="flex flex-col w-10/12 items-center">
          <TextInput
            ref={inputref}
            value={text}
            placeholder="Note Name"
            onChangeText={(value) => setText(value)}
            className="block w-4/5 rounded-md py-1.5 px-3 text-gray-900 placeholder:text-xl placeholder:text-center ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-1 mb-1"
          />
        </View>
        <TouchableOpacity>
          <AntDesign name="heart" size={24} color="#e4eef5" />
        </TouchableOpacity>
      </View>
      <View className="pb-2">
        <View className="flex flex-col">
          <TextInput
            multiline={true}
            numberOfLines={4}
            value={description}
            placeholder="Write your message"
            onChangeText={(value) => setDescription(value)}
            className="block w-full rounded-md placeholder:tracking-widest py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-1 mb-1"
          />
        </View>
      </View>
      <View className="text-base px-2 py-2 rounded-lg">
        {items.map((item, index) => (
          <View key={index}>
            <View className="flex flex-row items-center">
              <View className={`w-3 h-3 ${item.color} rounded-full`}></View>
              <View>
                <Text className="text-lg px-2">{item.text}</Text>
              </View>
            </View>
            <Text className="px-5">{item.description}</Text>
          </View>
        ))}
      </View>
      <View>
        <PickColor 
          selectedColor={selectedColor} 
          onColorSelect={setSelectedColor} 
        />
      </View>

      <View className="flex flex-row items-center justify-center my-4">
        <TouchableOpacity
          onPress={handleAddItem}
          disabled={!text.trim()}
          className={`bg-green-100 hover:bg-blue-600 text-white font-bold w-2/5 h-10 rounded-md flex items-center justify-center mt-6 ${!text.trim() && 'opacity-50'}`}
        >
          <Feather name="check" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
