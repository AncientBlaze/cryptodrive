import { useNavigation } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = () => {
  const [biometricEnabled, setBiometricEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = React.useState(false);
  const navigation = useNavigation();
  const handleLogout = () => {
    navigation.navigate('login');
  }
  const settingsSections = [
    {
      title: 'Account Settings',
      data: [
        {
          icon: 'person',
          title: 'Profile Information',
          action: () => navigation.navigate('profile'),
        },
        {
          icon: 'verified-user',
          title: 'KYC Verification',
          subtitle: 'Verified',
          action: () => navigation.navigate('KYC'),
        },
        {
          icon: 'lock',
          title: 'Change Password',
          action: () => navigation.navigate('ChangePassword'),
        },
      ],
    },
    {
      title: 'Security',
      data: [
        {
          icon: 'fingerprint',
          title: 'Biometric Login',
          component: (
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
          ),
        },
        {
          icon: 'security',
          title: 'Two-Factor Authentication',
          component: (
            <Switch
              value={twoFactorAuth}
              onValueChange={setTwoFactorAuth}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
          ),
        },
        {
          icon: 'device-unknown',
          title: 'Connected Devices',
          action: () => navigation.navigate('Devices'),
        },
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
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
          ),
        },
        {
          icon: 'language',
          title: 'App Language',
          subtitle: 'English',
          action: () => navigation.navigate('Language'),
        },
        {
          icon: 'attach-money',
          title: 'Default Currency',
          subtitle: 'USD',
          action: () => navigation.navigate('Currency'),
        },
      ],
    },
    {
      title: 'Wallet Settings',
      data: [
        {
          icon: 'account-balance-wallet',
          title: 'Wallet Addresses',
          action: () => navigation.navigate('WalletAddresses'),
        },
        {
          icon: 'backup',
          title: 'Backup Wallet',
          action: () => navigation.navigate('Backup'),
        },
        {
          icon: 'history',
          title: 'Transaction History',
          action: () => navigation.navigate('Transactions'),
        },
      ],
    },
    {
      title: 'Support & Legal',
      data: [
        {
          icon: 'help',
          title: 'Help Center',
          action: () => navigation.navigate('Help'),
        },
        {
          icon: 'description',
          title: 'Terms of Service',
          action: () => navigation.navigate('Terms'),
        },
        {
          icon: 'policy',
          title: 'Privacy Policy',
          action: () => navigation.navigate('Privacy'),
        },
      ],
    },
  ];

  const SettingItem = ({ icon, title, subtitle, component, action }) => (
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
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {settingsSections.map((section, index) => (
        <View key={index} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.data.map((item, itemIndex) => (
              <SettingItem
                key={itemIndex}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                component={item.component}
                action={item.action}
              />
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    color: '#333',
    fontWeight: '500',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
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
});

export default SettingsScreen;