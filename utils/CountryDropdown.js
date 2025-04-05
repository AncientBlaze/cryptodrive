import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import countriesList from 'world-countries';

const CountryDropdown = ({ values, setFieldValue, handleBlur, touched, errors }) => {
  const [countries, setCountries] = useState([{ label: 'Select your country', value: '' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const countryList = countriesList
          .map((country) => ({
            label: country.name.common,
            value: country.cca2,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCountries([{ label: 'Select your country', value: '' }, ...countryList]);
      } catch (error) {
        console.error('Error fetching country list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Country of Residence</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6339F9" />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={values.country}
            onValueChange={(itemValue) => setFieldValue('country', itemValue)}
            onBlur={handleBlur('country')}
            style={styles.picker}
            dropdownIconColor="#6339F9"
            mode="dropdown"
          >
            {countries.map((country) => (
              <Picker.Item key={country.value} label={country.label} value={country.value} />
            ))}
          </Picker>
        </View>
      )}
      {touched.country && errors.country && (
        <Text style={styles.errorText}>{errors.country}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  errorText: { color: 'red', fontSize: 14, marginTop: 5 },
});

export default CountryDropdown;

