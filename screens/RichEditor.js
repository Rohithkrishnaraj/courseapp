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
  hideButtons
}) {
  const richText = useRef();
  const [content, setContent] = useState(initialContent || '');
  const [showDescError, setShowDescError] = useState(false);

  useEffect(() => {
    if (initialContent && richText.current) {
      richText.current.setContentHTML(initialContent);
      setContent(initialContent);
    }
  }, [initialContent]);

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
    setContent(descriptionText);
    if (descriptionText && descriptionText.trim() !== '') {
      handlericheditortext(descriptionText);
      setShowDescError(false);
    } else {
      setShowDescError(true);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 rounded-lg overflow-hidden">
      <View className="flex-1 bg-white p-4">
        <View style={styles.richTextContainer}>
          <RichToolbar
            editor={richText}
            selectedIconTint="#2563EB"
            iconTint="#6B7280"
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.alignLeft,
              actions.alignCenter,
              actions.alignRight,
              actions.insertBulletsList,
              actions.insertOrderedList,
              "imageAction",
              "FileAction",
              "Audioaction",
            ]}
            iconSize={20}
            iconMap={{
              imageAction: imageActionIcon,
              FileAction: FileActionIcon,
              Audioaction: Audioaction,
            }}
            imageAction={chooseImage}
            FileAction={PDFFileUpload}
            Audioaction={AudioFileUpload}
            style={styles.richTextToolbarStyle}
          />
          <RichEditor
            ref={richText}
            onChange={richTextHandle}
            placeholder="Write your content here..."
            androidHardwareAccelerationDisabled={true}
            style={styles.richTextEditorStyle}
            initialHeight={200}
            editorStyle={{
              backgroundColor: '#ffffff',
              contentCSSText: 'font-size: 16px; min-height: 200px; padding: 8px;'
            }}
            useContainer={true}
            initialContentHTML={content}
            onFocus={() => setShowDescError(false)}
            pasteAsPlainText={true}
          />
        </View>

        {showDescError && (
          <Text style={styles.errorTextStyle}>
            Please enter some content for your unit
          </Text>
        )}
      </View>

      {!hideButtons && (
        <View className="flex-row justify-end space-x-3 p-4 bg-gray-50 border-t border-gray-200">
          <TouchableOpacity
            onPress={() => setVisible(false)}
            className="px-4 py-2"
          >
            <Text className="text-gray-600">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showDialog}
            disabled={!content.trim()}
            className={`px-4 py-2 ${!content.trim() && "opacity-40"}`}
          >
            <Text className="text-blue-500">Save</Text>
          </TouchableOpacity>
        </View>
      )}

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
  richTextContainer: {
    flex: 1,
    minHeight: 200,
    width: '100%',
  },

  richTextEditorStyle: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginTop: 8,
  },

  richTextToolbarStyle: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },

  errorTextStyle: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
  },
});
