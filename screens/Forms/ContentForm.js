import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Modal,
  StatusBar,
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
import { MaterialIcons } from "@expo/vector-icons";

export default function ContentForm({ navigation, route }) {
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
    const setupTables = async () => {
      try {
        await createUnitsTable();
        await createExtrasTable();
        console.log("Units and Extras tables created successfully");
      } catch (error) {
        console.error("Error creating tables:", error);
        Alert.alert("Error", "Failed to initialize database tables");
      }
    };
    
    setupTables();
  }, []);

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
    if (!richeditortext || !contentFormdata.ContentName) {
      Alert.alert("Error", "Please enter both unit name and description");
      return;
    }

    if (!lessonid) {
      Alert.alert("Error", "No lesson ID provided");
      return;
    }

    try {
      console.log("Creating unit with lessonId:", lessonid);
      
      const unitInsertionPromise = await insertUnit(
        lessonid,
        contentFormdata.ContentName.trim(),
        richeditortext.trim(),
        selectedColor,
        "draft"
      );

      if (!unitInsertionPromise) {
        throw new Error("Failed to insert unit");
      }

      console.log("Unit created successfully, now adding attachments...");

      const [imagesSuccess, audiosavesucess, FileSucess] = await Promise.all([
        insertMultipleExtras(),
        insertMultipleAudios(),
        insertMultiplefiles(),
      ]);

      if (imagesSuccess && audiosavesucess && FileSucess) {
        console.log("Unit and all attachments added successfully");
        setcontentFormdata({ ContentName: "" });
        setricheditortext("");
        navigation.goBack();
      } else {
        throw new Error("Failed to add one or more attachments");
      }
    } catch (error) {
      console.error("Error in handleAddItem:", error);
      Alert.alert(
        "Error",
        "Failed to create unit. Please try again."
      );
    }
  };

  // Replace the Dialog component with Modal implementation
  const ConfirmDialog = ({ visible, onDismiss, onConfirm, isEditing }) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onDismiss}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg w-4/5 p-4 shadow-xl" style={{ elevation: 5 }}>
            <Text className="text-xl font-semibold text-gray-900 mb-2">
              Confirm {isEditing ? 'Update' : 'Save'}
            </Text>
            <Text className="text-base text-gray-600 mb-4">
              Are you sure you want to {isEditing ? 'update' : 'save'} this unit?
            </Text>
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={onDismiss}
                className="px-4 py-2"
                accessible={true}
                accessibilityLabel="Cancel dialog"
                accessibilityRole="button"
              >
                <Text className="text-blue-500 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onConfirm}
                className="px-4 py-2"
                accessible={true}
                accessibilityLabel={isEditing ? "Confirm update" : "Confirm save"}
                accessibilityRole="button"
              >
                <Text className="text-blue-500 font-medium">{isEditing ? 'Update' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const AttachmentItem = ({ item, onRemove, type }) => {
    const getIcon = () => {
      switch (type) {
        case 'image':
          return <Feather name="image" size={24} color="#4B5563" />;
        case 'audio':
          return <MaterialIcons name="audio-file" size={24} color="#4B5563" />;
        case 'file':
          return <AntDesign name="file1" size={24} color="#4B5563" />;
        default:
          return <AntDesign name="file1" size={24} color="#4B5563" />;
      }
    };

    const getName = () => {
      if (type === 'image') {
        return item.assets[0].fileName || 'Image';
      }
      return item.assets[0].name || 'File';
    };

    return (
      <View className="flex-row items-center bg-gray-100 rounded-lg p-3 mb-2">
        <View className="mr-3">{getIcon()}</View>
        <Text className="flex-1 text-gray-700 text-sm" numberOfLines={1}>
          {getName()}
        </Text>
        <TouchableOpacity
          onPress={onRemove}
          className="p-2"
          accessible={true}
          accessibilityLabel={`Remove ${type}`}
          accessibilityHint={`Removes this ${type} from the attachments`}
        >
          <AntDesign name="close" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  const removeImage = (index) => {
    setimagearray(prev => prev.filter((_, i) => i !== index));
  };

  const removeAudio = (index) => {
    setaudioarray(prev => prev.filter((_, i) => i !== index));
  };

  const removeFile = (index) => {
    setfilearray(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white shadow-sm px-4 py-3 mb-4" style={{ elevation: 2 }}>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Unit' : 'Create New Unit'}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              Fill in the details below to {isEditing ? 'update' : 'create'} your unit
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleCancel}
            accessible={true}
            accessibilityLabel="Close form"
            accessibilityHint="Return to previous screen"
            className="p-2 rounded-full bg-gray-100"
          >
            <AntDesign name="close" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-t-lg px-4">
        <View className="py-4">
          <View className="flex flex-col">
            <Text className="text-base font-medium text-gray-900 mb-2">Unit Name</Text>
            <TextInput
              value={contentFormdata.ContentName}
              placeholder="Enter the unit name"
              onChangeText={(value) => handleInputChange("ContentName", value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 px-4 text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              style={{
                elevation: 1,
                minHeight: 48
              }}
              accessible={true}
              accessibilityLabel="Unit name input"
              accessibilityHint="Enter the name for your unit"
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-base font-medium text-gray-900 mb-2">Theme Color</Text>
          <PickColor 
            selectedColor={selectedColor} 
            onColorSelect={setSelectedColor} 
          />
        </View>

        <View className="flex-1">
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
            hideButtons={true}
          />

          {/* Attachments Section */}
          {(imagerray.length > 0 || audioarray.length > 0 || filearray.length > 0) && (
            <View className="mt-4 bg-gray-50 rounded-lg p-4">
              <Text className="text-base font-medium text-gray-900 mb-3">
                Attachments
              </Text>
              
              {imagerray.map((img, index) => (
                <AttachmentItem
                  key={`img-${index}`}
                  item={img}
                  type="image"
                  onRemove={() => removeImage(index)}
                />
              ))}
              
              {audioarray.map((audio, index) => (
                <AttachmentItem
                  key={`audio-${index}`}
                  item={audio}
                  type="audio"
                  onRemove={() => removeAudio(index)}
                />
              ))}
              
              {filearray.map((file, index) => (
                <AttachmentItem
                  key={`file-${index}`}
                  item={file}
                  type="file"
                  onRemove={() => removeFile(index)}
                />
              ))}
            </View>
          )}
        </View>

        <View className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <View className="flex-row justify-end space-x-3">
            <TouchableOpacity
              onPress={handleCancel}
              accessible={true}
              accessibilityLabel="Cancel"
              accessibilityHint="Discard changes and go back"
              className="px-6 py-2.5 rounded-lg bg-gray-100"
              style={{ minHeight: 48, justifyContent: 'center' }}
            >
              <Text className="text-gray-700 font-medium">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={showDialog}
              disabled={!isSaveEnabled()}
              accessible={true}
              accessibilityLabel={isEditing ? "Update unit" : "Save unit"}
              accessibilityHint={`Double tap to ${isEditing ? 'update' : 'save'} the unit`}
              className={`px-6 py-2.5 rounded-lg ${
                isSaveEnabled() ? 'bg-blue-500' : 'bg-blue-300'
              }`}
              style={{ minHeight: 48, justifyContent: 'center' }}
            >
              <Text className="text-white font-medium">
                {isEditing ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* <ConfirmDialog
        visible={visible}
        onDismiss={() => setVisible(false)}
        onConfirm={handleSave}
        isEditing={isEditing}
      /> */}
    </View>
  );
}
