import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Bluetooth Premium Brand Colors (Same as index.tsx)
const COLORS = {
  primary: '#0082FC',
  primaryDark: '#005AC1',
  secondary: '#9C27B0',
  secondaryLight: '#F3E5F5',
  accent: '#00D4FF',
  dark: '#0F172A',
  body: '#475569',
  white: '#FFFFFF',
  background: '#F1F5F9',
};

export default function DocsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guia de Uso</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Intro */}
        <View style={styles.introSection}>
          <Text style={styles.sectionLabel}>DOCUMENTAÇÃO</Text>
          <Text style={styles.mainTitle}>Como utilizar os recursos do App Recursos</Text>
          <Text style={styles.mainSubtitle}>
            Siga este guia prático para extrair o máximo das funcionalidades nativas integradas.
          </Text>
        </View>

        {/* Step 1: Camera */}
        <View style={styles.docCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
            <Ionicons name="camera" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.docContent}>
            <Text style={styles.docTitle}>1. Câmera & Mídia</Text>
            <Text style={styles.docText}>
              Acesse a câmera permitindo as permissões de hardware. Ao capturar uma foto, a imagem é convertida automaticamente para <Text style={styles.bold}>Base64</Text>, garantindo compatibilidade para salvamento direto no banco de dados.
            </Text>
            <View style={styles.tipBox}>
              <Text style={styles.tipText}>Dica: Certifique-se de estar em um ambiente iluminado para melhor resolução.</Text>
            </View>
          </View>
        </View>

        {/* Step 2: GPS */}
        <View style={styles.docCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#F5F3FF' }]}>
            <Ionicons name="location" size={24} color={COLORS.secondary} />
          </View>
          <View style={styles.docContent}>
            <Text style={styles.docTitle}>2. Geolocalização</Text>
            <Text style={styles.docText}>
              Utilizamos a API de localização em tempo real. O sistema captura <Text style={styles.bold}>Latitude e Longitude</Text> com precisão de metros, anexando um selo de tempo (timestamp) de segurança a cada leitura.
            </Text>
          </View>
        </View>

        {/* Step 3: Network */}
        <View style={styles.docCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="globe-outline" size={24} color="#16A34A" />
          </View>
          <View style={styles.docContent}>
            <Text style={styles.docTitle}>3. Conectividade</Text>
            <Text style={styles.docText}>
              O monitoramento de rede verifica se você está conectado via <Text style={styles.bold}>Wi-Fi ou Dados Móveis</Text>. Além disso, identifica o endereço IP local necessário para comunicações em rede interna (intranet).
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.gotItBtn} onPress={() => router.back()}>
            <Text style={styles.gotItBtnText}>Entendi, vamos lá!</Text>
          </TouchableOpacity>
          <Text style={styles.footerCopyright}>© Senac 2026</Text>
        </View>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  introSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.dark,
    lineHeight: 34,
    marginBottom: 12,
  },
  mainSubtitle: {
    fontSize: 16,
    color: COLORS.body,
    lineHeight: 24,
  },
  docCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  docContent: {
    flex: 1,
  },
  docTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 8,
  },
  docText: {
    fontSize: 14,
    color: COLORS.body,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  tipBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  tipText: {
    fontSize: 12,
    color: COLORS.body,
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  gotItBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  gotItBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerCopyright: {
    color: '#94A3B8',
    fontSize: 12,
  },
});
