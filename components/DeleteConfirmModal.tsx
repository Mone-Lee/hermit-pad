import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { deleteModalStyles } from '../styles/listScreen.styles';

interface DeleteConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onCancel}>
      <View style={deleteModalStyles.deleteModalOverlay}>
        <View style={deleteModalStyles.deleteModal}>
          <View style={deleteModalStyles.deleteIconContainer}>
            <MaterialIcons name="delete-outline" size={40} color="#FF3B30" />
          </View>
          <Text style={deleteModalStyles.deleteModalTitle}>确认删除事件</Text>
          <View style={deleteModalStyles.deleteModalActions}>
            <TouchableOpacity style={deleteModalStyles.deleteModalCancelButton} onPress={onCancel}>
              <Text style={deleteModalStyles.deleteModalCancelText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={deleteModalStyles.deleteModalConfirmButton}
              onPress={onConfirm}
            >
              <Text style={deleteModalStyles.deleteModalConfirmText}>确认</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
