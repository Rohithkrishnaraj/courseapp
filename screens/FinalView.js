import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import HTMLView from "react-native-htmlview";
import RenderHtml from 'react-native-render-html';
import {
  getAllExtras,
  getAllunitsView,
  getAllUnitsForLesson,
} from "../DB/DbStorage";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as IntentLauncher from "expo-intent-launcher";
import * as Speech from "expo-speech";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested', // Suppresses the warning
]);

const customerReviews = [
  { name: "John Doe", review: "Great service, highly recommended!" },
  { name: "Alice Smith", review: "Excellent experience, very satisfied." },
  { name: "Bob Johnson", review: "Outstanding quality and support." },
  { name: "Emma Watson", review: "Fantastic service, exceeded expectations!" },
  {
    name: "Michael Brown",
    review: "Top-notch experience, will definitely return.",
  },
  { name: "Emily Jones", review: "Impressive quality and professionalism." },
];

export default function FinalView({ route }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { height, width } = Dimensions.get("window");
  const [ImageData, SetImageData] = useState([]);
  const [data, setdata] = useState([]);
  const [sound, setSound] = useState();
  const [sountnaimation, setsoundanimation] = useState(false);
  const [unittdata, setunitdata] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedsongindex, setselecetdsongindex] = useState(null);

  const { unitid, LessonId, unitname, unitDecsription } = route.params;
  console.log("unitid", unitid);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    FetchImage();
    Fetchdata();
    FetchUnitContent();
  }, []);

  const FetchUnitContent = async () => {
    try {
      const fetchdata = await getAllUnitsForLesson(LessonId);
      setunitdata(fetchdata);
      console.log("unidata fetch successfully");
    } catch (err) {
      console.log("unitdata fech error" + err);
    }
  };

  // console.log("fetch unitdata", unittdata);

  const speak = (thingToSay) => {
    const textContent = thingToSay.replace(/<[^>]+>/g, '');
    Speech.speak(textContent);
  };

  const FetchImage = async () => {
    if (unitid) {
      try {
        const fetch = await getAllExtras(unitid);
        SetImageData(fetch);
        console.log("fetch suceess from fetchimage");
      } catch (err) {
        console.log("show data", err);
      }
    }
    return null;
  };
  const Fetchdata = async () => {
    try {
      const fetch = await getAllunitsView();
      setdata(fetch);
    } catch (err) {
      console.log("show data", err);
    }
  };

  const playSound = async (audioUrl, id) => {
    console.log(audioUrl);
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(sound);
      setselecetdsongindex(id);
      setsoundanimation(true);
      await sound.playAsync();
    } catch (error) {
      console.error("Failed to load sound", error);
    }
  };

  const pauseSound = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        setsoundanimation(false);
      }
    } catch (error) {
      console.error("Failed to pause sound", error);
    }
  };

  const openDocumentWithURL = async (documentUrl) => {
    try {
      const contentUri = await FileSystem.getContentUriAsync(documentUrl);
      // console.log(contentUri);
      const fileType = documentUrl.split(".").pop().toLowerCase();
      console.log("fileType", fileType);
      let intentAction = "android.intent.action.VIEW";
      let mimeType = "";

      switch (fileType) {
        case "jpeg":
        case "jpg":
          mimeType = "image/jpeg";
          break;
        case "png":
          mimeType = "image/png";
          break;
        case "gif":
          mimeType = "image/gif";
          break;
        case "pdf":
          mimeType = "application/pdf";
          break;
        case "doc":
        case "docx":
          mimeType = "application/msword";
          break;
        case "mp3":
          mimeType = "audio/mpeg";
          break;
          case "txt":
            mimeType = "text/plain";
            break;
        default:
          intentAction = "android.intent.action.VIEW";
          mimeType = "*/*";
          break;
      }

      await IntentLauncher.startActivityAsync(intentAction, {
        data: contentUri,
        flags: 1,
        type: mimeType,
      });
    } catch (error) {
      console.error("Error opening document:", error);
    }
  };

  // console.log("ImageData", ImageData);

  // Assuming customerInputValue is the input value, e.g., 4.5
  const customerInputValue = 4.5;

  // Calculate the number of full stars
  const fullStars = Math.floor(customerInputValue);

  // Check if there's a half-filled star
  const hasHalfStar = customerInputValue % 1 !== 0;

  const renderItem = ({ item }) => {
    return (
      <View
        style={{ width: width }}
        className="rounded-md flex justify-center items-center"
      >
        <TouchableOpacity
          className=""
          onPress={() => openDocumentWithURL(item.blob)}
        >
          <Image
            source={{ uri: item.blob }}
            className="w-48 h-60 rounded-md"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const AudiorenderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#ADD8E6",
          padding: 10,
          borderRadius: 10,
          margin: 5,
        }}
        className="flex justify-evenly flex-row mx-auto w-4/5 items-center"
        onPress={() => {
          if (selectedsongindex === item.id && sountnaimation) {
            pauseSound();
          } else {
            playSound(item.blob, item.id);
          }
        }}
      >
        {selectedsongindex === item.id && sountnaimation ? (
          <View className="w-2/12">
            <MaterialIcons name="pause-circle-filled" size={24} color="black" />
          </View>
        ) : (
          <View className="w-2/12">
            <MaterialIcons name="play-circle-outline" size={24} color="black" />
          </View>
        )}
        <View className="w-8/12">
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const FilerenderItem = ({ item }) => {
    const mimeType = item.type;
    let cleanMimeType = mimeType.replace("application/", "");
    if (cleanMimeType === "vnd.openxmlformats-officedocument.wordprocessingml.document") {
      cleanMimeType = "docx";
    }
    return (
      <View
        className="w-32 h-32 bg-sky-200 mx-2 rounded-md flex justify-center items-center flex-col"
      >
        <View className="py-2">
          <Text numberOfLines={1} className="px-1">
            {item.name}
          </Text>
        </View>

        <TouchableOpacity
          className="text-white bg-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onPress={() => openDocumentWithURL(item.blob)}
        >
          <Text className="text-white">View</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView className="w-full h-full " nestedScrollEnabled={true}>
      <View className=" flex flex-col items-end ">
        <View className="flex flex-row items-center py-4 ">
          <View style={{ flexDirection: "row" }}>
            {[...Array(fullStars)].map((_, index) => (
              <FontAwesome key={`full-star-${index}`} name="star" size={20} color="#ffc24c" />
            ))}
            {hasHalfStar && (
              <FontAwesome key="half-star" name="star-half-full" size={20} color="#ffc24c" />
            )}
            {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
              <FontAwesome
                key={`empty-star-${index}`}
                name="star"
                size={20}
                color="#b8c6d3"
              />
            ))}
          </View>
          <Text className="px-2">4.5/5 rating</Text>
        </View>
        <View className=" w-full   bg-gray-100">
          <View className="w-full h-10 bg-gray-300 px-2 py-3 rounded-t-md">
            <Text className="text-sm font-medium">Images Added By You</Text>
          </View>
          <View style={{ width: width }} className="h-72 bg-gray-200">
            {ImageData && ImageData.length > 0 ? (
              <FlatList
                data={ImageData}
                keyExtractor={(item) => `image-${item.id}`}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                nestedScrollEnabled={true}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                windowSize={5}
                onScroll={(e) => {
                  const x = e.nativeEvent.contentOffset.x;
                  setSelectedIndex(Math.round(x / width));
                }}
              />
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <View className="">
                  <Text className="text-3xl text-gray-300">
                    No Image Content
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View className=" flex flex-wrap flex-row justify-center items-center py-2 bg-gray-200  ">
            {ImageData?.filter((Img) => Img.type == "image").map((item, index) => (
              <TouchableOpacity
                key={`image-dot-${item.id}`}
                className={`${
                  selectedIndex == index
                    ? " w-5 h-5   bg-gray-300"
                    : "w-5 h-5"
                }  flex justify-center items-center rounded-md  mx-1 border border-gray-300`}
              >
                <Text>{index}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className="w-full">
          <View className="py-2  ">
            <View className="pt-4 pb-2 flex justify-between flex-row px-4 ">
              <HTMLView
                value={unitname}
                textComponentProps={{
                  style: { fontSize: 21 },
                }}
              />
              <TouchableOpacity
                className="bg-gray-300 w-32 py-2  px-1.5 rounded-md flex-row justify-between items-center"
                onPress={() => speak(unitDecsription)}
              >
                  <MaterialIcons name="play-circle-outline" size={25} color="black" />
                <Text>Play Description</Text>
              </TouchableOpacity>
            </View>
            <View className="flex flex-row  items-center h-32 px-4 py-2 w-full">
              <HTMLView
                value={unitDecsription}
                className="w-full border  border-gray-300 h-32 px-2 py-1"
                textComponentProps={{
                  style: { fontSize: 21,textAlign: 'center',textAlign: 'left',textAlign: 'right'
                },
                }}
              />
            </View>

            <View className="w-full  py-6 ">
              <View className="w-full py-6 px-4">
                <Text className="text-lg font-bold whitespace-nowrap py-2 px-3 bg-gray-300 rounded-t-md">
                  Listen Podcast
                </Text>
                {ImageData &&
                ImageData.filter((audio) => audio.type === "audio/mpeg")
                  .length > 0 ? (
                  <View className="bg-gray-200 py-3 " style={{ height: 200 }}>
                    <FlatList
                      data={ImageData?.filter(
                        (audio) => audio.type === "audio/mpeg"
                      )}
                      renderItem={AudiorenderItem}
                      keyExtractor={(item) => `audio-${item.id}`}
                      scrollEnabled={true}
                      nestedScrollEnabled={true}
                      removeClippedSubviews={true}
                      maxToRenderPerBatch={5}
                      windowSize={5}
                    />
                  </View>
                ) : (
                  <View
                    className="flex justify-center items-center border-l border-r border-b border-gray-300 rounded-b-md"
                    style={{ height: 200 }}
                  >
                    <Text>No audio content available</Text>
                  </View>
                )}
              </View>
            </View>
            <View className="px-3 py-2">
              <Text className="text-lg font-bold whitespace-nowrap py-2 px-3 bg-gray-300 rounded-t-md">
                Attachments
              </Text>
              {ImageData?.filter(
                (File) =>
                  File.type === "application/pdf" ||
                  File.type === "text/plain" ||
                  File.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                  File.type === "application/msword"
              ) &&
              ImageData?.filter(
                (File) =>
                  File.type === "application/pdf" ||
                  File.type === "text/plain" ||
                  File.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                  File.type === "application/msword"
              ).length > 0 ? (
                <View className="py-3 flex flex-wrap flex-row border-r border-l border-b border-gray-300 rounded-b-md">
                  <FlatList
                    data={ImageData?.filter(
                      (File) =>
                        File.type === "application/pdf" ||
                        File.type === "text/plain" ||
                        File.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                        File.type === "application/msword"
                    )}
                    renderItem={FilerenderItem}
                    keyExtractor={(item) => `file-${item.id}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                  />
                </View>
              ) : (
                <View className="text-lg  py-3 px-3 h-28 border-r border-l border-b border-gray-300 rounded-b-md flex items-center justify-center">
                  <Text className="">No file content available</Text>
                </View>
              )}
            </View>

            <View className=" mt-10">
              <Text className="text-lg font-semibold tracking-wider py-2 px-4">
                Comments
              </Text>

              <View className="px-2 py-2 ">
                {customerReviews.map((review, index) => (
                  <View key={`review-${index}`} className="my-3 bg-gray-300 px-4 py-4 rounded-md">
                    <View className="w-10 h-10 bg-white rounded-full ">
                      <Image
                        source={require("../assets/Profile/Male.jpg")}
                        className="h-full w-full rounded-full"
                      />
                    </View>
                    <Text className="py-2">{review.name}</Text>
                    <Text>{review.review}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
