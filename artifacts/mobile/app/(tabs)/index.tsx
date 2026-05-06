import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  ActionButton,
  Card,
  HeroBanner,
  LoginScreen,
  Screen,
  SearchBar,
  SectionTitle,
} from "@/components/ClinicUI";
import { useColors } from "@/hooks/useColors";
import { useClinic } from "@/lib/ClinicContext";

const QUICK_ACTIONS: { icon: keyof typeof Feather.glyphMap; label: string; route: string }[] = [
  { icon: "clipboard", label: "Clinic\nRegistration", route: "/profile" },
  { icon: "calendar", label: "Doctor\nSchedule", route: "/doctors" },
  { icon: "user-plus", label: "Doctor\nAppointment", route: "/appointments" },
  { icon: "users", label: "Clinics\nQueue", route: "/calls" },
  { icon: "package", label: "Medicine\nSubmission", route: "/profile" },
];

const CLINICS: { icon: keyof typeof Feather.glyphMap; label: string; specialty: string }[] = [
  { icon: "activity", label: "Orthopedic", specialty: "Orthopedics" },
  { icon: "zap", label: "Neuron", specialty: "Neurology" },
  { icon: "headphones", label: "ENT", specialty: "ENT" },
  { icon: "heart", label: "Cardiology", specialty: "Cardiology" },
  { icon: "smile", label: "Children", specialty: "Pediatrics" },
  { icon: "user", label: "Psychology", specialty: "Neurology" },
  { icon: "eye", label: "Eye", specialty: "Ophthalmology" },
  { icon: "droplet", label: "Urology", specialty: "General Medicine" },
];

