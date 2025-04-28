import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  ImageBackground,
  ToastAndroid,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useIdStore from '../../store/credentialStore';
import useThemeStore from '../../store/themeStore';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';

const PasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string()
    .min(6, 'Password too short!')
    .required('New password is required')
    .notOneOf([Yup.ref('oldPassword')], 'New password must be different'),
});

const SettingItem = React.memo(({ icon, title, subtitle, component, action, styles }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={action} disabled={!action}>
    <View style={styles.itemContent}>
      <Icon name={icon} size={24} color="#007AFF" style={styles.itemIcon} />
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {component || <Icon name="chevron-right" size={24} color="#ccc" />}
  </TouchableOpacity>
));

const SettingsScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [kyc, setKyc] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const navigation = useNavigation();
  const router = useRouter();
  const id = useIdStore((state) => state.id);

  const toggleModal = () => setModalVisible(!isModalVisible);
  const showToast = (message) => ToastAndroid.show(message, ToastAndroid.LONG);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://really-classic-moray.ngrok-free.app/user/get/${id.id === undefined ? id : id.id}`);
      const userData = response.data.data;
      if (userData?.length > 0) {
        setKyc(userData[0].authorized);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [id])
  );

  const handleLogout = () => {
    useIdStore.getState().clearId();
    useIdStore.getState().clearSession();
    setKyc(null);
    showToast('Logged out successfully');
    router.replace('/login');
  };

  const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (values.oldPassword === values.newPassword) {
        showToast('New password must be different');
        return;
      }

      await axios.put(`https://really-classic-moray.ngrok-free.app/user/${id.id === undefined ? id : id.id}/changePassword`, values);
      showToast('Password changed successfully');
      resetForm();
      toggleModal();
    } catch (error) {
      if (error.response?.status === 400) {
        showToast('Old password is incorrect');
      } else {
        showToast('Failed to change password');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const goToProfile = () => navigation.navigate('profile');
  const goToKYC = () => navigation.navigate('KYCPage');

  const settingsSections = [
    {
      title: 'Account Settings',
      data: [
        { icon: 'person', title: 'Profile Information', action: goToProfile },
        {
          icon: 'verified-user',
          title: 'KYC Verification',
          subtitle:
            kyc === 'Authorized' ? 'Verified' :
              kyc === 'Pending' ? 'Pending' : 'Not Verified',
          action: () => {
            kyc === 'Authorized'
              ? showToast('KYC already verified')
              : kyc === 'Pending'
                ? showToast('KYC status is being checked by Admin')
                : goToKYC();
          },
        },
        { icon: 'lock', title: 'Change Password', action: toggleModal },
      ],
    },
    {
      title: 'Preferences',
      data: [
        {
          icon: 'dark-mode',
          title: 'Dark Mode',
          component: (
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
          ),
        },
        { icon: 'language', title: 'App Language', subtitle: 'English', action: () => showToast('This feature is under development') },
        { icon: 'attach-money', title: 'Default Currency', subtitle: 'USD', action: () => showToast('This feature is under development') },
      ],
    },
    {
      title: 'Support & Legal',
      data: [
        { icon: 'feedback', title: "Chat With Us", action: () => navigation.navigate('chatWithUs') },
        { icon: 'help', title: 'Help Center', action: () => showToast('This feature is under development') },
        { icon: 'description', title: 'Terms of Service', action: () => showToast('This feature is under development') },
        { icon: 'policy', title: 'Privacy Policy', action: () => showToast('This feature is under development') },
      ],
    },
  ];

  return (
    <ImageBackground
      source={theme === 'dark' ? require('../../assets/images/bg-Dark.png') : require('../../assets/images/bg.png')}
      style={styles.background}
    >
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.data.map((item, i) => (
                <SettingItem key={i} {...item} styles={styles} />
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal without animation for testing */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        useNativeDriver
        backdropColor="rgba(0, 0, 0, 0.5)" // Optional: custom backdrop color
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Change Password</Text>
          <Formik
            initialValues={{ oldPassword: '', newPassword: '' }}
            validationSchema={PasswordSchema}
            onSubmit={handlePasswordSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => {
              const fields = [
                {
                  label: 'Old Password',
                  name: 'oldPassword',
                  value: values.oldPassword,
                  secure: !showOldPassword,
                  toggle: () => setShowOldPassword(!showOldPassword),
                  isVisible: showOldPassword,
                },
                {
                  label: 'New Password',
                  name: 'newPassword',
                  value: values.newPassword,
                  secure: !showNewPassword,
                  toggle: () => setShowNewPassword(!showNewPassword),
                  isVisible: showNewPassword,
                },
              ];

              return (
                <>
                  {fields.map((field, idx) => (
                    <View key={idx} style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder={field.label}
                        secureTextEntry={field.secure}
                        autoCapitalize="none"
                        onChangeText={handleChange(field.name)}
                        onBlur={handleBlur(field.name)}
                        value={field.value}
                        placeholderTextColor={theme === 'dark' ? '#aaa' : '#666'}
                      />
                      <TouchableOpacity style={styles.eyeButton} onPress={field.toggle}>
                        <Ionicons
                          name={field.isVisible ? 'eye-off' : 'eye'}
                          size={22}
                          color={theme === 'dark' ? '#fff' : '#333'}
                        />
                      </TouchableOpacity>
                      {touched[field.name] && errors[field.name] && (
                        <Text style={styles.errorText}>{errors[field.name]}</Text>
                      )}
                    </View>
                  ))}

                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
                    <Text style={styles.submitButtonText}>
                      {isSubmitting ? 'Submitting...' : 'Change Password'}
                    </Text>
                  </TouchableOpacity>
                </>
              );
            }}
          </Formik>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const createStyles = (theme) => StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: theme === 'dark' ? '#FFF' : '#333',
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'dark' ? '#888' : '#666',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  sectionContent: {
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === 'dark' ? 0.1 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#333' : '#eee',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: theme === 'dark' ? '#FFF' : '#333',
    fontWeight: '500',
  },
  itemSubtitle: {
    fontSize: 14,
    color: theme === 'dark' ? '#888' : '#666',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    borderRadius: 12,
    padding: 20,
    backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme === 'dark' ? '#FFF' : '#333',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 48,
    borderColor: theme === 'dark' ? '#555' : '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 42,
    marginBottom: 12,
    color: theme === 'dark' ? '#FFF' : '#333',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  errorText: {
    color: theme === 'dark' ? '#FF3B30' : 'red',
    marginBottom: 8,
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});


export default SettingsScreen;

