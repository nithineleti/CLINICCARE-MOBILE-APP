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
import Animated, { 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence, 
  useAnimatedStyle, 
  withDelay,
  interpolate,
  useDerivedValue
} from 'react-native-reanimated';

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
  const top = Platform.OS === "web" ? Math.max(insets.top, 60) : insets.top + 14;
  const bottom = Platform.OS === "web" ? 100 : insets.bottom + 104;

  const content = (
    <View style={{ flex: 1, position: 'relative' }}>
      <BackgroundSlides />
      {children}
    </View>
  );

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
        {content}
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
      {content}
    </ScrollView>
  );
}

function BackgroundSlides() {
  const colors = useColors();
  const opacity = useSharedValue(0.02); // Very low fade

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.06, { duration: 5000 }),
        withTiming(0.02, { duration: 5000 })
      ),
      -1,
      true
    );
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View 
        style={[
          StyleSheet.absoluteFill, 
          { 
            backgroundColor: colors.primary,
            opacity: opacity 
          }
        ]} 
      />
      <View style={[StyleSheet.absoluteFill, { opacity: 0.03 }]}>
        <View style={styles.bgLine} />
        <View style={styles.bgLine2} />
      </View>
    </View>
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
    <View style={[styles.hero, { backgroundColor: colors.primary, overflow: 'hidden' }]}>
      <AnimatedBlob 
        style={[styles.heroBlobOne, { backgroundColor: 'rgba(255,255,255,0.1)' }]} 
        duration={4000}
      />
      <AnimatedBlob 
        style={[styles.heroBlobTwo, { backgroundColor: 'rgba(255,255,255,0.08)' }]} 
        duration={6000}
        delay={1000}
      />
      <View style={{ position: 'relative', zIndex: 10 }}>
        <Text style={styles.heroEyebrow}>{eyebrow}</Text>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSubtitle}>{subtitle}</Text>
        {children && <View style={styles.heroChildren}>{children}</View>}
      </View>
    </View>
  );
}

function AnimatedBlob({ style, duration, delay = 0 }: { style: any, duration: number, delay?: number }) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1.2, { duration: duration }),
        withTiming(1, { duration: duration })
      ),
      -1,
      true
    ));
    rotation.value = withRepeat(
      withTiming(360, { duration: duration * 4 }),
      -1,
      false
    );
  }, [delay, duration, rotation, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ]
  }));

  return <Animated.View style={[style, animatedStyle]} />;
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

export function Card({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          transform: [{ scale: pressed && onPress ? 0.98 : 1 }],
          opacity: pressed && onPress ? 0.9 : 1,
          boxShadow: Platform.OS === "web" ? '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)' : undefined,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
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
  label,
  icon,
  onPress,
  variant = 'primary',
  isLoading = false,
  style,
}: {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  style?: any;
}) {
  const colors = useColors();
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { bg: colors.secondary, text: colors.secondaryForeground, border: 'transparent' };
      case 'outline':
        return { bg: 'transparent', text: colors.primary, border: colors.primary };
      case 'ghost':
        return { bg: 'transparent', text: colors.mutedForeground, border: 'transparent' };
      default:
        return { bg: colors.primary, text: colors.primaryForeground, border: 'transparent' };
    }
  };

  const v = getVariantStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.actionButton,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: v.border !== 'transparent' ? 1 : 0,
          transform: [{ scale: pressed ? 0.96 : 1 }],
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={v.text} />
      ) : (
        <>
          {icon && <Feather name={icon} size={18} color={v.text} style={{ marginRight: 8 }} />}
          <Text style={[styles.actionButtonText, { color: v.text }]}>{label}</Text>
        </>
      )}
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
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
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
  actionButton: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 6,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    position: 'relative',
  },
  heroEyebrow: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 6,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  heroChildren: {
    marginTop: 20,
  },
  heroBlobOne: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -50,
    right: -50,
  },
  heroBlobTwo: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: -30,
    left: -30,
  },
  heroTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
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
  bgLine: {
    position: 'absolute',
    top: '20%',
    width: '120%',
    height: 1,
    backgroundColor: '#000',
    transform: [{ rotate: '-15deg' }],
  },
  bgLine2: {
    position: 'absolute',
    top: '60%',
    width: '120%',
    height: 1,
    backgroundColor: '#000',
    transform: [{ rotate: '15deg' }],
  },
});