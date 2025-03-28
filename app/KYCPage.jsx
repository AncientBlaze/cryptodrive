import { Formik } from 'formik';
import * as Yup from 'yup';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator, ToastAndroid } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast from 'react-hot-toast/headless';

const KYC_VALIDATION_SCHEMA = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  phone: Yup.string()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number')
    .required('Phone number is required'),
  dateOfBirth: Yup.string()
    .required('Date of birth is required')
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      'Invalid format (DD/MM/YYYY)'
    )
    .test('valid-date', 'Invalid date', (value) => {
      const [day, month, year] = value.split('/');
      const date = new Date(year, month - 1, day);
      return (
        date.getDate() === Number(day) &&
        date.getMonth() === Number(month) - 1 &&
        date.getFullYear() === Number(year)
      );
    })
    .test('not-future', 'Cannot be in the future', (value) => {
      const [day, month, year] = value.split('/');
      const date = new Date(year, month - 1, day);
      return date <= new Date();
    }),
  country: Yup.string().required('Country is required'),
  address: Yup.string().required('Address is required'),
});

const KycForm = () => {
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  }
  const handleSubmit = async (values) => {
    const userId = await AsyncStorage.getItem('userData');
    console.log(userId);
    
    try {
      if (!userId) {
        toast.error('User ID not found in AsyncStorage');
        throw new Error('User ID not found in AsyncStorage');
      }
      const response = await axios.post(`https://really-classic-moray.ngrok-free.app/user/${userId}/kyc`, values);
      showToast(`Success, ${response.data.message}`);

    } catch (error) {
      showToast(`Error, ${error}`);
    }
  }
  return (
    <ImageBackground
            source={require("../assets/images/bg-Dark.png")}
            style={styles.background}
          >
    <Formik
      initialValues={{
        username: '',
        phone: '',
        dateOfBirth: '',
        country: '',
        address: '',
      }}
      validationSchema={KYC_VALIDATION_SCHEMA}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
        <View style={styles.container}>
          <FormField
            label="Full Legal Name"
            value={values.fullName}
            onChangeText={handleChange('fullName')}
            error={errors.fullName}
            touched={touched.fullName}
          />
          <FormField
            label="Phone Number"
            value={values.phone}
            onChangeText={handleChange('phone')}
            keyboardType="phone-pad"
            error={errors.phone}
            touched={touched.phone}
          />
          <FormField
            label="Date of Birth"
            value={values.dateOfBirth}
            onChangeText={handleChange('dateOfBirth')}
            placeholder="DD/MM/YYYY"
            error={errors.dateOfBirth}
            touched={touched.dateOfBirth}
          />
          <FormField
            label="Country of Residence"
            value={values.country}
            onChangeText={handleChange('country')}
            error={errors.country}
            touched={touched.country}
          />
          <FormField
            label="Full Address"
            value={values.address}
            onChangeText={handleChange('address')}
            multiline
            numberOfLines={3}
            error={errors.address}
            touched={touched.address}
          />
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
    </ImageBackground>
  );
};

const FormField = ({ label, error, touched, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && touched && styles.errorInput]}
      placeholderTextColor="#999"
      {...props}
    />
    {touched && error && (
      <Text style={styles.errorText}>{error}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  errorInput: {
    borderColor: '#FF3B30',
  },
  submitButton: {
    backgroundColor: '#6339F9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});

export default KycForm;
