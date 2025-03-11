import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

export default function ContentText({
  handlePlusClick,
  count,
  chooseImage,
  image,
  AudioFileUpload,
  imageaddcount,
  PDFFileUpload,
  extradata,
  filecount,
  sountcount,
  imagerray,
  audioarray,
  filearray,
}) {
  // console.log("imgcount", imageaddcount);
  console.log("imhh", image);

  const images = imagerray.map((e) => e?.assets.map((er) => er.uri));
  const imageurl = images.flat();
  const imagecountoficon = images.length;

  const audios = audioarray.map((e) => e?.assets.map((er) => er));
  const audioCount = audios.length;
  const Files = filearray.map((e) => e?.assets.map((er) => er));
  const FilesCountoficons = Files.length;
  console.log(FilesCountoficons);

  return (
    <View className="flex flex-col">
      <View className="px-2 flex flex-row items-center py-4">
        <View className=" py-2 px-2 w-20">
          <Text className="text-lg font-medium">File</Text>
        </View>
        <View className="flex flex-row">
          {[...Array(filecount)].map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={async () => {
                await PDFFileUpload();
                // handlePlusClick();
              }}
              className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-md mx-2"
            >
              {index < FilesCountoficons ? (
                <FontAwesome5 name="file" size={24} color="black" />
              ) : (
                <AntDesign name="plus" size={24} color="#6a717f" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View className="px-2 flex flex-row items-center py-4">
        <View className=" py-2 px-2 w-20">
          <Text className="text-lg font-medium">Image</Text>
        </View>
        <View className="flex flex-row">
          {[...Array(imageaddcount)].map((_, index) => (
            <TouchableOpacity
              key={index}
              className={`w-8 h-8 bg-gray-300 flex items-center justify-center rounded-md mx-2 `}
              onPress={async () => {
                await chooseImage();
              }}
            >
              {index < imagecountoficon ? (
                <Image
                  source={{ uri: imageurl[index] }}
                  style={{ width: 24, height: 24 }}
                />
              ) : (
                <AntDesign name="plus" size={24} color="#6a717f" />
              )}

              {/* <AntDesign name="plus" size={24} color="#6a717f" /> */}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View className="px-2 flex flex-row items-center py-4">
        <View className=" py-2 px-2 w-20">
          <Text className="text-lg font-medium">Voice</Text>
        </View>
        <View className="flex flex-row">
          {[...Array(sountcount)].map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={async () => {
                await AudioFileUpload();
                // handlePlusClick();
              }}
              className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-md mx-2"
            >
              {index < audioCount ? (
                <MaterialIcons name="audiotrack" size={24} color="black" />
              ) : (
                <AntDesign name="plus" size={24} color="#6a717f" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
