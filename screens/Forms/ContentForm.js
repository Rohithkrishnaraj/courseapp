import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";

import { AntDesign } from "@expo/vector-icons";
import ContentText from "./ContentText";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import {
  createUnitsTable,
  insertUnit,
  updateUnit,
  insertExtra,
  createExtrasTable,
  getunitmax,
  getAllExtras,
} from "../../DB/DbStorage";
import Dialog from "../Utils/Dialog";
import RichEditor from "../RichEditor";
import HTMLView from "react-native-htmlview";
import PickColor from "../Utils/PickColor";

export default function AddFolder({ navigation, route }) {
  const [active, setactive] = useState("Text");
  const [count, setCount] = useState(1);
  const toggle = [
    { Title: "Text", name: "filetext1", Tag: AntDesign },
    { Title: "Youtube", name: "youtube", Tag: AntDesign },
    { Title: "Maps", name: "map-pin", Tag: Feather },
  ];

  const [Image, setImage] = useState([]);
  const [file, setfile] = useState([]);
  const [imageaddcount, setimageaddcount] = useState(1);
  const [filecount, setfilecount] = useState(1);
  const [sountcount, setsoundcount] = useState(1);
  const [sound, setSound] = useState([]);
  const [unitcount, setunitcount] = useState([]);
  const [File, setFile] = useState([]);
  const [extradata, setextradata] = useState([]);
  const [imagerray, setimagearray] = useState([]);
  const [audioarray, setaudioarray] = useState([]);
  const [filearray, setfilearray] = useState([]);
  const [richeditortext, setricheditortext] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("bg-indigo-500");

  const { lessonid, isEditing, unitData } = route.params;

  useEffect(() => {
    if (isEditing && unitData) {
      setcontentFormdata({
        ContentName: unitData.name || "",
      });
      setricheditortext(unitData.description || "");
      setSelectedColor(unitData.colour || "bg-indigo-500");
    }
  }, [isEditing, unitData]);

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    navigation.goBack();
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await updateUnit(
          unitData.id,
          contentFormdata.ContentName.trim(),
          richeditortext.trim(),
          selectedColor,
          "draft"
        );
      } else {
        await handleAddItem();
      }
      setVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving unit:", error);
      Alert.alert("Error", "Failed to save unit");
    }
  };

  const ImageLength = Image?.assets?.length;
  // console.log(Image);

  console.log("dlfkgk", unitData?.id);

  useEffect(() => {
    createUnitsTable();
    createExtrasTable();
  });

  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      fetchMaxID();
      FetchExtraData();
    });
    return focusHandler;
  }, [navigation]);

  const fetchMaxID = async () => {
    try {
      const fetchunits = await getunitmax(lessonid);
      setunitcount(fetchunits);
      console.log("fetchunits sucess");
    } catch (err) {
      console.log(err);
    }
  };

  const FetchExtraData = async () => {
    if (unitData?.id) {
      // console.log("from fetchimageunitidpara",unitid)
      try {
        const fetch = await getAllExtras(unitData.id);
        setextradata(fetch);
        console.log("fetch suceess from fetchimage");
      } catch (err) {
        console.log("show data", err);
      }
    }
    return null;
  };

  // console.log("extradata", extradata);

  const unitidforattachments = ((unitcount[0]?.MaxOfunits || 0) + 1) || 1;

  // console.log(unitcount);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //   allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result);
      setimagearray((prev) => [...prev, result]);
      if (imageaddcount < 5) {
        setimageaddcount((prevCount) => prevCount + 1);
      }
    }
  };

  const AudioFileUpload = async () => {
    let res = null;
    try {
      res = await DocumentPicker.getDocumentAsync({
        type: "audio/mpeg",
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!res.canceled) {
        setSound(res);
        setaudioarray((prev) => [...prev, res]);
        if (sountcount < 5) {
          setsoundcount((prevCount) => prevCount + 1);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const PDFFileUpload = async () => {
    let res = null;
    try {
      res = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!res.canceled) {
        setFile(res);
        setfilearray((prev) => [...prev, res]);
        if (filecount < 5) {
          setfilecount((prevCount) => prevCount + 1);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(sound);

  const HandleActivebar = (id) => {
    setactive(id);
  };

  const handlePlusClick = () => {
    if (count < 5) {
      setCount(count + 1);
    }
  };

  const [contentFormdata, setcontentFormdata] = useState({
    ContentName: "",
  });

  const insertMultipleExtras = async () => {
    try {
      const promises = imagerray.map(async (image) => {
        const { fileName, uri, type } = image.assets[0];
        await insertExtra(unitidforattachments, fileName, uri, type, "Draft");
      });
      await Promise.all(promises);
      console.log("All images added successfully");
      return true;
    } catch (error) {
      console.error("Error adding images:", error);
      return false;
    }
  };

  const insertMultipleAudios = async () => {
    try {
      const promises = audioarray.map(async (audio) => {
        const { name, uri, mimeType } = audio.assets[0];
        await insertExtra(unitidforattachments, name, uri, mimeType, "Draft");
      });
      await Promise.all(promises);
      console.log("All images audio successfully");
      return true;
    } catch (error) {
      console.error("Error adding audio:", error);
      return false;
    }
  };

  const insertMultiplefiles = async () => {
    try {
      const promises = filearray.map(async (file) => {
        const { name, uri, mimeType } = file.assets[0];
        await insertExtra(unitidforattachments, name, uri, mimeType, "Draft");
      });
      await Promise.all(promises);
      console.log("All images file successfully");
      return true;
    } catch (error) {
      console.error("Error adding file:", error);
      return false;
    }
  };

  const handlericheditortext = (id) => {
    setricheditortext(id);
    console.log("rich", id);
  };

  console.log("richiie", richeditortext);

  const isSaveEnabled = () => {
    return (
      contentFormdata.ContentName?.trim()?.length > 0 &&
      richeditortext?.trim()?.length > 0
    );
  };

  const handleInputChange = (key, value) => {
    setcontentFormdata({
      ...contentFormdata,
      [key]: value,
    });
  };

  const handleAddItem = async () => {
    if (richeditortext && contentFormdata.ContentName) {
      try {
        const unitInsertionPromise = await insertUnit(
          lessonid,
          contentFormdata.ContentName.trim(),
          richeditortext.trim(),
          selectedColor,
          "draft"
        );

        const imagesSavePromise = await insertMultipleExtras();
        const audiosave = await insertMultipleAudios();
        const filesave = await insertMultiplefiles();

        const [success, imagesSuccess, audiosavesucess, FileSucess] =
          await Promise.all([
            unitInsertionPromise,
            imagesSavePromise,
            audiosave,
            filesave,
          ]);

        if (success && imagesSuccess & audiosavesucess && FileSucess) {
          console.log("Unit added successfully");
          setcontentFormdata({ ContentName: "" });
          setricheditortext("");
        } else {
          console.log(
            "Failed to add unit. Insert unit success:",
            success,
            ", Save images success:",
            imagesSuccess
          );
        }
      } catch (error) {
        console.error("Error adding unit:", error);
        throw error;
      }
    }
  };

  return (
    <View className=" bg-white  rounded-md px-4 w-full  h-full">
      <View className="h-full">
        <View className="py-4 px-4">
          <View className="flex flex-col">
            <Text className="text-lg font-medium mb-2">Unit Name</Text>
            <TextInput
              value={contentFormdata.ContentName}
              placeholder="Enter the unit name"
              onChangeText={(value) => handleInputChange("ContentName", value)}
              className="block w-4/5 rounded-md border border-gray-400 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </View>
        </View>

        <View className="px-4 mb-4">
          <PickColor 
            selectedColor={selectedColor} 
            onColorSelect={setSelectedColor} 
          />
        </View>

        <RichEditor
          imagerray={imagerray}
          chooseImage={chooseImage}
          handlericheditortext={handlericheditortext}
          handleAddItem={handleAddItem}
          setimagearray={setimagearray}
          filearray={filearray}
          setfilearray={setfilearray}
          audioarray={audioarray}
          setaudioarray={setaudioarray}
          PDFFileUpload={PDFFileUpload}
          AudioFileUpload={AudioFileUpload}
          handleInputChange={handleInputChange}
          contentFormdata={contentFormdata}
          setVisible={setVisible}
          visible={visible}
          handleSave={handleSave}
          showDialog={showDialog}
          isSaveEnabled={isSaveEnabled}
          initialContent={isEditing ? unitData?.description : ""}
        />
      </View>
    </View>
  );
}
