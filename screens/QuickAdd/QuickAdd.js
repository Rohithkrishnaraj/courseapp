import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Datepicker from "../Forms/Datepicker";
import Reminder from "./Reminder";
import QuickNotes from "./QuickNotes";
import Map from "./Map";
import Youtube from "./Youtube";

export default function QuickAdd({ navigation }) {
  const AddOptions = [
    { Title: "Reminder", name: "reminder", Tag: MaterialCommunityIcons },
    { Title: "Quick Notes", name: "filetext1", Tag: AntDesign },
    { Title: "Maps", name: "map-pin", Tag: Feather },
    { Title: "YouTube", name: "youtube", Tag: MaterialCommunityIcons },
  ];
  const [expand, setexpand] = useState();
  const [tittle, settittle] = useState();
  const [item, setitem] = useState({
    Reminder: "",
  });
  const [time, setTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [itemarray, setitemarray] = useState([]);

  const handleexpand = (id, title) => {
    setexpand(id);
    settittle(title);
  };

  const handleInputChange = (key, value) => {
    setitem({
      ...item,
      [key]: value,
    });
  };

  const handlesubmit = () => {
    setitemarray((prev) => [...prev, { Reminder: item.Reminder }]);
    setitem("");
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(Platform.OS === "ios");
    setTime(
      currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };
  console.log(time);

  return (
    <View
      className=" w-4/5 bg-white  rounded-md mx-auto mt-10 "
      showsVerticalScrollIndicator={false}
    >
      <View className="py-3 w-11/12 mx-auto ">
        <View className=" w-full  flex flex-row items-center bg-blue-500   px-2 py-4 shadow-inner shadow-black rounded-md">
          <Text className="text-2xl text-gray-300 tracking-widest font-bold px-4">
            Instant Add an items
          </Text>
        </View>
        <ScrollView className="px-4 py-4 ">
          {AddOptions.map((e, index) => (
            <View>
              <TouchableOpacity
                className="flex flex-row items-center py-3"
                onPress={() => handleexpand(index, e.Title)}
              >
                <Feather name="plus" size={26} color="black" />
                <View className="flex flex-row items-center  px-4">
                  <e.Tag name={e.name} size={20} color="black" />
                  <Text className="text-xl px-2">{e.Title}</Text>
                </View>
              </TouchableOpacity>
              {expand == index && (
                <View>
                  {tittle == "Reminder" && (
                    <View>
                      <Reminder
                        handleInputChange={handleInputChange}
                        handlesubmit={handlesubmit}
                        toggleTimePicker={toggleTimePicker}
                        onChangeTime={onChangeTime}
                        time={time}
                        item={item}
                        itemarray={itemarray}
                        showTimePicker={showTimePicker}
                        setTime={setTime}
                      />
                    </View>
                  )}
                  {tittle == "Quick Notes" && (
                    <View>
                     <QuickNotes/>
                    </View>
                  )}
                  {tittle == "Maps" && (
                    <View>
                     <Map/>
                    </View>
                  )}
                    {tittle == "YouTube" && (
                    <View>
                     <Youtube/>
                    </View>
                  )}
                </View>
                
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
