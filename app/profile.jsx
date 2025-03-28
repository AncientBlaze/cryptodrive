import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          
          setUserId(parsedData.id);
          console.log(parsedData.id);

          const response = await axios.get(
            `https://really-classic-moray.ngrok-free.app/user/${parsedData.id}`
          );

          setUserData(response.data);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (values) => {
    try {
      const response = await axios.patch(
        `https://really-classic-moray.ngrok-free.app/user/${userId}/kyc`,
        values
      );
      if (values.email !== userData?.email) {
        const updatedStorage = JSON.parse(await AsyncStorage.getItem('userData'));
        updatedStorage.email = values.email;
        await AsyncStorage.setItem('userData', JSON.stringify(updatedStorage));
      }

      setUserData(response.data);
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Update failed');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
    </ScrollView>
  );
};

const KycForm = ({ initialValues, onSubmit, onCancel }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().required('Required'),
    dateOfBirth: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
        <View style={styles.formContainer}>
          <FormField
            label="Full Name"
            icon="person"
            value={values.name}
            onChangeText={handleChange('name')}
            error={touched.name && errors.name}
          />

          <FormField
            label="Email"
            icon="email"
            value={values.email}
            onChangeText={handleChange('email')}
            keyboardType="email-address"
            error={touched.email && errors.email}
          />

          <FormField
            label="Phone Number"
            icon="phone"
            value={values.phone}
            onChangeText={handleChange('phone')}
            keyboardType="phone-pad"
            error={touched.phone && errors.phone}
          />

          <FormField
            label="Date of Birth"
            icon="event"
            value={values.dateOfBirth}
            onChangeText={handleChange('dateOfBirth')}
            placeholder="YYYY-MM-DD"
            error={touched.dateOfBirth && errors.dateOfBirth}
          />

          <FormField
            label="Country"
            icon="public"
            value={values.country}
            onChangeText={handleChange('country')}
            error={touched.country && errors.country}
          />

          <FormField
            label="Address"
            icon="home"
            value={values.address}
            onChangeText={handleChange('address')}
            multiline
            error={touched.address && errors.address}
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
};

const FormField = ({ label, icon, error, ...props }) => (
  <View style={styles.fieldContainer}>
    <View style={styles.labelContainer}>
      <Icon name={icon} size={20} color="#666" style={styles.fieldIcon} />
      <Text style={styles.fieldLabel}>{label}</Text>
    </View>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholderTextColor="#999"
      {...props}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const InfoItem = ({ icon, title, value, valueStyle }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIconContainer}>
      <Icon name={icon} size={20} color="#007AFF" />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  formContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default ProfileScreen;