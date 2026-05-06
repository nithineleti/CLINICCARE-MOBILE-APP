import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import {
  ActionButton,
  Card,
  Header,
  LoginScreen,
  Pill,
  Screen,
  SearchBar,
  SectionTitle,
} from "@/components/ClinicUI";
import { useColors } from "@/hooks/useColors";
import { useClinic } from "@/lib/ClinicContext";

const TABS = ["Appointment", "Schedule", "About"] as const;
const TIME_SLOTS = ["08:00", "08:30", "09:00", "09:30", "10:00", "11:00", "13:00", "13:30"];
const DATE_SLOTS = [
  { day: "17", label: "Tue" },
  { day: "18", label: "Wed" },
  { day: "19", label: "Thu" },
  { day: "20", label: "Fri" },
  { day: "21", label: "Sat" },
  { day: "22", label: "Sun" },
];

export default function DoctorsScreen() {
  const colors = useColors();
  const { doctors, patients, userRole, bookAppointment } = useClinic();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Appointment");
  const [mode, setMode] = useState<"Hospital" | "Online">("Online");
  const [date, setDate] = useState("20");
  const [time, setTime] = useState("09:00");

  if (!userRole) return <LoginScreen />;

  const specialties = ["All", ...Array.from(new Set(doctors.map((doctor) => doctor.specialty)))];
  const filtered = useMemo(
    () =>
      doctors.filter((doctor) => {
        const matchesSpecialty = specialty === "All" || doctor.specialty === specialty;
        const text = `${doctor.name} ${doctor.specialty}`.toLowerCase();
        return matchesSpecialty && text.includes(query.toLowerCase());
      }),
    [doctors, query, specialty],
  );

  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId);

  if (selectedDoctor) {
    const confirm = () => {
      bookAppointment({
        patientId: patients[0].id,
        doctorId: selectedDoctor.id,
        issue: "Scheduled visit",
        disease: selectedDoctor.specialty,
        type: mode === "Online" ? "Online" : "In-person",
        date: `${DATE_SLOTS.find((item) => item.day === date)?.label} ${date} · ${time}`,
      });
      Alert.alert("Booked", `${selectedDoctor.name} is booked for ${date} at ${time}.`);
      setSelectedDoctorId(null);
    };

    return (
      <Screen>
        <View style={styles.profileTop}>
          <Pressable onPress={() => setSelectedDoctorId(null)} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </Pressable>
          <View style={styles.profileTopActions}>
            <Pressable style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="phone" size={18} color={colors.foreground} />
            </Pressable>
            <Pressable style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="more-vertical" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        <View style={styles.profileHero}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileEyebrow, { color: colors.mutedForeground }]}>{selectedDoctor.specialty}</Text>
            <Text style={[styles.profileName, { color: colors.foreground }]}>{selectedDoctor.name}</Text>
            <View style={styles.specialtyRow}>
              {[selectedDoctor.specialty, "Diagnostics", "Surgery"].map((item) => (
                <View key={item} style={[styles.specialtyChip, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.specialtyChipText, { color: colors.secondaryForeground }]}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={styles.statsRow}>
              <View>
                <Text style={[styles.statValue, { color: colors.foreground }]}>{selectedDoctor.experience}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Experience</Text>
              </View>
              <View>
                <Text style={[styles.statValue, { color: colors.foreground }]}>900+ Patients</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Treated</Text>
              </View>
            </View>
          </View>
          <View style={[styles.profileAvatar, { backgroundColor: colors.secondary }]}>
            <Feather name="user" size={48} color={colors.primary} />
          </View>
        </View>

        <View style={[styles.tabsRow, { borderBottomColor: colors.border }]}>
          {TABS.map((item) => (
            <Pressable key={item} onPress={() => setTab(item)} style={styles.tabItem}>
              <Text style={[styles.tabText, { color: tab === item ? colors.primary : colors.mutedForeground }]}>{item}</Text>
              {tab === item ? <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} /> : null}
            </Pressable>
          ))}
        </View>

        <View style={styles.modeRow}>
          {(["Hospital", "Online"] as const).map((item) => (
            <Pressable
              key={item}
              onPress={() => setMode(item)}
              style={[
                styles.modeBtn,
                {
                  backgroundColor: mode === item ? colors.primary : colors.card,
                  borderColor: mode === item ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.modeText, { color: mode === item ? colors.primaryForeground : colors.foreground }]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <SectionTitle title="Available Date & Time" />
        <View style={styles.dateRow}>
          {DATE_SLOTS.map((item) => (
            <Pressable
              key={item.day}
              onPress={() => setDate(item.day)}
              style={[styles.dateChip, { backgroundColor: date === item.day ? colors.primary : colors.card, borderColor: date === item.day ? colors.primary : colors.border }]}
            >
              <Text style={[styles.dateDay, { color: date === item.day ? colors.primaryForeground : colors.foreground }]}>{item.day}</Text>
              <Text style={[styles.dateLabel, { color: date === item.day ? colors.primaryForeground : colors.mutedForeground }]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((item) => (
            <Pressable
              key={item}
              onPress={() => setTime(item)}
              style={[
                styles.timeChip,
                {
                  backgroundColor: time === item ? colors.primary : colors.card,
                  borderColor: time === item ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.timeText, { color: time === item ? colors.primaryForeground : colors.foreground }]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <ActionButton title="Confirm appointment" icon="calendar" onPress={confirm} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header eyebrow="Doctors" title="Find a Doctor" subtitle="Search by name or specialty and view doctor profile." />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search by name or specialty" />
      <View style={styles.filterRow}>
        {specialties.map((item) => (
          <Pill key={item} label={item} active={specialty === item} onPress={() => setSpecialty(item)} />
        ))}
      </View>
      <SectionTitle title="Available doctors" action={`${filtered.length}`} />
      {filtered.map((doctor) => (
        <Pressable key={doctor.id} onPress={() => setSelectedDoctorId(doctor.id)}>
          <Card>
            <View style={styles.doctorRow}>
              <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
                <Feather name="user" size={26} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: colors.foreground }]}>{doctor.name}</Text>
                <Text style={[styles.meta, { color: colors.mutedForeground }]}>{doctor.specialty}</Text>
                <Text style={[styles.meta, { color: colors.mutedForeground }]}>
                  Rating {doctor.rating.toFixed(1)} · {doctor.experience}
                </Text>
                <Text style={[styles.fee, { color: colors.primary }]}>{doctor.fee}</Text>
              </View>
              <Feather name="chevron-right" size={22} color={colors.mutedForeground} />
            </View>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  doctorRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  avatar: {
    alignItems: "center",
    borderRadius: 24,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
  },
  meta: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19,
  },
  fee: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
  },
  profileTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileTopActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  profileHero: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  profileEyebrow: {
    fontSize: 13,
    fontWeight: "500",
  },
  profileName: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 30,
  },
  specialtyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  specialtyChip: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  specialtyChipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
    marginTop: 16,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  profileAvatar: {
    alignItems: "center",
    borderRadius: 60,
    height: 120,
    justifyContent: "center",
    width: 120,
  },
  tabsRow: {
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 24,
  },
  tabItem: {
    paddingBottom: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
  },
  tabIndicator: {
    borderRadius: 2,
    bottom: -1,
    height: 2,
    left: 0,
    position: "absolute",
    right: 0,
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
  },
  modeBtn: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  modeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  dateRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  dateChip: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
  },
  dateDay: {
    fontSize: 16,
    fontWeight: "700",
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeChip: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
    width: "22%",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
