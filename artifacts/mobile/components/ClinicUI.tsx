import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ColorValue,
  type PressableProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useClinic, type UserRole } from "@/lib/ClinicContext";

export function Screen({
  children,
  scroll = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const top = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top + 14;
  const bottom = Platform.OS === "web" ? 118 : insets.bottom + 104;

  if (!scroll) {
    return (
      <View
        style={[
          styles.screen,
          {
            backgroundColor: colors.background,
            paddingTop: top,
            paddingBottom: bottom,
          },
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: top, paddingBottom: bottom },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function Header({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.header}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        {subtitle}
      </Text>
    </View>
  );
}

export function HeroBanner({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={[styles.hero, { backgroundColor: colors.primary }]}>
      <View style={styles.heroBlobOne} />
      <View style={styles.heroBlobTwo} />
      <View style={styles.heroTopRow}>
        <View>
          <Text style={styles.heroEyebrow}>{eyebrow}</Text>
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.heroIcons}>
          <View style={styles.heroIconBtn}>
            <Feather name="bell" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.heroIconBtn}>
            <Feather name="help-circle" size={18} color="#FFFFFF" />
          </View>
        </View>
      </View>
      {children}
    </View>
  );
}

export function SearchBar({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.searchBar,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Feather name="search" size={16} color={colors.mutedForeground} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        style={[styles.searchInput, { color: colors.foreground }]}
      />
    </View>
  );
}

export function LoginScreen() {
  const colors = useColors();
  const { login, clinicNumber } = useClinic();
  const roles: { role: UserRole; title: string; body: string; icon: keyof typeof Feather.glyphMap }[] = [
    { role: "admin", title: "Admin", body: "Full access to patients, doctors, calls, appointments, and reports", icon: "shield" },
    { role: "patient", title: "Patient", body: "Book appointments, check records, and use symptom checker", icon: "user" },
    { role: "doctor", title: "Doctor", body: "View appointments, patient records, and call reasons", icon: "activity" },
  ];

  return (
    <Screen>
      <Header
        eyebrow="ClinicCare login"
        title="Choose your role"
        subtitle={`Clinic contact number: ${clinicNumber}. Select a role to continue into the app.`}
      />
      {roles.map((item) => (
        <Pressable
          key={item.role}
          onPress={() => login(item.role)}
          style={({ pressed }) => [
            styles.loginCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <View style={[styles.loginIcon, { backgroundColor: colors.secondary }]}>
            <Feather name={item.icon} size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.loginTitle, { color: colors.foreground }]}>{item.title}</Text>
            <Text style={[styles.loginBody, { color: colors.mutedForeground }]}>{item.body}</Text>
          </View>
          <Feather name="chevron-right" size={22} color={colors.mutedForeground} />
        </Pressable>
      ))}
    </Screen>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius + 14,
        },
      ]}
    >
      {children}
    </View>
  );
}

export function MetricCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: ColorValue;
  icon: keyof typeof Feather.glyphMap;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.metric,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius + 12,
        },
      ]}
    >
      <View style={[styles.metricIcon, { backgroundColor: tone }]}>
        <Feather name={icon} size={18} color={colors.primaryForeground} />
      </View>
      <Text style={[styles.metricValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  const colors = useColors();
  return (
    <View style={styles.sectionTitle}>
      <Text style={[styles.sectionText, { color: colors.foreground }]}>{title}</Text>
      {action ? (
        <Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text>
      ) : null}
    </View>
  );
}

export function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          void Haptics.selectionAsync();
          onPress();
        }
      }}
      style={[
        styles.pill,
        {
          backgroundColor: active ? colors.primary : colors.secondary,
          borderColor: active ? colors.primary : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.pillText,
          { color: active ? colors.primaryForeground : colors.secondaryForeground },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ActionButton({
  title,
  icon,
  variant = "primary",
  onPress,
  disabled,
}: PressableProps & {
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  variant?: "primary" | "secondary";
}) {
  const colors = useColors();
  const isPrimary = variant === "primary";
  return (
    <Pressable
      onPress={(event) => {
        if (!disabled) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(event);
      }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary ? colors.primary : colors.secondary,
          opacity: disabled ? 0.5 : pressed ? 0.78 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
      ]}
    >
      {icon ? (
        <Feather
          name={icon}
          size={17}
          color={isPrimary ? colors.primaryForeground : colors.secondaryForeground}
        />
      ) : null}
      <Text
        style={[
          styles.buttonText,
          { color: isPrimary ? colors.primaryForeground : colors.secondaryForeground },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function LoadingState() {
  const colors = useColors();
  return (
    <View style={styles.state}>
      <ActivityIndicator color={colors.primary} />
      <Text style={[styles.stateText, { color: colors.mutedForeground }]}>
        Preparing clinic data
      </Text>
    </View>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  const colors = useColors();
  return (
    <Card>
      <View style={styles.state}>
        <Feather name="inbox" size={26} color={colors.primary} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.stateText, { color: colors.mutedForeground }]}>{body}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    fontWeight: "700",
    fontSize: 27,
    lineHeight: 32,
  },
  subtitle: {
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderWidth: 1,
    padding: 15,
    gap: 12,
    shadowColor: "#172033",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 1,
  },
  loginCard: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 16,
  },
  loginIcon: {
    alignItems: "center",
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  loginBody: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19,
  },
  metric: {
    borderWidth: 1,
    flex: 1,
    minWidth: "46%",
    padding: 14,
    gap: 8,
  },
  metricIcon: {
    alignItems: "center",
    borderRadius: 10,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  metricValue: {
    fontWeight: "700",
    fontSize: 24,
  },
  metricLabel: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 17,
  },
  sectionTitle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  sectionText: {
    fontWeight: "700",
    fontSize: 18,
  },
  sectionAction: {
    fontWeight: "700",
    fontSize: 13,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  pillText: {
    fontWeight: "700",
    fontSize: 12,
  },
  button: {
    alignItems: "center",
    borderRadius: 14,
    flexDirection: "row",
    gap: 9,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 14,
  },
  state: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
  },
  stateText: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  emptyTitle: {
    fontWeight: "700",
    fontSize: 17,
  },
  hero: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 16,
    marginHorizontal: -20,
    marginTop: -20,
    overflow: "hidden",
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  heroBlobOne: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 200,
    height: 220,
    position: "absolute",
    right: -60,
    top: -90,
    width: 220,
  },
  heroBlobTwo: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 200,
    bottom: -80,
    height: 200,
    left: -60,
    position: "absolute",
    width: 200,
  },
  heroTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroEyebrow: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "500",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 4,
  },
  heroIcons: {
    flexDirection: "row",
    gap: 10,
  },
  heroIconBtn: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  searchBar: {
    alignItems: "center",
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
});