import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import * as Notifications from "expo-notifications";
import { Colors } from "../../constants/colors";
import { Spacing, BorderRadius, Typography } from "../../constants/theme";
import { useAppSettings } from "../../contexts/AppContext";
import {
  getNotificationEnabled,
  saveNotificationEnabled,
} from "../../utils/storage";
import { FontSize, Language } from "../../utils/storage";

async function scheduleDaily(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return false;
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Cevşen okuma zamanı",
      body: "Günlük zikrinize devam edin — serinizi canlı tutun.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
  return true;
}

async function cancelDaily() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

interface SectionHeaderProps {
  title: string;
}
function SectionHeader({ title }: SectionHeaderProps) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  last?: boolean;
}
function Row({ icon, title, subtitle, onPress, right, last }: RowProps) {
  return (
    <Pressable
      style={[styles.row, last && styles.rowLast]}
      onPress={onPress}
      disabled={!onPress && !right}
    >
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color={Colors.tealSage} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {right ?? (
        onPress ? (
          <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
        ) : null
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const {
    fontSize,
    language,
    showTranslation,
    easyReadMode,
    setFontSize,
    setLanguage,
    setShowTranslation,
    setEasyReadMode,
  } = useAppSettings();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getNotificationEnabled().then(setNotifEnabled);
    }, [])
  );

  async function handleNotifToggle(val: boolean) {
    if (val) {
      const ok = await scheduleDaily();
      if (!ok) {
        Alert.alert(
          "İzin Gerekli",
          "Cevşen için cihaz ayarlarından bildirimlere izin verin.",
          [{ text: "Tamam" }]
        );
        return;
      }
    } else {
      await cancelDaily();
    }
    setNotifEnabled(val);
    saveNotificationEnabled(val);
  }

  function showFontSizePicker() {
    const options: { text: string; size: FontSize }[] = [
      { text: "Küçük", size: "small" },
      { text: "Orta", size: "medium" },
      { text: "Büyük", size: "large" },
    ];
    Alert.alert(
      "Yazı Boyutu",
      `Mevcut: ${fontSizeLabel}`,
      [
        ...options.map((o) => ({
          text: o.text + (fontSize === o.size ? " ✓" : ""),
          onPress: () => setFontSize(o.size),
        })),
        { text: "İptal", style: "cancel" as const },
      ]
    );
  }

  function showLanguagePicker() {
    const options: { text: string; lang: Language }[] = [
      { text: "Türkçe", lang: "tr" },
      { text: "English", lang: "en" },
    ];
    Alert.alert(
      "Çeviri Dili",
      `Mevcut: ${languageLabel}`,
      [
        ...options.map((o) => ({
          text: o.text + (language === o.lang ? " ✓" : ""),
          onPress: () => setLanguage(o.lang),
        })),
        { text: "İptal", style: "cancel" as const },
      ]
    );
  }

  function handleSignIn() {
    Alert.alert(
      "Giriş Yap",
      "Google ve Apple ile bulut senkronizasyonu bir sonraki güncellemede geliyor. İlerlemeniz şu an cihazınızda kaydediliyor.",
      [{ text: "Anladım" }]
    );
  }

  const fontSizeLabel =
    fontSize === "small" ? "Küçük" : fontSize === "large" ? "Büyük" : "Orta";
  const languageLabel = language === "tr" ? "Türkçe" : "English";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Ayarlar</Text>

        {/* Hesap */}
        <SectionHeader title="Hesap" />
        <View style={styles.section}>
          <Row
            icon="person-outline"
            title="Giriş Yap"
            subtitle="İlerlemenizi cihazlar arasında senkronize edin"
            onPress={handleSignIn}
            last
          />
        </View>

        {/* Okuma */}
        <SectionHeader title="Okuma" />
        <View style={styles.section}>
          <Row
            icon="text-outline"
            title="Yazı Boyutu"
            subtitle={fontSizeLabel}
            onPress={showFontSizePicker}
          />
          <Row
            icon="eye-outline"
            title="Çeviriyi Göster"
            subtitle={showTranslation ? "Açık" : "Kapalı"}
            right={
              <Switch
                value={showTranslation}
                onValueChange={setShowTranslation}
                trackColor={{
                  false: Colors.border,
                  true: Colors.tealSage,
                }}
                thumbColor={Colors.white}
              />
            }
          />
          <Row
            icon="albums-outline"
            title="Kolay Okuma Modu"
            subtitle={
              easyReadMode
                ? "Her satır ayrı kart"
                : "Kitap görünümü"
            }
            right={
              <Switch
                value={easyReadMode}
                onValueChange={setEasyReadMode}
                trackColor={{
                  false: Colors.border,
                  true: Colors.tealSage,
                }}
                thumbColor={Colors.white}
              />
            }
          />
          <Row
            icon="language-outline"
            title="Çeviri Dili"
            subtitle={languageLabel}
            onPress={showLanguagePicker}
            last
          />
        </View>

        {/* Bildirimler */}
        <SectionHeader title="Bildirimler" />
        <View style={styles.section}>
          <Row
            icon="notifications-outline"
            title="Günlük Hatırlatıcı"
            subtitle="Her gün saat 08:00'de"
            last
            right={
              <Switch
                value={notifEnabled}
                onValueChange={handleNotifToggle}
                trackColor={{
                  false: Colors.border,
                  true: Colors.tealSage,
                }}
                thumbColor={Colors.white}
              />
            }
          />
        </View>

        {/* Hakkında */}
        <SectionHeader title="Hakkında" />
        <View style={styles.section}>
          <Row
            icon="information-circle-outline"
            title="Cevşen Hakkında"
            subtitle="Sürüm 1.0.0"
            onPress={() => setAboutVisible(true)}
            last
          />
        </View>
      </ScrollView>

      {/* About Modal */}
      {aboutVisible && (
      <Modal
        visible={aboutVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAboutVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cevşen Hakkında</Text>
            <Pressable
              onPress={() => setAboutVisible(false)}
              style={styles.modalClose}
            >
              <Ionicons name="close" size={24} color={Colors.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.aboutBadge}>
              <Ionicons name="book" size={48} color={Colors.gold} />
            </View>
            <Text style={styles.aboutName}>Cevşen-ül Kebir</Text>
            <Text style={styles.aboutVersion}>Sürüm 1.0.0</Text>
            <Text style={styles.aboutDesc}>
              Cevşen-ül Kebir, Hz. Peygamber ﷺ'e atfedilen ve her biri Allah'ın
              isim ve sıfatlarına dair 10 dua içeren 99 bölümden (bab) oluşan
              ünlü bir İslami duadır.
            </Text>
            <Text style={styles.aboutDesc}>
              Bu uygulama, kutsal duanın tamamını Arapça metin ve Türkçe çeviriyle
              sunarak kendi hızınızda okumanıza ve çalışmanıza imkân tanır.
            </Text>
            <View style={styles.aboutDivider} />
            <Text style={styles.aboutMeta}>Kaynak: Süreyya Yayınları 2025</Text>
            <Text style={styles.aboutMeta}>Ücretsiz • Reklamsız • Takip yok</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  section: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: "500",
    color: Colors.text,
  },
  rowSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    color: Colors.text,
  },
  modalClose: {
    padding: Spacing.xs,
  },
  modalContent: {
    padding: Spacing.lg,
    alignItems: "center",
  },
  aboutBadge: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  aboutName: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  aboutVersion: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  aboutDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  aboutDivider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  aboutMeta: {
    fontSize: Typography.sizes.xs,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
});
