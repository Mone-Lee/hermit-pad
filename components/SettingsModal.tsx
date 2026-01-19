import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { modalStyles } from '../styles/listScreen.styles';

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
            <MaterialIcons name="file-upload" size={24} color="black" />
            <Text style={modalStyles.settingsItemText}>导出数据</Text>
          </TouchableOpacity>

          <TouchableOpacity style={modalStyles.settingsItem} onPress={onImport}>
            <MaterialIcons name="file-download" size={24} color="black" />
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
