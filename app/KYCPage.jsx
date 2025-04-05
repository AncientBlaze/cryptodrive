import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import useIdStore from '../store/credentialStore';
import useThemeStore from '../store/themeStore';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import CountryDropdown from '../utils/CountryDropdown';
import { useNavigation } from 'expo-router';

const KYC_VALIDATION_SCHEMA = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  phone: Yup.string()
    .matches(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      'Invalid phone number'
    )
    .required('Phone number is required'),
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  country: Yup.string().required('Country is required'),
  address: Yup.string().required('Address is required'),
  document: Yup.string()
    .required('Document is required')
    .matches(
      /^data:.+;base64,.+$/,
      'Invalid file format'
    ),
});

const KYCPage = () => {
  const navigation = useNavigation();
  const userId = useIdStore((state) => state.id);
  const theme = useThemeStore((state) => state.theme);
  const [documentName, setDocumentName] = useState(null);

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  };

  const handleDocumentPick = async (setFieldValue) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const fileAsset = result.assets[0];

        // Copy to FileSystem cache (needed to convert content:// to file://)
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
        setFieldValue('document', fullBase64);
      }
    } catch (error) {
      console.error('File pick error:', error);
      showToast('Failed to pick document');
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!userId) {
      showToast('User ID not found');
      setSubmitting(false);
      return;
    }

    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        showToast('Media library permission not granted');
        setSubmitting(false);
        return;
      }
        const response = await axios.put(
        `https://really-classic-moray.ngrok-free.app/user/${userId.id}/kyc`,
        {
          "fullname": values.fullName,
          "phone": values.phone,
          "dateOfBirth": values.dateOfBirth,
          "country": values.country,
          "address": values.address,
          "file": values.document,
        }
      );
      console.log('API Response:', values.document);
      
      if (response.status === 200) {
        showToast('KYC updated successfully');
      }
      navigation.navigate("(tabs)");
      await axios.put(
        `https://really-classic-moray.ngrok-free.app/user/${userId.id}/updateauth`,
        { authorized: 'Pending' }
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred';
      console.error('API Error:', errorMessage);
      showToast(`Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ImageBackground
      source={
        theme === 'dark'
          ? require('../assets/images/bg-Dark.png')
          : require('../assets/images/bg.png')
      }
      style={styles.background}
    >
      <View style={styles.container}>
        <Formik
          initialValues={{
            fullName: '',
            phone: '',
            dateOfBirth: '',
            country: '',
            address: '',
            document: '',
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
                label="Full Legal Name"
                placeholder="John Doe"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                error={touched.fullName && errors.fullName}
              />
              <InputField
                label="Phone Number"
                placeholder="+91 1234567890"
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
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
                        if (event.type === 'set') {
                          setFieldValue('dateOfBirth', date.toISOString().split('T')[0]);
                        }
                      },
                      mode: 'date',
                    })
                  }
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: values.dateOfBirth ? '#333' : '#999',
                    }}
                  >
                    {values.dateOfBirth || 'Select Date of Birth'}
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
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                multiline
                numberOfLines={3}
                error={touched.address && errors.address}
              />
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Upload ID Document</Text>
                <TouchableOpacity
                  style={[styles.uploadButton, documentName && styles.uploaded]}
                  onPress={() => handleDocumentPick(setFieldValue)}
                >
                  <Text style={styles.buttonText}>
                    {documentName ? documentName : 'Choose Document'}
                  </Text>
                </TouchableOpacity>
                {touched.document && errors.document && (
                  <Text style={styles.errorText}>{errors.document}</Text>
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
                  <Text style={styles.buttonText}>Complete Verification</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ImageBackground>
  );
};

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  keyboardType = 'default',
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
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#222',
  },
  errorText: {
    marginTop: 4,
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '500',
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fafafa',
  },
  uploadButton: {
    backgroundColor: '#F0F0F0',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploaded: {
    backgroundColor: '#E5FCE5',
  },
  submitButton: {
    backgroundColor: '#6339F9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#6339F9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default KYCPage;
