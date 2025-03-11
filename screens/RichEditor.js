import { useRef, useState, useEffect } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import DoneDialog from "./Utils/DoneDialog";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import HTMLView from "react-native-htmlview";
import { Feather } from "@expo/vector-icons";

export default function App({
  chooseImage,
  PDFFileUpload,
  imagerray,
  handlericheditortext,
  handleAddItem,
  setimagearray,
  filearray,
  setfilearray,
  audioarray,
  setaudioarray,
  AudioFileUpload,
  handleInputChange,
  contentFormdata,
  setVisible,
  visible,
  handleSave,
  showDialog,
  isSaveEnabled,
  initialContent,
}) {
  const richText = useRef();
  const inputref = useRef(null);

  useEffect(() => {
    inputref.current?.focus();
  }, []);

  useEffect(() => {
    if (initialContent && richText.current) {
      richText.current.setContentHTML(initialContent);
    }
  }, [initialContent]);

  const [showDescError, setShowDescError] = useState(false);

  const imageActionIcon = () => (
    <Feather name="image" size={16} color="black" />
  );
  const FileActionIcon = () => (
    <AntDesign name="addfile" size={16} color="black" />
  );
  const Audioaction = () => (
    <MaterialIcons name="audio-file" size={16} color="black" />
  );

  const richTextHandle = (descriptionText) => {
    if (descriptionText) {
      handlericheditortext(descriptionText);
      setShowDescError(false);
    } else {
      setShowDescError(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.richTextContainer}>
        <RichToolbar
          editor={richText}
          selectedIconTint="#873c1e"
          iconTint="#312921"
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.alignFull,
            actions.insertBulletsList,
            actions.insertOrderedList,
            "imageAction",
            "FileAction",
            "Audioaction",
            actions.undo,
            actions.redo,
          ]}
          iconSize={13}
          iconMap={{
            imageAction: imageActionIcon,
            FileAction: FileActionIcon,
            Audioaction: Audioaction,
          }}
          imageAction={chooseImage}
          FileAction={PDFFileUpload}
          Audioaction={AudioFileUpload}
          style={styles.richTextToolbarStyle}
          iconStyle={styles.toolbarIcon}
        />
        <RichEditor
          ref={richText}
          onChange={richTextHandle}
          placeholder="Write your content here..."
          androidHardwareAccelerationDisabled={true}
          style={styles.richTextEditorStyle}
          initialHeight={250}
        />
      </View>

      {showDescError && (
        <Text style={styles.errorTextStyle}>
          Your content shouldn't be empty 🤔
        </Text>
      )}

      <View className="flex flex-row items-center justify-around my-4">
        <TouchableOpacity
          className="bg-gray-100 hover:bg-blue-600 text-white font-bold w-2/5 h-10 rounded-md flex items-center justify-center mt-6"
          onPress={() => setVisible(false)}
        >
          <Text className="text-gray-800 tracking-wider">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showDialog}
          disabled={!isSaveEnabled()}
          className={`bg-blue-400 hover:bg-blue-600 text-white font-bold w-2/5 h-10 rounded-md flex items-center justify-center mt-6 ${!isSaveEnabled() && "opacity-40"}`}
        >
          <Text className="text-gray-50 tracking-wider">Save</Text>
        </TouchableOpacity>
      </View>

      <DoneDialog
        handleSave={handleSave}
        visible={visible}
        setVisible={setVisible}
        button="Ok"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "90%",
    backgroundColor: "#e4eef5",
    padding: 20,
    alignItems: "center",
    borderTopRightRadius: 5,
    borderBottomEndRadius: 5,
    borderBottomLeftRadius: 5,
  },

  headerStyle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#312921",
    marginBottom: 10,
  },

  htmlBoxStyle: {
    height: 200,
    width: 330,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },

  richTextContainer: {
    display: "flex",
    flexDirection: "column-reverse",
    width: "100%",
  },

  richTextEditorStyle: {
    fontSize: 20,
    marginBottom: 1.5,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },

  toolbarIcon: {
    borderWidth: 1,
    borderColor: "#b8c6d3",
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
  },

  richTextToolbarStyle: {
    backgroundColor: "#8ad2fd",
    borderColor: "#b8c6d3",
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 15,
  },

  errorTextStyle: {
    color: "#FF0000",
    marginBottom: 10,
  },
});
