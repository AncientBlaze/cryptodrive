import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const KYCPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        address: '',
        city: '',
        country: '',
        zipCode: '',
        documentType: 'passport',
        documentFront: null,
        documentBack: null,
        selfie: null,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        let newErrors = {};

        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.zipCode) newErrors.zipCode = 'Zip code is required';
        if (!formData.documentFront) newErrors.documentFront = 'Document front is required';
        if (!formData.selfie) newErrors.selfie = 'Selfie is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert('Success', 'KYC submitted successfully!');
        }, 2000);
    };

    const handleDocumentUpload = (type) => {
        // In real implementation, use ImagePicker or DocumentPicker
        Alert.alert('Info', 'Please install react-native-image-picker for actual document upload');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Identity Verification</Text>
            <Text style={styles.subHeader}>Complete your KYC verification</Text>

            {/* Personal Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <InputField
                    label="Full Name"
                    value={formData.fullName}
                    onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                    error={errors.fullName}
                    icon="person"
                />

                <InputField
                    label="Date of Birth (DD/MM/YYYY)"
                    value={formData.dob}
                    onChangeText={(text) => setFormData({ ...formData, dob: text })}
                    error={errors.dob}
                    icon="event"
                />

                <InputField
                    label="Address"
                    value={formData.address}
                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                    error={errors.address}
                    icon="home"
                />

                <View style={styles.row}>
                    <InputField
                        label="City"
                        value={formData.city}
                        onChangeText={(text) => setFormData({ ...formData, city: text })}
                        error={errors.city}
                        containerStyle={{ flex: 1, marginRight: 10 }}
                    />
                    <InputField
                        label="Zip Code"
                        value={formData.zipCode}
                        onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
                        error={errors.zipCode}
                        containerStyle={{ flex: 1 }}
                        keyboardType="numeric"
                    />
                </View>

                <InputField
                    label="Country"
                    value={formData.country}
                    onChangeText={(text) => setFormData({ ...formData, country: text })}
                    error={errors.country}
                    icon="public"
                />
            </View>

            {/* Document Upload */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Document Verification</Text>

                <DocumentUpload
                    label="Upload Front of Document"
                    onPress={() => handleDocumentUpload('documentFront')}
                    image={formData.documentFront}
                    error={errors.documentFront}
                />

                <DocumentUpload
                    label="Upload Back of Document"
                    onPress={() => handleDocumentUpload('documentBack')}
                    image={formData.documentBack}
                />

                <DocumentUpload
                    label="Upload Selfie with Document"
                    onPress={() => handleDocumentUpload('selfie')}
                    image={formData.selfie}
                    error={errors.selfie}
                />
            </View>

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.submitButtonText}>Submit Verification</Text>
                )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
                By submitting this form, you agree to our Terms of Service and Privacy Policy
            </Text>
        </ScrollView>
    );
};

const InputField = ({ label, icon, error, containerStyle, ...props }) => (
    <View style={[styles.inputContainer, containerStyle]}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.inputWrapper}>
            <Icon name={icon} size={20} color="#666" style={styles.inputIcon} />
            <TextInput
                style={styles.input}
                placeholderTextColor="#999"
                {...props}
            />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

const DocumentUpload = ({ label, onPress, image, error }) => (
    <View style={styles.uploadContainer}>
        <Text style={styles.uploadLabel}>{label}</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={onPress}>
            {image ? (
                <Image source={{ uri: image }} style={styles.uploadImage} />
            ) : (
                <Icon name="cloud-upload" size={40} color="#007AFF" />
            )}
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: '800',
        color: '#333',
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        color: '#666',
        fontSize: 14,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#333',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    uploadContainer: {
        marginBottom: 25,
    },
    uploadLabel: {
        color: '#666',
        fontSize: 14,
        marginBottom: 12,
    },
    uploadButton: {
        height: 150,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderStyle: 'dashed',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFF',
    },
    uploadImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: 4,
    },
    disclaimer: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 20,
        lineHeight: 18,
    },
});

export default KYCPage;