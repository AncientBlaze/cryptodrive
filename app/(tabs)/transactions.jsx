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
  Platform,
  RefreshControl
} from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import useThemeStore from "../../store/themeStore";
import { format } from "date-fns";
import useIdStore from "../../store/credentialStore.js";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

// Utility function for icon mapping
const getIconName = (type) => {
  switch (type.toLowerCase()) {
    case "deposit": return "arrow-down-circle";
    case "withdrawal": return "arrow-up-circle";
    case "transfer": return "repeat";
    case "payment": return "credit-card";
    default: return "activity";
  }
};

// Platform-aware toast
const showToast = (message) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    console.log("Toast:", message); // Replace with iOS alternative if needed
  }
};

const Transactions = () => {
  const { id } = useIdStore.getState();
  const theme = useThemeStore((state) => state.theme);
  const styles = getstyles(theme);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [photoUri, setPhotoUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);

  const [showRefresh, setShowRefresh] = useState(false);

  const themeStyles = useMemo(() => {
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
  }, [theme]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://209.126.4.145:4000/transactions/getById/${id}`
      );
      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setTransactions(sortedData);
      setError(null);
    } catch (err) {
      setError("Failed to load transactions. Pull down to refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShowRefresh((prev) => !prev);
    }, 10000); // Toggle every 10 seconds (you can adjust this as needed)
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

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

      if (result.assets?.length) {
        const file = result.assets[0];
        const newPath = `${FileSystem.cacheDirectory}${file.name}`;
        await FileSystem.copyAsync({ from: file.uri, to: newPath });

        const base64 = await FileSystem.readAsStringAsync(newPath, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const mime = file.mimeType || "image/jpeg";
        setUploadedImage(`data:${mime};base64,${base64}`);
        setPhotoName(file.name);
        setPhotoUri(file.uri);
      }
    } catch (error) {
      showToast("Failed to pick photo");
    }
  };

  const handleUploadProof = async () => {
    if (!uploadedImage) return;

    if (proofUploaded) {
      showToast("Proof already uploaded!"); // Show warning if proof is already uploaded
      return;
    }

    setUploading(true);
    try {
      await axios.put(
        `http://209.126.4.145:4000/transactions/uploadImage/${selectedTransaction._id}`,
        { image: uploadedImage }
      );
      setProofUploaded(true); // Mark as uploaded
      showToast("Proof uploaded successfully");
      closeModal();
      fetchTransactions(); // Refresh list
    } catch (err) {
      showToast("Failed to upload proof");
    } finally {
      setUploading(false);
    }
  };

  const renderTransaction = useCallback(({ item }) => {
    const approveColor = item.status ? themeStyles.approveColor : themeStyles.errorColor;

    return (
      <View style={[styles.transaction, { backgroundColor: themeStyles.cardBackground }]}>
        <Text style={[styles.idText, { color: themeStyles.secondaryText }]}>
          {item.buyer.fullName}
        </Text>
        <View style={styles.transactionDetails}>
          <View style={styles.detailColumn}>
            <View style={styles.rowAligned}>
              <Feather name={getIconName(item.type)} size={18} color={themeStyles.textColor} style={{ marginRight: 8 }} />
              <Text style={[styles.amountText, { color: themeStyles.textColor }]}>
                ${(parseFloat(item.amount) || 0).toFixed(2)}
              </Text>
            </View>
            <Text style={[styles.typeText, { color: themeStyles.secondaryText }]}>
              {item.type}
            </Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={[styles.statusText, { color: approveColor }]}>
              {item.status ? "✓ Completed" : "● Pending"}
            </Text>
            <Text style={[styles.dateText, { color: themeStyles.secondaryText }]}>
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
          <Text style={[styles.requestButtonText, { color: themeStyles.buttonText }]}>
            {item.status ? "View Proof" : "Upload Proof"}
          </Text>
        </Pressable>
      </View>
    );
  }, [theme]);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: themeStyles.secondaryText }]}>
        {error || "No transactions found"}
      </Text>
      {loading && <ActivityIndicator size="small" color={themeStyles.textColor} />}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={fetchTransactions}
        showsVerticalScrollIndicator={false}
        refreshControl={showRefresh ? (
          <RefreshControl refreshing={loading} onRefresh={fetchTransactions} />
        ) : null}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeStyles.cardBackground }]}>
            {selectedTransaction && (
              <>
                <Text style={[styles.modalTitle, { color: themeStyles.textColor }]}>Payment Proof</Text>
                <Text style={[styles.modalText, { color: themeStyles.textColor }]}>
                  <Text style={styles.modalLabel}>Amount:</Text> {selectedTransaction.amount} {selectedTransaction.currency}
                </Text>
                <Text style={[styles.modalText, { color: themeStyles.textColor }]}>
                  <Text style={styles.modalLabel}>Type:</Text> {selectedTransaction.type}
                </Text>
                <Text style={[styles.modalText, { color: themeStyles.textColor }]}>
                  <Text style={styles.modalLabel}>Date:</Text> {format(new Date(selectedTransaction.updatedAt), "dd MMM yyyy, HH:mm")}
                </Text>
                <Text style={[styles.modalText, { color: themeStyles.textColor }]}>
                  <Text style={styles.modalLabel}>Status:</Text> {selectedTransaction.status ? "Completed" : "Pending"}
                </Text>
                <Text style={[styles.modalText, { color: themeStyles.textColor }]}>
                  <Text style={styles.modalLabel}>Txn ID:</Text> {selectedTransaction._id.toUpperCase()}
                </Text>

                {!selectedTransaction.status && (
                  <>
                    <TouchableOpacity
                      onPress={handlePhotoPick}
                      style={styles.closeButton}
                      disabled={proofUploaded}
                    >
                      <Text style={styles.closeButtonText}>
                        {proofUploaded ? "Proof already uploaded" : "Upload Payment Proof"}
                      </Text>
                    </TouchableOpacity>
                    {uploadedImage && (
                      <Image
                        source={{ uri: uploadedImage }}
                        style={styles.proofImage}
                        resizeMode="cover"
                      />
                    )}
                    {uploadedImage && !proofUploaded && (
                      <TouchableOpacity
                        onPress={handleUploadProof}
                        style={[
                          styles.closeButton,
                          {
                            backgroundColor: themeStyles.buttonBackground,
                            marginTop: 20,
                            opacity: uploading ? 0.6 : 1,
                          },
                        ]}
                        disabled={uploading || proofUploaded}
                      >
                        <Text style={[styles.closeButtonText, { color: themeStyles.buttonText }]}>
                          {uploading ? "Uploading..." : "Submit Payment Proof"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}

                <TouchableOpacity onPress={closeModal} style={[styles.closeButton, { marginTop: 10 }]}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getstyles = (theme)=> StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    paddingBottom: 100,
    paddingTop: 16
  },
  transaction: {
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  transactionDetails: {
    flexDirection: "row", justifyContent: "space-between",
    marginTop: 10
  },
  detailColumn: {
    gap: 6
  },
  rowAligned: {
    flexDirection: "row",
    alignItems: "center"
  },
  idText: {
    fontSize: 13,
    fontWeight: "500"
  },
  amountText: {
    fontSize: 15,
    fontWeight: "600"
  },
  typeText: {
    fontSize: 12,
    fontWeight: "500"
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500"
  },
  dateText: {
    fontSize: 12,
    fontWeight: "400"
  },
  requestButton: {
    marginTop: 14, paddingVertical: 10,
    paddingHorizontal: 18, borderRadius: 8, alignItems: "center"
  },
  requestButtonText: {
    fontSize: 14,
    fontWeight: "500"
  },
  emptyContainer: {
    flex: 1, justifyContent: "center",
    alignItems: "center", gap: 10
  },
  emptyText: {
    fontSize: 16, fontWeight: "500",
    textAlign: "center"
  },
  modalOverlay: {
    flex: 1, justifyContent: "center",
    alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContent: {
    padding: 24, width: "80%",
    borderRadius: 12
  },
  modalTitle: {
    fontSize: 18, fontWeight: "600",
    marginBottom: 10
  },
  modalText: {
    fontSize: 15,
    marginBottom: 6
  },
  modalLabel: {
    fontWeight: "600"
  },
  proofImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 12
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme === "dark" ? "#BB86FC" : "#3B82F6",
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF"
  },
});

export default Transactions;
