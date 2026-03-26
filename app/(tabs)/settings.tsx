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
      title: "Time to read Cevşen",
      body: "Continue your daily dhikr — keep your streak alive.",
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
  const { fontSize, language, setFontSize, setLanguage } = useAppSettings();
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
          "Permission Required",
          "Please enable notifications for Cevşen in your device settings.",
          [{ text: "OK" }]
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
      { text: "Small", size: "small" },
      { text: "Medium", size: "medium" },
      { text: "Large", size: "large" },
    ];
    Alert.alert(
      "Font Size",
      `Current: ${fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}`,
      [
        ...options.map((o) => ({
          text: o.text + (fontSize === o.size ? " ✓" : ""),
          onPress: () => setFontSize(o.size),
        })),
        { text: "Cancel", style: "cancel" as const },
      ]
    );
  }

  function showLanguagePicker() {
    const options: { text: string; lang: Language }[] = [
      { text: "English", lang: "en" },
      { text: "Türkçe", lang: "tr" },
    ];
    Alert.alert(
      "Translation Language",
      `Current: ${language === "en" ? "English" : "Türkçe"}`,
      [
        ...options.map((o) => ({
          text: o.text + (language === o.lang ? " ✓" : ""),
          onPress: () => setLanguage(o.lang),
        })),
        { text: "Cancel", style: "cancel" as const },
      ]
    );
  }

  function handleSignIn() {
    Alert.alert(
      "Sign In",
      "Cloud sync with Google & Apple Sign-In is coming in the next update. Your progress is saved locally in the meantime.",
      [{ text: "Got it" }]
    );
  }

  const fontSizeLabel =
    fontSize.charAt(0).toUpperCase() + fontSize.slice(1);
  const languageLabel = language === "en" ? "English" : "Türkçe";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        {/* Account */}
        <SectionHeader title="Account" />
        <View style={styles.section}>
          <Row
            icon="person-outline"
            title="Sign In"
            subtitle="Sync your progress across devices"
            onPress={handleSignIn}
            last
          />
        </View>

        {/* Reading */}
        <SectionHeader title="Reading" />
        <View style={styles.section}>
          <Row
            icon="text-outline"
            title="Font Size"
            subtitle={fontSizeLabel}
            onPress={showFontSizePicker}
          />
          <Row
            icon="language-outline"
            title="Translation Language"
            subtitle={languageLabel}
            onPress={showLanguagePicker}
            last
          />
        </View>

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <View style={styles.section}>
          <Row
            icon="notifications-outline"
            title="Daily Reminder"
            subtitle="Every day at 8:00 AM"
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

        {/* About */}
        <SectionHeader title="About" />
        <View style={styles.section}>
          <Row
            icon="information-circle-outline"
            title="About Cevşen"
            subtitle="Version 1.0.0"
            onPress={() => setAboutVisible(true)}
            last
          />
        </View>
      </ScrollView>

      {/* About Modal — only mount when visible to avoid invisible overlay blocking taps */}
      {aboutVisible && (
      <Modal
        visible={aboutVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAboutVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>About Cevşen</Text>
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
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutDesc}>
              Cevşen-ül Kebir is a famous Islamic prayer attributed to the
              Prophet Muhammad ﷺ, consisting of 99 sections (babs), each
              containing 10 invocations of Allah's names and attributes.
            </Text>
            <Text style={styles.aboutDesc}>
              This app provides the full Arabic text with transliteration and
              translations in English and Turkish, allowing you to read and
              study this sacred prayer at your own pace.
            </Text>
            <View style={styles.aboutDivider} />
            <Text style={styles.aboutMeta}>Source: Süreyya Yayınları 2025</Text>
            <Text style={styles.aboutMeta}>Free • No ads • No tracking</Text>
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
