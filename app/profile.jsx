import useIdStore from '../store/credentialStore';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import useThemeStore from '../store/themeStore';
import { Ionicons } from '@expo/vector-icons';

const profile = () => {
  const theme = useThemeStore((state) => state.theme);
  const id = useIdStore.getState().id;
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        Alert.alert('Error', 'User ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://really-classic-moray.ngrok-free.app/user/get/${id}`
        );
        setUserData(response.data.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, theme === 'dark' ? styles.darkLoadingContainer : styles.lightLoadingContainer]}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (!userData || userData.length === 0) {
    { console.log(userData) }
    return (
      <View style={[styles.errorContainer, theme === 'dark' ? styles.darkErrorContainer : styles.lightErrorContainer]}>
        <Text style={[styles.errorText, theme === 'dark' ? styles.darkErrorText : styles.lightErrorText]}>
          No user data found
        </Text>
      </View>
    );
  }

  const { username, email, phone, country, address, dateOfBirth, coin } = userData[0];

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  const dateOfBirthFormatted = new Date(dateOfBirth).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return (
    <ImageBackground
      source={theme === 'dark' ? require('../assets/images/bg-Dark.png') : require('../assets/images/bg.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={[styles.avatar, theme === 'dark' ? styles.darkAvatar : styles.lightAvatar]}>
            <Text style={styles.avatarText}>{getInitials(username)}</Text>
          </View>

          <Text style={[styles.name, theme === 'dark' ? styles.darkName : styles.lightName]}>{username}</Text>

          <TouchableOpacity style={[styles.coinContainer, theme === 'dark' ? styles.darkCoinContainer : styles.lightCoinContainer]}>
            <Image
              source={require('../assets/images/coinIcon.png')}
              style={{ width: 20, height: 20 }}
            />
            <Text style={styles.coinText}>{coin}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, theme === 'dark' ? styles.darkCard : styles.lightCard]}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="person-circle-outline"
              size={24}
              color={theme === 'dark' ? '#8F63FF' : '#7C3AED'}
            />
            <Text style={[styles.cardTitle, theme === 'dark' ? styles.darkCardTitle : styles.lightCardTitle]}>
              Personal Information
            </Text>
          </View>

          {[
            { label: 'Email', value: email, icon: 'mail-outline' },
            { label: 'Phone', value: phone, icon: 'call-outline' },
            { label: 'Country', value: country || 'N/A', icon: 'earth-outline' },
            { label: 'Address', value: address || 'N/A', icon: 'location-outline' },
            { label: 'Date of Birth', value: dateOfBirthFormatted || 'N/A', icon: 'calendar-outline' },
          ].map((item, index) => (
            <View key={index} style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={theme === 'dark' ? '#8F63FF' : '#7C3AED'}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.label, theme === 'dark' ? styles.darkLabel : styles.lightLabel]}>
                  {item.label}
                </Text>
                <Text style={[styles.value, theme === 'dark' ? styles.darkValue : styles.lightValue]}>
                  {item.value}
                </Text>
              </View>
              {index < 4 && <View style={[styles.divider, theme === 'dark' ? styles.darkDivider : styles.lightDivider]} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 5,
  },
  coinText: {
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 6,
    color: '#FFD700',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
    width: 32,
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginTop: 12,
  },

  
  darkLoadingContainer: {
    backgroundColor: '#0D0D0D',
  },
  darkErrorContainer: {
    backgroundColor: '#0D0D0D',
  },
  darkErrorText: {
    color: '#FF4D4D',
  },
  darkAvatar: {
    backgroundColor: '#6339F9',
    borderColor: '#8F63FF',
  },
  darkName: {
    color: '#FFF',
  },
  darkCoinContainer: {
    backgroundColor: '#2D2D2D',
  },
  darkCard: {
    backgroundColor: '#1A1A1A',
  },
  darkCardTitle: {
    color: '#FFF',
  },
  darkLabel: {
    color: '#999',
  },
  darkValue: {
    color: '#FFF',
  },
  darkDivider: {
    backgroundColor: '#333',
  },

  
  lightLoadingContainer: {
    backgroundColor: '#F5F5F5',
  },
  lightErrorContainer: {
    backgroundColor: '#F5F5F5',
  },
  lightErrorText: {
    color: '#EF4444',
  },
  lightAvatar: {
    backgroundColor: '#7C3AED',
    borderColor: '#A78BFA',
  },
  lightName: {
    color: '#1F2937',
  },
  lightCoinContainer: {
    backgroundColor: '#EDE9FE',
  },
  lightCard: {
    backgroundColor: '#FFF',
  },
  lightCardTitle: {
    color: '#1F2937',
  },
  lightLabel: {
    color: '#6B7280',
  },
  lightValue: {
    color: '#1F2937',
  },
  lightDivider: {
    backgroundColor: '#E5E7EB',
  },
});

export default profile;