export default function TodayScreen() {
  const colors = useColors();
  const router = useRouter();
  const { appointments, doctors, patients, clinicNumber, userRole, userName, bookAppointment } = useClinic();
  const [search, setSearch] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const upcomingAppointment = useMemo(
    () => appointments.find((item) => item.status === "Booked") ?? appointments[0],
    [appointments],
  );

  if (!userRole) return <LoginScreen />;

  const checker = getSymptomSuggestion(symptoms, doctors);

  const bookSuggested = () => {
    if (!checker.doctor) {
      Alert.alert("Add symptoms", "Type symptoms first so the app can suggest a specialist.");
      return;
    }
    bookAppointment({
      patientId: patients[0].id,
      doctorId: checker.doctor.id,
      issue: symptoms || checker.reason,
      disease: checker.reason,
      type: "In-person",
      date: checker.doctor.nextSlot,
    });
    Alert.alert("Appointment booked", `${checker.doctor.name} is booked for ${checker.doctor.nextSlot}.`);
  };

  return (
    <Screen>
      <HeroBanner
        eyebrow={`Morning, ${userName}`}
        title="Let us to make you better"
        subtitle={`Clinic contact: ${clinicNumber}`}
      >
        <Text style={styles.heroLabel}>Active Queue</Text>
        <View style={[styles.queueCard, { backgroundColor: "rgba(255,255,255,0.16)" }]}>
          <View style={styles.queueIcon}>
            <Feather name="archive" size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.queueTitle}>Orthopedic Clinic Queue</Text>
            <Text style={styles.queueMeta}>Current Queue 3 of 17</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#FFFFFF" />
        </View>
        <View style={[styles.queueCard, { backgroundColor: "#FFFFFF" }]}>
          <View style={[styles.queueIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="clock" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.queueTitleDark, { color: colors.foreground }]}>Queue 6</Text>
            <Text style={[styles.queueMetaDark, { color: colors.mutedForeground }]}>Your turn at 11:12 WITA</Text>
          </View>
        </View>
      </HeroBanner>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search doctor or clinic" />

      {upcomingAppointment ? (
        <Pressable
          onPress={() => router.push("/appointments")}
          style={[styles.checkupCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="calendar" size={16} color={colors.primary} />
          <Text style={[styles.checkupText, { color: colors.foreground }]}>Your next medical checkup</Text>
          <Text style={[styles.checkupMeta, { color: colors.mutedForeground }]}>{upcomingAppointment.date}</Text>
        </Pressable>
      ) : null}

      <View style={styles.quickRow}>
        {QUICK_ACTIONS.map((item) => (
          <Pressable key={item.label} style={styles.quickItem} onPress={() => router.push(item.route as never)}>
            <View style={[styles.quickIcon, { backgroundColor: colors.secondary }]}>
              <Feather name={item.icon} size={20} color={colors.primary} />
            </View>
            <Text style={[styles.quickText, { color: colors.foreground }]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle title="Hospital Clinics" action="See All" />
      <View style={styles.clinicGrid}>
        {CLINICS.map((clinic) => (
          <Pressable
            key={clinic.label}
            style={styles.clinicItem}
            onPress={() => router.push("/doctors")}
          >
            <View style={[styles.clinicIcon, { backgroundColor: colors.secondary }]}>
              <Feather name={clinic.icon} size={22} color={colors.primary} />
            </View>
            <Text style={[styles.clinicText, { color: colors.foreground }]}>{clinic.label}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle title="AI Symptom Checker" />
      <Card>
        <TextInput
          value={symptoms}
          onChangeText={setSymptoms}
          placeholder="Type symptoms, for example fever, chest pain, skin rash"
          placeholderTextColor={colors.mutedForeground}
          multiline
          style={[styles.input, { borderColor: colors.input, color: colors.foreground, backgroundColor: colors.background }]}
        />
        <Text style={[styles.suggestion, { color: colors.foreground }]}>
          Suggested department: <Text style={{ color: colors.primary }}>{checker.department}</Text>
        </Text>
        <Text style={[styles.suggestionMeta, { color: colors.mutedForeground }]}>{checker.reason}</Text>
        <ActionButton title="Book suggested appointment" icon="calendar" variant="secondary" onPress={bookSuggested} />
      </Card>

      <SectionTitle title="Events" action="See All" />
      <View style={styles.eventsRow}>
        <View style={[styles.eventCard, { backgroundColor: colors.secondary }]}>
          <Feather name="heart" size={26} color={colors.primary} />
          <Text style={[styles.eventText, { color: colors.foreground }]}>Free Cardio Screening</Text>
          <Text style={[styles.eventMeta, { color: colors.mutedForeground }]}>Sat, 10 May · 09:00</Text>
        </View>
        <View style={[styles.eventCard, { backgroundColor: colors.secondary }]}>
          <Feather name="droplet" size={26} color={colors.primary} />
          <Text style={[styles.eventText, { color: colors.foreground }]}>Blood Donation Day</Text>
          <Text style={[styles.eventMeta, { color: colors.mutedForeground }]}>Sun, 18 May · 08:00</Text>
        </View>
      </View>
    </Screen>
  );
}

function getSymptomSuggestion(symptoms: string, doctors: ReturnType<typeof useClinic>["doctors"]) {
  const value = symptoms.toLowerCase();
  let department = "General Medicine";
  let reason = "General health checkup";
  if (value.includes("chest") || value.includes("heart") || value.includes("bp")) {
    department = "Cardiology";
    reason = "Chest pain or blood pressure review";
  } else if (value.includes("skin") || value.includes("rash") || value.includes("allergy")) {
    department = "Dermatology";
    reason = "Skin rash or allergy";
  } else if (value.includes("bone") || value.includes("joint") || value.includes("fracture")) {
    department = "Orthopedics";
    reason = "Joint pain or bone injury";
  } else if (value.includes("head") || value.includes("dizzy") || value.includes("nerve")) {
    department = "Neurology";
    reason = "Headache, dizziness, or nerve concern";
  } else if (value.includes("child") || value.includes("baby")) {
    department = "Pediatrics";
    reason = "Child health consultation";
  }
  return {
    department,
    reason,
    doctor: doctors.find((doctor) => doctor.specialty === department) ?? doctors[1],
  };
}

const styles = StyleSheet.create({
  heroLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
  },
  queueCard: {
    alignItems: "center",
    borderRadius: 16,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  queueIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  queueTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  queueMeta: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  queueTitleDark: {
    fontSize: 14,
    fontWeight: "700",
  },
  queueMetaDark: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  checkupCard: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  checkupText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  checkupMeta: {
    fontSize: 11,
    fontWeight: "500",
  },
  quickRow: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "space-between",
  },
  quickItem: {
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  quickIcon: {
    alignItems: "center",
    borderRadius: 16,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  quickText: {
    fontSize: 10,
    fontWeight: "600",
    lineHeight: 13,
    textAlign: "center",
  },
  clinicGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  clinicItem: {
    alignItems: "center",
    gap: 8,
    width: "21%",
  },
  clinicIcon: {
    alignItems: "center",
    borderRadius: 18,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  clinicText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 13,
    fontWeight: "500",
    minHeight: 70,
    padding: 12,
    textAlignVertical: "top",
  },
  suggestion: {
    fontSize: 14,
    fontWeight: "700",
  },
  suggestionMeta: {
    fontSize: 12,
    fontWeight: "500",
  },
  eventsRow: {
    flexDirection: "row",
    gap: 12,
  },
  eventCard: {
    borderRadius: 16,
    flex: 1,
    gap: 8,
    padding: 14,
  },
  eventText: {
    fontSize: 13,
    fontWeight: "700",
  },
  eventMeta: {
    fontSize: 11,
    fontWeight: "500",
  },
});
