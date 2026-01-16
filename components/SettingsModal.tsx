import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { modalStyles, importModalStyles } from '../styles/listScreen.styles';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  onExport,
  onImport,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity
        style={modalStyles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={modalStyles.settingsMenu}>
          <Text style={modalStyles.settingsTitle}>设置</Text>

          <TouchableOpacity style={modalStyles.settingsItem} onPress={onExport}>
            <Text style={modalStyles.settingsItemIcon}>📤</Text>
            <Text style={modalStyles.settingsItemText}>导出数据</Text>
          </TouchableOpacity>

          <TouchableOpacity style={modalStyles.settingsItem} onPress={onImport}>
            <Text style={modalStyles.settingsItemIcon}>📥</Text>
            <Text style={modalStyles.settingsItemText}>导入数据</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[modalStyles.settingsItem, modalStyles.settingsItemCancel]}
            onPress={onClose}
          >
            <Text style={modalStyles.settingsItemCancelText}>取消</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

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
