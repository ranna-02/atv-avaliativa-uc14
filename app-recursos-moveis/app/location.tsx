import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

const COLORS = {
    primary: '#0082FC',
    primaryDark: '#005AC1',
    secondary: '#9C27B0',
    dark: '#0F172A',
    body: '#475569',
    white: '#FFFFFF',
    background: '#F1F5F9',
    success: '#16A34A',
    error: '#EF4444',
    textLight: '#94A3B8'
};

export default function LocationScreen() {
    const router = useRouter();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const fetchLocation = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permissão de acesso à localização foi negada.');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        } catch (e) {
            setErrorMsg('Erro ao obter localização.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    const sendLocation = async () => {
        if (!location) return;

        setSending(true);
        const payload = {
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString(),
            dataHoraLocalizacao: new Date().toISOString()
        };

        try {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

            // Assuming the endpoint '/gps' or similar based on requirement to have endpoints for each resource
            // The prompt says: "receber do GPS os seguintes dados..."
            // I'll assume POST /gps
            const response = await fetch(`${apiUrl}/gps`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                Alert.alert("Sucesso", "Dados de localização enviados com sucesso!");
            } else {
                console.log('Failed:', response.status);
                // We show success anyway if it's just a mock/connectivity issue, but strict implementation would show error
                // However, since API might not be implemented by ME, I should handle graceful failure.
                // The prompt says: "envio das respostas da API para cada requisição deve ser uma mensagem de sucesso ou erro... que deve ser consumida..."

                const text = await response.text();
                try {
                    const json = JSON.parse(text);
                    Alert.alert("Resposta da API", JSON.stringify(json));
                } catch (e) {
                    Alert.alert("Erro", `Falha no envio: ${response.status}`);
                }
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível conectar à API.");
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Geolocalização</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.card}>
                    <View style={[styles.iconBox, { backgroundColor: '#F5F3FF' }]}>
                        <Ionicons name="map" size={40} color={COLORS.secondary} />
                    </View>
                    <Text style={styles.title}>Minha Posição</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color={COLORS.secondary} style={{ marginVertical: 20 }} />
                    ) : errorMsg ? (
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    ) : location ? (
                        <View style={styles.dataContainer}>
                            <View style={styles.dataRow}>
                                <Text style={styles.label}>Latitude:</Text>
                                <Text style={styles.value}>{location.coords.latitude}</Text>
                            </View>
                            <View style={styles.dataRow}>
                                <Text style={styles.label}>Longitude:</Text>
                                <Text style={styles.value}>{location.coords.longitude}</Text>
                            </View>
                            <View style={styles.dataRow}>
                                <Text style={styles.label}>Precisão:</Text>
                                <Text style={styles.value}>{location.coords.accuracy?.toFixed(1)} m</Text>
                            </View>
                            <View style={styles.dataRow}>
                                <Text style={styles.label}>Data:</Text>
                                <Text style={styles.value}>{new Date(location.timestamp).toLocaleString()}</Text>
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.infoText}>Toque em atualizar para obter a localização.</Text>
                    )}

                    <TouchableOpacity style={styles.refreshBtn} onPress={fetchLocation} disabled={loading}>
                        <Ionicons name="refresh" size={20} color={COLORS.white} />
                        <Text style={styles.refreshBtnText}>Atualizar GPS</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.sendBtn, (!location || sending) && styles.disabledBtn]}
                    onPress={sendLocation}
                    disabled={!location || sending}
                >
                    {sending ? <ActivityIndicator color={COLORS.white} /> : (
                        <>
                            <Ionicons name="cloud-upload-outline" size={24} color={COLORS.white} />
                            <Text style={styles.sendBtnText}>Enviar para API</Text>
                        </>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.dark,
    },
    content: {
        padding: 24,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
        marginBottom: 24,
    },
    iconBox: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 20,
    },
    dataContainer: {
        width: '100%',
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    label: {
        fontSize: 14,
        color: COLORS.body,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: COLORS.dark,
        fontWeight: 'bold',
    },
    errorText: {
        color: COLORS.error,
        textAlign: 'center',
        marginBottom: 20,
    },
    infoText: {
        color: COLORS.body,
        marginBottom: 20,
    },
    refreshBtn: {
        backgroundColor: COLORS.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        gap: 8,
    },
    refreshBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    sendBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        borderRadius: 20,
        gap: 12,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    disabledBtn: {
        backgroundColor: '#94A3B8',
        shadowOpacity: 0,
    },
    sendBtnText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
