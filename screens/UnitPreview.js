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
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import RenderHtml from 'react-native-render-html';
import { getAllExtras, getAllUnitsForLesson, updateUnit } from "../DB/DbStorage";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Speech from "expo-speech";

export default function UnitPreview({ route, navigation }) {
  const { unitId, lessonId, unitName, unitDescription } = route.params;
  const { height, width } = Dimensions.get("window");
  const [unitContent, setUnitContent] = useState([]);
  const [sound, setSound] = useState();
  const [soundAnimation, setSoundAnimation] = useState(false);
  const [selectedSongIndex, setSelectedSongIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [allUnits, setAllUnits] = useState([]);
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);

  // Define documentTypes at component level
  const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'application'];

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    fetchUnitContent();
  }, [unitId]);

  useEffect(() => {
    fetchAllUnits();
  }, [lessonId]);

  const fetchUnitContent = async () => {
    try {
      setLoading(true);
      const content = await getAllExtras(unitId);
      console.log("Fetched Unit Content:", content);
      setUnitContent(content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching unit content:', error);
      setLoading(false);
    }
  };

  const fetchAllUnits = async () => {
    try {
      const units = await getAllUnitsForLesson(lessonId);
      setAllUnits(units);
      const currentIndex = units.findIndex(unit => unit.id === unitId);
      setCurrentUnitIndex(currentIndex);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const speak = (thingToSay) => {
    const textContent = thingToSay.replace(/<[^>]+>/g, '');
    Speech.speak(textContent);
  };

  const playSound = async (audioUrl, id) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);
      setSelectedSongIndex(id);
      setSoundAnimation(true);
      await newSound.playAsync();
    } catch (error) {
      console.error("Failed to load sound", error);
    }
  };

  const pauseSound = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        setSoundAnimation(false);
      }
    } catch (error) {
      console.error("Failed to pause sound", error);
    }
  };

  const openDocumentWithURL = async (documentUrl) => {
    try {
      const contentUri = await FileSystem.getContentUriAsync(documentUrl);
      const fileType = documentUrl.split(".").pop().toLowerCase();
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
          case "txt":
            mimeType = "text/plain";
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
        default:
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

  const handleMarkComplete = async () => {
    try {
      await updateUnit(unitId, unitName, unitDescription, "bg-blue-200", "completed");
      setIsCompleted(true);
      Alert.alert(
        "Success",
        "Unit marked as completed!",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Error marking unit as complete:", error);
      Alert.alert("Error", "Failed to mark unit as complete");
    }
  };

  const navigateToUnit = (unit) => {
    if (sound) {
      sound.unloadAsync();
    }
    navigation.replace("UnitPreview", {
      unitId: unit.id,
      lessonId: lessonId,
      unitName: unit.name,
      unitDescription: unit.description,
    });
  };

  const goToNextUnit = () => {
    if (currentUnitIndex < allUnits.length - 1) {
      navigateToUnit(allUnits[currentUnitIndex + 1]);
    }
  };

  const goToPreviousUnit = () => {
    if (currentUnitIndex > 0) {
      navigateToUnit(allUnits[currentUnitIndex - 1]);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const imageContent = unitContent.filter(item => item.type?.includes('image'));
  const audioContent = unitContent.filter(item => item.type?.includes('audio'));
  const documentContent = unitContent.filter(item => 
    item.type && documentTypes.some(type => item.type.toLowerCase().includes(type))
  );
  const textContent = unitContent.filter(item => item.type?.includes('text'));

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        ListHeaderComponent={() => (
          <>
            {/* Hero Section with Unit Title and Description */}
            <View className="bg-white mb-4">
              <View className="px-4 pt-6 pb-8 border-b border-gray-100">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center flex-1">
                    <MaterialIcons name="school" size={28} color="#3B82F6" />
                    <Text className="text-2xl font-bold text-gray-800 ml-3">{unitName}</Text>
                  </View>
                </View>
                {/* Unit Progress Indicator */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-sm text-gray-600">
                    Unit {currentUnitIndex + 1} of {allUnits.length}
                  </Text>
                  <View className="flex-row items-center">
                    <View className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <View 
                        className="h-1 bg-blue-500 rounded-full" 
                        style={{ width: `${((currentUnitIndex + 1) / allUnits.length) * 100}%` }} 
                      />
                    </View>
                  </View>
                </View>
                {unitDescription && (
                  <View className="mt-3">
                    <View className="flex-row justify-between items-center mb-4">
                      <Text className="text-lg font-semibold text-gray-700">Overview</Text>
                      <TouchableOpacity
                        className="bg-blue-50 px-4 py-2 rounded-lg flex-row items-center"
                        onPress={() => speak(unitDescription)}
                      >
                        <MaterialIcons name="volume-up" size={20} color="#3B82F6" />
                        <Text className="ml-2 text-blue-600 font-medium">Listen</Text>
                      </TouchableOpacity>
                    </View>
                    <View className="bg-gray-50 rounded-xl p-5">
                      <RenderHtml
                        contentWidth={width - 48}
                        source={{ html: unitDescription }}
                        tagsStyles={{
                          p: { fontSize: 16, lineHeight: 24, color: '#374151' },
                          li: { fontSize: 16, lineHeight: 24, color: '#374151' }
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Learning Materials Section */}
            <View className="bg-white rounded-t-2xl mb-4">
              <View className="px-4 py-5 border-b border-gray-100">
                <Text className="text-xl font-bold text-gray-800">Learning Materials</Text>
                <Text className="text-gray-500 mt-1">Access your study resources below</Text>
              </View>

              {/* Images Gallery */}
              {imageContent.length > 0 && (
                <View className="px-4 py-5 border-b border-gray-100">
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                      <MaterialIcons name="collections" size={24} color="#4B5563" />
                      <Text className="text-lg font-semibold text-gray-800 ml-3">Visual Resources</Text>
                    </View>
                    <Text className="text-gray-500 text-sm">{imageContent.length} items</Text>
                  </View>
                  <View style={{ height: 280 }}>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      decelerationRate="fast"
                      snapToInterval={width * 0.65 + 16}
                      snapToAlignment="center"
                      data={imageContent}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => openDocumentWithURL(item.blob)}
                          className="mr-4 bg-gray-50 rounded-xl overflow-hidden shadow-sm"
                          style={{ width: width * 0.65 }}
                        >
                          <Image
                            source={{ uri: item.blob }}
                            style={{ height: 200 }}
                            className="w-full"
                            resizeMode="cover"
                          />
                          <View className="p-3">
                            <Text className="text-gray-800 font-medium text-base">{item.name}</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              )}

              {/* Audio Resources */}
              {audioContent.length > 0 && (
                <View className="px-4 py-5 border-b border-gray-100">
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                      <MaterialIcons name="headset" size={24} color="#4B5563" />
                      <Text className="text-lg font-semibold text-gray-800 ml-3">Audio Resources</Text>
                    </View>
                    <Text className="text-gray-500 text-sm">{audioContent.length} items</Text>
                  </View>
                  {audioContent.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      className="bg-blue-50 rounded-xl p-4 mb-3 flex-row items-center"
                      onPress={() => {
                        if (selectedSongIndex === item.id && soundAnimation) {
                          pauseSound();
                        } else {
                          playSound(item.blob, item.id);
                        }
                      }}
                    >
                      <View className="bg-blue-100 p-2 rounded-lg">
                        {selectedSongIndex === item.id && soundAnimation ? (
                          <MaterialIcons name="pause-circle-filled" size={32} color="#3B82F6" />
                        ) : (
                          <MaterialIcons name="play-circle-outline" size={32} color="#3B82F6" />
                        )}
                      </View>
                      <View className="ml-4 flex-1">
                        <Text className="text-gray-800 font-medium text-base">{item.name}</Text>
                        <Text className="text-gray-500 text-sm mt-1">
                          {selectedSongIndex === item.id && soundAnimation ? 'Playing...' : 'Tap to play'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Documents Section */}
              {documentContent.length > 0 && (
                <View className="px-4 py-5 border-b border-gray-100">
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                      <MaterialIcons name="description" size={24} color="#4B5563" />
                      <Text className="text-lg font-semibold text-gray-800 ml-3">Documents</Text>
                    </View>
                    <Text className="text-gray-500 text-sm">{documentContent.length} items</Text>
                  </View>
                  {documentContent.map((item) => {
                    let fileType = item.type.split('/').pop().toUpperCase();
                    if (fileType === 'VND.OPENXMLFORMATS-OFFICEDOCUMENT.WORDPROCESSINGML.DOCUMENT') {
                      fileType = 'DOCX';
                    }
                    return (
                      <TouchableOpacity
                        key={item.id}
                        className="bg-gray-50 rounded-xl p-4 mb-3 flex-row items-center border border-gray-100"
                        onPress={() => openDocumentWithURL(item.blob)}
                      >
                        <View className="bg-gray-100 p-3 rounded-xl">
                          <MaterialIcons 
                            name={fileType === 'PDF' ? 'picture-as-pdf' : 'article'} 
                            size={24} 
                            color={fileType === 'PDF' ? '#DC2626' : '#4B5563'} 
                          />
                        </View>
                        <View className="ml-4 flex-1">
                          <Text className="text-gray-800 font-medium text-base">{item.name}</Text>
                          <Text className="text-gray-500 text-sm mt-1">{fileType} Document</Text>
                        </View>
                        <MaterialIcons name="open-in-new" size={24} color="#9CA3AF" />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </>
        )}
        data={textContent}
        renderItem={({ item }) => (
          <View className="bg-white mb-4 px-4 py-5">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <MaterialIcons name="text-snippet" size={24} color="#4B5563" />
                <Text className="text-lg font-semibold text-gray-800 ml-3">Additional Content</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => openDocumentWithURL(item.blob)}
              className="bg-gray-50 rounded-xl p-5 border border-gray-100"
            >
              <Text className="text-gray-800 font-medium text-lg mb-3">{item.name}</Text>
              {/* <RenderHtml
                contentWidth={width - 64}
                source={{ html: item.blob }}
                tagsStyles={{
                  p: { fontSize: 16, lineHeight: 24, color: '#374151' },
                  li: { fontSize: 16, lineHeight: 24, color: '#374151' }
                }}
              /> */}
              <View className="mt-4 flex-row items-center">
                <MaterialIcons name="open-in-new" size={20} color="#6B7280" />
                <Text className="text-gray-500 ml-2">Open in viewer</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListFooterComponent={() => (
          <View className="px-4 py-6 bg-white">
            <TouchableOpacity
              onPress={handleMarkComplete}
              className={`w-full py-4 rounded-xl ${isCompleted ? 'bg-green-500' : 'bg-blue-500'} flex-row justify-center items-center`}
            >
              <MaterialIcons 
                name={isCompleted ? "check-circle" : "check-circle-outline"} 
                size={24} 
                color="white" 
              />
              <Text className="text-white font-semibold text-lg ml-2">
                {isCompleted ? "Completed!" : "Mark as Complete"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
      {/* Floating Navigation Buttons */}
      <View className="absolute bottom-0 left-0 right-0 flex-row justify-between px-4 pb-6 pointer-events-none">
        <TouchableOpacity
          onPress={goToPreviousUnit}
          disabled={currentUnitIndex === 0}
          className={`w-12 h-12 rounded-full ${
            currentUnitIndex === 0 ? 'bg-gray-200' : 'bg-blue-500'
          } items-center justify-center shadow-lg pointer-events-auto`}
        >
          <MaterialIcons 
            name="chevron-left" 
            size={32} 
            color={currentUnitIndex === 0 ? "#9CA3AF" : "#FFFFFF"} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={goToNextUnit}
          disabled={currentUnitIndex === allUnits.length - 1}
          className={`w-12 h-12 rounded-full ${
            currentUnitIndex === allUnits.length - 1 ? 'bg-gray-200' : 'bg-blue-500'
          } items-center justify-center shadow-lg pointer-events-auto`}
        >
          <MaterialIcons 
            name="chevron-right" 
            size={32} 
            color={currentUnitIndex === allUnits.length - 1 ? "#9CA3AF" : "#FFFFFF"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
