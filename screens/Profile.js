import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Assets, Colors, RadioButton, RadioGroup } from "react-native-ui-lib";


export default function Profile({navigation}) {
  const GenderArray = [
    { url: require(`../assets/Profile/Male.png`), Name: "male" },
    { url: require(`../assets/Profile/Female.png`), Name: "female" },
  ];
  const [selected, setselected] = useState("");

  const [Profile, setProfile] = useState({
    name: "",
    gender: "",
  });
  
  const handleGender = (value) => {
    setProfile((prevProfile) => ({ ...prevProfile, gender: value }));
    setselected(value);
  };

  const handleName = (name) => {
    setProfile((prevProfile) => ({ ...prevProfile, name: name }));
  };

  console.log(Profile);

  return (
    <View className="my-28 w-full h-3/5  ">
      <View className="bg-white shadow-md w-4/5 mx-auto rounded-md px-4 py-4">
        <View className="py-4 flex-row items-center w-full  ">
          <Text className="text-gray-800 font-semibold text-xl tracking-wider">
            Name :
          </Text>
          <TextInput
            className="block w-3/5 rounded-md border border-gray-400 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-4 mb-1 mx-4 placeholder:tracking-widest"
            placeholder="Name"
            onChangeText={(value) => handleName(value)}
          />
        </View>
        <View className="py-4 flex-row items-center w-full  ">
          <Text className="text-gray-800 font-semibold text-xl tracking-wider">
            Gender :
          </Text>
          <View className="flex-row items-center px-2">
            {GenderArray.map((g) => (
              <TouchableOpacity
                className={`h-12 w-12 bg-[#9598ff] ${
                  selected === g.Name ? "bg-green-300 opacity-40" : ""
                } rounded-full mx-1 flex justify-center items-center`}
                onPress={() => handleGender(g.Name)}
                key={g.Name}
              >
                <Image source={g.url} className="w-9 h-9  " />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className="w-full items-center justify-center py-10">
          <TouchableOpacity
            className="bg-green-500 hover:bg-blue-600 text-white font-bold w-28 h-8 rounded-full flex items-center justify-center "
            onPress={() => navigation.navigate("Topics")}
          >
            <Text className="text-lg text-white font-medium">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
