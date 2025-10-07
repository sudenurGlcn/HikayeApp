import { router } from 'expo-router';
import React, { useState } from 'react';
import { 
    ActivityIndicator, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    View, 
    Image, 
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { authService } from '../../services/api';
import { setAuthData, setError, setLoading } from '../../store/authSlice';

// Bu yolları kendi projenizdeki dosya yollarıyla güncelleyin
const AVATAR_IMAGE = require('../../assets/images/ebeveyn.png'); 
const EYE_ICON = require('../../assets/images/eye-icon.png');
const CLOUD_ICON = require('../../assets/images/guvenlik-uyarısı.png');

export default function RegisterScreen() {
    // Tasarıma uygun yeni state'ler eklendi
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state: any) => state.auth);

    // Doğrulama fonksiyonu yeni alanlara göre güncellendi
    const validateForm = () => {
        dispatch(setError(null)); // Hataları temizle
        if (!name || !surname || !email || !password || !passwordConfirm) {
            dispatch(setError('Lütfen tüm alanları doldurun'));
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            dispatch(setError('Lütfen geçerli bir e-posta adresi girin'));
            return false;
        }
        if (password.length < 6) {
            dispatch(setError('Şifre en az 6 karakter olmalıdır'));
            return false;
        }
        if (password !== passwordConfirm) {
            dispatch(setError('Şifreler uyuşmuyor'));
            return false;
        }
        return true;
    };

    const handleSignUp = async () => {
        if (!validateForm()) return;

        try {
            dispatch(setLoading(true));
            // Servisiniz sadece 'name' alıyorsa isim ve soyismi birleştirebilirsiniz
            const fullName = `${name} ${surname}`;
            const response = await authService.signup({ name: fullName, email, password });
            dispatch(setAuthData(response));
            router.replace('/(tabs)');
        } catch (err) {
            dispatch(setError('Kayıt başarısız. Lütfen tekrar deneyin.'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ThemedView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <Image source={AVATAR_IMAGE} style={styles.avatar} />
                    <ThemedText style={styles.title}>EBEVEYN HESAP BİLGİLERİ</ThemedText>
                    <View style={styles.titleUnderline} />

                    {error && (
                        <ThemedText style={styles.errorText}>{error}</ThemedText>
                    )}

                    {/* İsim ve Soyisim Alanları */}
                    <View style={styles.inputRow}>
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.label}>İsim</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="Zeynep"
                                placeholderTextColor="#BDBDBD"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.label}>Soyisim</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="Acar"
                                placeholderTextColor="#BDBDBD"
                                value={surname}
                                onChangeText={setSurname}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    {/* Mail Adresi Alanı */}
                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Mail Adresi</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="john@mail.com"
                            placeholderTextColor="#BDBDBD"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Parola Alanı */}
                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Parola</ThemedText>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                placeholder="parola"
                                placeholderTextColor="#BDBDBD"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Image source={EYE_ICON} style={styles.eyeIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* Parola Yeniden Alanı */}
                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Parola yeniden</ThemedText>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                placeholder="parola"
                                placeholderTextColor="#BDBDBD"
                                value={passwordConfirm}
                                onChangeText={setPasswordConfirm}
                                secureTextEntry={!isConfirmPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                <Image source={EYE_ICON} style={styles.eyeIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Güvenlik Uyarısı */}
                    <View style={styles.warningBox}>
                        <Image source={CLOUD_ICON} style={styles.warningIcon} />
                        {/* <View>
                            <ThemedText style={styles.warningTitle}>GÜVENLİK UYARISI</ThemedText>
                            <ThemedText style={styles.warningText}>Hesap şifrenizi çocuklarla paylaşmayın!</ThemedText>
                        </View> */}
                    </View>

                    {/* Üye Ol Butonu */}
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={handleSignUp}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <ThemedText style={styles.buttonText}>ÜYE OL</ThemedText>
                        )}
                    </TouchableOpacity>

                    {/* Giriş Yap Linki */}
                    <View style={styles.loginPromptContainer}>
                        <ThemedText style={styles.loginPromptText}>hesabın var mı? </ThemedText>
                        <TouchableOpacity onPress={() => router.push('/auth/login')}>
                            <ThemedText style={styles.loginPromptLink}>giriş yap</ThemedText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ThemedView>
        </KeyboardAvoidingView>
    );
};

// Tasarıma uygun yeni stiller
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8F9',
    },
    scrollContainer: {
        padding: 24,
        paddingTop: 40,
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4F4F4F',
        marginBottom: 24,
        textTransform: 'uppercase',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },
    inputWrapper: {
        width: '48%',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#828282',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingRight: 15,
    },
    eyeIcon: {
        width: 18,
        height: 18,
        tintColor: '#BDBDBD',
    },
    titleUnderline: {
        width: '100%',
        height: 1,
        backgroundColor: '#E0E0E0',
        marginBottom: 24,
    },
    warningBox: {
        height: 80,
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 24,
        width: '100%',
        borderWidth: 1,
        borderColor: '#F7F8F9',
        overflow: 'hidden',
        position: 'relative',
       
    },
    warningIcon: {
        width: '104%',
        height: '100%',
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 12,
    },
    warningTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#00796B',
    },
    warningText: {
        fontSize: 12,
        color: '#00796B',
    },
    button: {
        height: 55,
        backgroundColor: '#3ECCB4',
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    errorText: {
        color: '#EB5757',
        marginBottom: 15,
        textAlign: 'center',
    },
    loginPromptContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    loginPromptText: {
        fontSize: 14,
        color: '#828282',
    },
    loginPromptLink: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3ECCB4',
    },
});