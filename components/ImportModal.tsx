import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { importModalStyles } from '../styles/listScreen.styles';

interface ImportModalProps {
  visible: boolean;
  importData: string;
  onClose: () => void;
  onImportDataChange: (text: string) => void;
  onPaste: () => void;
  onConfirm: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  visible,
  importData,
  onClose,
  onImportDataChange,
  onPaste,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={importModalStyles.importModalOverlay}>
        <View style={importModalStyles.importModal}>
          <Text style={importModalStyles.importTitle}>导入数据</Text>
          <Text style={importModalStyles.importHint}>
            请粘贴之前导出的JSON数据
          </Text>

          <TextInput
            style={importModalStyles.importInput}
            value={importData}
            onChangeText={onImportDataChange}
            placeholder="粘贴JSON数据..."
            placeholderTextColor="#999"
            multiline
            keyboardType="default"
            textAlignVertical="top"
          />

          <View style={importModalStyles.importButtons}>
            <TouchableOpacity style={importModalStyles.pasteButton} onPress={onPaste}>
              <Text style={importModalStyles.pasteButtonText}>从剪贴板粘贴</Text>
            </TouchableOpacity>
          </View>

          <View style={importModalStyles.importActions}>
            <TouchableOpacity style={importModalStyles.cancelButton} onPress={onClose}>
              <Text style={importModalStyles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={importModalStyles.confirmButton} onPress={onConfirm}>
              <Text style={importModalStyles.confirmButtonText}>导入</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
