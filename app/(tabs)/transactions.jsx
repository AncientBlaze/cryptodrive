import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
  Modal,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import useThemeStore from "../../store/themeStore";
import { format } from "date-fns";
import useIdStore from "../../store/credentialStore.js";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const Transactions = () => {
  const { id } = useIdStore.getState();
  const theme = useThemeStore((state) => state.theme);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [photoUri, setPhotoUri] = useState("");

  const getThemeStyles = () => {
    const isDark = theme === "dark";
    return {
      backgroundColor: isDark ? "#121212" : "#F9FAFB",
      textColor: isDark ? "#FFFFFF" : "#1F2937",
      cardBackground: isDark ? "#1E1E1E" : "#FFFFFF",
      approveColor: isDark ? "#32D74B" : "#22C55E",
      errorColor: isDark ? "#FF453A" : "#EF4444",
      secondaryText: isDark ? "#A1A1AA" : "#6B7280",
      buttonBackground: isDark ? "#BB86FC" : "#3B82F6",
      buttonText: "#FFFFFF",
    };
  };
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  };
  const fetchTransactions = async () => {
    try {
      const response = await axios.post(
        `https://really-classic-moray.ngrok-free.app/transactions/getById/${id}`
      );
      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setTransactions(sortedData);
      setError(null);
    } catch (err) {
      setError("Failed to load transactions. Pull down to refresh.");
      console.error("API Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const openProofModal = (transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
    setUploadedImage(null);
  };

  const handlePhotoPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png"],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const fileAsset = result.assets[0];
        const newPath = `${FileSystem.cacheDirectory}${fileAsset.name}`;
        await FileSystem.copyAsync({
          from: fileAsset.uri,
          to: newPath,
        });

        const base64 = await FileSystem.readAsStringAsync(newPath, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const mimeType = fileAsset.mimeType || "image/jpeg";
        const fullBase64 = `data:${mimeType};base64,${base64}`;
        setPhotoName(fileAsset.name);
        setPhotoUri(fileAsset.uri);
        setUploadedImage(fullBase64);
      }
    } catch (error) {
      console.error("Photo pick error:", error);
      showToast("Failed to pick photo");
    }
  };
  
  const handleUploadProof = async () => {
    if (!uploadedImage) {
      return;
    }
    try {
      const response = await axios.put(
        `https://really-classic-moray.ngrok-free.app/transactions/uploadImage/${selectedTransaction._id}`,
        {
          image: uploadedImage,
        }
      );
      showToast("Proof of payment uploaded successfully");
      closeModal();
    } catch (error) {
      console.error("Upload error:", error);
      showToast("Failed to upload proof of payment");
    }
  };
  const renderTransaction = useCallback(
    ({ item }) => {
      const themeStyles = getThemeStyles();
      const approveColor = item.status
        ? themeStyles.approveColor
        : themeStyles.errorColor;

      const getIconName = (type) => {
        switch (type.toLowerCase()) {
          case "deposit":
            return "arrow-down-circle";
          case "withdrawal":
            return "arrow-up-circle";
          case "transfer":
            return "repeat";
          case "payment":
            return "credit-card";
          default:
            return "activity";
        }
      };

      return (
        <View
          style={[
            styles.transaction,
            { backgroundColor: themeStyles.cardBackground },
          ]}
        >
          <Text style={[styles.idText, { color: themeStyles.secondaryText }]}>
            {item.buyer.fullName}
          </Text>
          <View style={styles.transactionDetails}>
            <View style={styles.detailColumn}>
              <View style={styles.rowAligned}>
                <Feather
                  name={getIconName(item.type)}
                  size={18}
                  color={themeStyles.textColor}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[styles.amountText, { color: themeStyles.textColor }]}
                >
                  ${(parseFloat(item.amount) || 0).toFixed(2)}
                </Text>
              </View>
              <Text
                style={[styles.typeText, { color: themeStyles.secondaryText }]}
              >
                {item.type}
              </Text>
            </View>
            <View style={styles.detailColumn}>
              <Text style={[styles.statusText, { color: approveColor }]}>
                {item.status ? "✓ Completed" : "● Pending"}
              </Text>
              <Text
                style={[styles.dateText, { color: themeStyles.secondaryText }]}
              >
                {format(new Date(item.updatedAt), "dd MMM yyyy, HH:mm")}
              </Text>
            </View>
          </View>
          <Pressable
            android_ripple={{ color: "#00000020" }}
            style={({ pressed }) => [
              styles.requestButton,
              {
                backgroundColor: themeStyles.buttonBackground,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            onPress={() => openProofModal(item)}
          >
            <Text
              style={[
                styles.requestButtonText,
                { color: themeStyles.buttonText },
              ]}
            >
              {item.status ? "View Proof" : "Upload Proof"}
            </Text>
          </Pressable>
        </View>
      );
    },
    [theme]
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text
        style={[styles.emptyText, { color: getThemeStyles().secondaryText }]}
      >
        {error || "No transactions found"}
      </Text>
      {loading && (
        <ActivityIndicator size="small" color={getThemeStyles().textColor} />
      )}
    </View>
  );

  const themeStyles = getThemeStyles();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeStyles.backgroundColor },
      ]}
    >
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={fetchTransactions}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: themeStyles.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: themeStyles.textColor }]}>
              Payment Proof
            </Text>
            {selectedTransaction && (
              <>
                <Text
                  style={[styles.modalText, { color: themeStyles.textColor }]}
                >
                  <Text style={styles.modalLabel}>Amount:</Text>{" "}
                  {selectedTransaction.amount} {selectedTransaction.currency}
                </Text>
                <Text
                  style={[styles.modalText, { color: themeStyles.textColor }]}
                >
                  <Text style={styles.modalLabel}>Type:</Text>{" "}
                  {selectedTransaction.type}
                </Text>
                <Text
                  style={[styles.modalText, { color: themeStyles.textColor }]}
                >
                  <Text style={styles.modalLabel}>Date:</Text>{" "}
                  {format(
                    new Date(selectedTransaction.updatedAt),
                    "dd MMM yyyy, HH:mm"
                  )}
                </Text>
                <Text
                  style={[styles.modalText, { color: themeStyles.textColor }]}
                >
                  <Text style={styles.modalLabel}>Status:</Text>{" "}
                  {selectedTransaction.status ? "Completed" : "Pending"}
                </Text>
                <Text
                  style={[styles.modalText, { color: themeStyles.textColor }]}
                >
                  <Text style={styles.modalLabel}>Txn ID:</Text>{" "}
                  {selectedTransaction._id.toUpperCase()}
                </Text>

                {!selectedTransaction.status && (
                  <>
                    <TouchableOpacity
                      onPress={handlePhotoPick}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>
                        Upload Payment Proof
                      </Text>
                    </TouchableOpacity>
                    {uploadedImage && (
                      <Image
                        source={{ uri: uploadedImage }}
                        style={{
                          width: "100%",
                          height: 200,
                          marginTop: 10,
                          borderRadius: 10,
                        }}
                        resizeMode="cover"
                      />
                    )}
                  </>
                )}
            <TouchableOpacity
            onPress={handleUploadProof}
            style={[
              styles.closeButton,
              {
                backgroundColor: themeStyles.buttonBackground,
                marginTop: 20,
              },
            ]}              
            >
              <Text style={[styles.closeButtonText, { color: themeStyles.buttonText }]}>
                Submit Payment Proof
              </Text>
            </TouchableOpacity>
            </>
            )}
            <TouchableOpacity
              onPress={closeModal}
              style={[styles.closeButton, { marginTop: 10 }]}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: 100,
    paddingTop: 16,
  },
  transaction: {
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  detailColumn: {
    gap: 6,
  },
  idText: {
    fontSize: 13,
    fontWeight: "500",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "600",
  },
  typeText: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  statusText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "right",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "400",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  rowAligned: {
    flexDirection: "row",
    alignItems: "center",
  },
  requestButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  requestButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 15,
    marginBottom: 8,
  },
  modalLabel: {
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default Transactions;
