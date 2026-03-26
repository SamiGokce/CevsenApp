import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Colors } from "../../constants/colors";
import { Spacing, BorderRadius, Typography } from "../../constants/theme";
import { useAppSettings } from "../../contexts/AppContext";
import {
  isFavorite,
  toggleFavorite,
  markBabRead,
  setLastReadBab,
} from "../../utils/storage";
import babsData from "../../data/babs.json";

const FONT_SCALE: Record<string, number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.2,
};

export default function BabScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { fontSize, language } = useAppSettings();
  const babId = parseInt(id || "1", 10);
  const scale = FONT_SCALE[fontSize] ?? 1;

  const [fav, setFav] = useState(false);

  const bab = useMemo(
    () => babsData.babs.find((b) => b.id === babId),
    [babId]
  );

  // Load favorite state & mark as read on open
  useEffect(() => {
    isFavorite(babId).then(setFav);
    setLastReadBab(babId);
    markBabRead(babId);
  }, [babId]);

  const handleFavorite = useCallback(async () => {
    const next = await toggleFavorite(babId);
    setFav(next.includes(babId));
  }, [babId]);

  const translation = (t: { en: string; tr: string }) =>
    language === "tr" ? t.tr : t.en;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Bab {babId}</Text>
        <Pressable style={styles.iconBtn} onPress={handleFavorite}>
          <Ionicons
            name={fav ? "heart" : "heart-outline"}
            size={24}
            color={fav ? Colors.error : Colors.text}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!bab ? (
          <View style={styles.comingSoon}>
            <Ionicons name="book-outline" size={48} color={Colors.lightGold} />
            <Text style={styles.comingSoonTitle}>Bab {babId}</Text>
            <Text style={styles.comingSoonText}>Content coming soon</Text>
          </View>
        ) : (
          <>
            {bab.lines.map((line, index) => (
              <View key={index} style={styles.lineCard}>
                <View style={styles.lineNumber}>
                  <Text style={styles.lineNumberText}>{index + 1}</Text>
                </View>
                <Text
                  style={[
                    styles.arabicText,
                    { fontSize: Typography.sizes.arabic * scale, lineHeight: Typography.sizes.arabic * scale * 1.8 },
                  ]}
                >
                  {line.arabic}
                </Text>
                <Text
                  style={[
                    styles.translitText,
                    { fontSize: Typography.sizes.sm * scale },
                  ]}
                >
                  {line.transliteration}
                </Text>
                <Text
                  style={[
                    styles.translationText,
                    { fontSize: Typography.sizes.sm * scale },
                  ]}
                >
                  {translation(line.translation)}
                </Text>
              </View>
            ))}

            {/* Closing Dua */}
            <View style={styles.closingSection}>
              <Text
                style={[
                  styles.closingArabic,
                  { fontSize: Typography.sizes.xl * scale, lineHeight: Typography.sizes.xl * scale * 1.7 },
                ]}
              >
                {bab.closing.arabic}
              </Text>
              <Text
                style={[
                  styles.closingTranslit,
                  { fontSize: Typography.sizes.sm * scale },
                ]}
              >
                {bab.closing.transliteration}
              </Text>
              <Text
                style={[
                  styles.closingTranslation,
                  { fontSize: Typography.sizes.sm * scale },
                ]}
              >
                {translation(bab.closing.translation)}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable
          style={[styles.navButton, babId <= 1 && styles.navButtonDisabled]}
          onPress={() => babId > 1 && router.replace(`/bab/${babId - 1}`)}
          disabled={babId <= 1}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={babId <= 1 ? Colors.textLight : Colors.text}
          />
          <Text
            style={[
              styles.navButtonText,
              babId <= 1 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </Pressable>

        <Text style={styles.babIndicator}>{babId} / 99</Text>

        <Pressable
          style={[styles.navButton, babId >= 99 && styles.navButtonDisabled]}
          onPress={() => babId < 99 && router.replace(`/bab/${babId + 1}`)}
          disabled={babId >= 99}
        >
          <Text
            style={[
              styles.navButtonText,
              babId >= 99 && styles.navButtonTextDisabled,
            ]}
          >
            Next
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={babId >= 99 ? Colors.textLight : Colors.text}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    color: Colors.text,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  comingSoon: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxl * 2,
    gap: Spacing.md,
  },
  comingSoonTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
    color: Colors.text,
  },
  comingSoonText: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  lineCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    gap: Spacing.sm,
  },
  lineNumber: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  lineNumberText: {
    fontSize: Typography.sizes.xs,
    fontWeight: "700",
    color: Colors.gold,
  },
  arabicText: {
    fontFamily: "NotoNaskhArabic",
    color: Colors.text,
    textAlign: "center",
    writingDirection: "rtl",
  },
  translitText: {
    color: Colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 22,
  },
  translationText: {
    color: Colors.tealSage,
    textAlign: "center",
    lineHeight: 22,
  },
  closingSection: {
    backgroundColor: Colors.mint,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    alignItems: "center",
    gap: Spacing.md,
  },
  closingArabic: {
    fontFamily: "NotoNaskhArabic",
    color: Colors.text,
    textAlign: "center",
    writingDirection: "rtl",
  },
  closingTranslit: {
    color: Colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 22,
  },
  closingTranslation: {
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.cardBg,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
    color: Colors.text,
  },
  navButtonTextDisabled: {
    color: Colors.textLight,
  },
  babIndicator: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
});
