import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  StyleSheet,
  TextInput,
  ImageBackground,
} from "react-native";
import axios from "axios";
import useIdStore from "../store/credentialStore";
import useThemeStore from "../store/themeStore";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import CountryDropdown from "../utils/CountryDropdown";
import { useNavigation } from "expo-router";

const KYC_VALIDATION_SCHEMA = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string()
    .matches(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      "Invalid phone number"
    )
    .required("Phone number is required"),
  dateOfBirth: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),
  country: Yup.string().required("Country is required"),
  address: Yup.string().required("Address is required"),
  document: Yup.string()
    .required("Document is required")
    .matches(/^data:.+;base64,.+$/, "Invalid file format"),
  photo: Yup.string()
    .required("Photo is required")
    .matches(/^data:.+;base64,.+$/, "Invalid image format"),
});

const KYCPage = () => {
  const navigation = useNavigation();
  const userId = useIdStore((state) => state.id);
  const theme = useThemeStore((state) => state.theme);
  const [documentName, setDocumentName] = useState(null);
  const [photoName, setPhotoName] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  console.log("Hello From Kyc", userId);

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  };

  const handleDocumentPick = async (setFieldValue) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
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

        const fullBase64 = `data:application/pdf;base64,${base64}`;
        setDocumentName(fileAsset.name);
        setFieldValue("document", fullBase64);
      }
    } catch (error) {
      console.error("File pick error:", error);
      showToast("Failed to pick document");
    }
  };

  const handlePhotoPick = async (setFieldValue) => {
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
        setFieldValue("photo", fullBase64);
      }
    } catch (error) {
      console.error("Photo pick error:", error);
      showToast("Failed to pick photo");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const fullName = `${values.firstName} ${values.lastName}`;
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status !== "granted") {
        showToast("Media library permission not granted");
        setSubmitting(false);
        return;
      }
      
      const kycResponse = await axios.put(
        `https://really-classic-moray.ngrok-free.app/user/${userId === undefined ? userId.id : userId}/kyc`,
        {
          fullName,
          phone: values.phone,
          dateOfBirth: values.dateOfBirth,
          country: values.country,
          address: values.address,
          file: values.document,
          photo: values.photo,
        }
      );
      
      if (kycResponse.status === 200) {
        showToast("KYC updated successfully");
        navigation.navigate("(tabs)");
      }

        await axios.put(
        `https://really-classic-moray.ngrok-free.app/user/${userId === undefined ? userId.id : userId}/updateAuthentication`,
        {
          authorized: "Pending",
        }
      );


    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      console.error("API Error:", errorMessage);
      showToast(`Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={
          theme === "dark"
            ? require("../assets/images/bg-Dark.png")
            : require("../assets/images/bg.png")
        }
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                phone: "",
                dateOfBirth: "",
                country: "",
                address: "",
                document: "",
                photo: "",
              }}
              validationSchema={KYC_VALIDATION_SCHEMA}
              onSubmit={handleSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
                setFieldValue,
              }) => (
                <View style={styles.formContainer}>
                  <Text style={styles.title}>Complete Verification</Text>

                  <InputField
                    label="First Name"
                    placeholder="John"
                    value={values.firstName}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    error={touched.firstName && errors.firstName}
                  />

                  <InputField
                    label="Last Name"
                    placeholder="Doe"
                    value={values.lastName}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    error={touched.lastName && errors.lastName}
                  />

                  <InputField
                    label="Phone Number"
                    placeholder="+91 1234567890"
                    value={values.phone}
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    keyboardType="phone-pad"
                    error={touched.phone && errors.phone}
                  />

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TouchableOpacity
                      style={styles.datePicker}
                      onPress={() =>
                        DateTimePickerAndroid.open({
                          value: values.dateOfBirth
                            ? new Date(values.dateOfBirth)
                            : new Date(),
                          onChange: (event, date) => {
                            if (event.type === "set") {
                              setFieldValue(
                                "dateOfBirth",
                                date.toISOString().split("T")[0]
                              );
                            }
                          },
                          mode: "date",
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.dateText,
                          { color: values.dateOfBirth ? "#333" : "#999" },
                        ]}
                      >
                        {values.dateOfBirth || "Select Date of Birth"}
                      </Text>
                    </TouchableOpacity>
                    {touched.dateOfBirth && errors.dateOfBirth && (
                      <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                    )}
                  </View>

                  <CountryDropdown
                    values={values}
                    setFieldValue={setFieldValue}
                    handleBlur={handleBlur}
                    touched={touched}
                    errors={errors}
                  />

                  <InputField
                    label="Full Address"
                    placeholder="123 Main St, New York, NY 10001"
                    value={values.address}
                    onChangeText={handleChange("address")}
                    onBlur={handleBlur("address")}
                    multiline
                    numberOfLines={3}
                    error={touched.address && errors.address}
                  />

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Upload ID Document (PDF)</Text>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() => handleDocumentPick(setFieldValue)}
                    >
                      <Text style={styles.buttonText}>
                        {documentName || "Choose Document"}
                      </Text>
                    </TouchableOpacity>
                    {touched.document && errors.document && (
                      <Text style={styles.errorText}>{errors.document}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Upload Photo</Text>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() => handlePhotoPick(setFieldValue)}
                    >
                      <Text style={styles.buttonText}>
                        {photoName || "Choose Photo"}
                      </Text>
                    </TouchableOpacity>
                    {touched.photo && errors.photo && (
                      <Text style={styles.errorText}>{errors.photo}</Text>
                    )}
                    {photoUri && (
                      <Image
                        source={{ uri: photoUri }}
                        style={styles.previewImage}
                        resizeMode="contain"
                      />
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>
                        Complete Verification
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  error,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      placeholder={placeholder}
      placeholderTextColor="#999"
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    color: "#111827",
  },

  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },

  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: 4,
  },

  datePicker: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F3F4F6",
  },

  dateText: {
    fontSize: 16,
  },

  uploadButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  uploaded: {
    backgroundColor: "#000",
    color: "#000",
  },

  previewImage: {
    width: "100%",
    height: 200,
    marginTop: 12,
    borderRadius: 12,
  },

  submitButton: {
    backgroundColor: "#6366F1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },

  buttonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fafafa",
    color: "#222",
  },
  errorText: {
    marginTop: 4,
    color: "#FF3B30",
    fontSize: 12,
    fontWeight: "500",
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#fafafa",
  },
  uploadButton: {
    backgroundColor: "#F0F0F0",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  uploaded: {
    backgroundColor: "#E5FCE5",
  },
  previewImage: {
    width: "100%",
    height: 200,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  submitButton: {
    backgroundColor: "#6339F9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 28,
    shadowColor: "#6339F9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});

export default KYCPage;
