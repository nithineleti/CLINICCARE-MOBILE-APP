import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

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
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const filteredDoctors = useMemo(() => {
    if (!selectedSpecialty) return [];
    return doctors.filter(d => d.specialty === selectedSpecialty);
  }, [selectedSpecialty, doctors]);

  const filteredAppointments = useMemo(() => {
    if (!selectedSpecialty) return [];
    // Doctors in this specialty
    const specialtyDoctorIds = doctors
      .filter(d => d.specialty === selectedSpecialty)
      .map(d => d.id);
    return appointments.filter(a => specialtyDoctorIds.includes(a.doctorId));
  }, [selectedSpecialty, appointments, doctors]);

  const upcomingAppointment = useMemo(
    () => appointments.find((item) => item.status === "Booked") ?? appointments[0],
    [appointments],
  );

  if (!userRole) return <LoginScreen />;

  if (userRole === "patient") {
    return (
      <Screen>
        <View style={{ paddingHorizontal: 20 }}>
          <HeroBanner
            eyebrow={`Welcome back, ${userName}`}
            title="Your Health Dashboard"
            subtitle={`Emergency: ${clinicNumber}`}
          >
            <View style={[styles.queueCard, { backgroundColor: "rgba(255,255,255,0.16)" }]}>
              <View style={styles.queueIcon}>
                <Feather name="heart" size={18} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.queueTitle}>Your Health Score</Text>
                <Text style={styles.queueMeta}>Last checkup was 14 days ago</Text>
              </View>
            </View>
          </HeroBanner>
        </View>

        <View style={{ marginTop: -20, paddingHorizontal: 20 }}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search doctors or medications" />
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {upcomingAppointment ? (
            <View style={{ marginBottom: 24 }}>
              <SectionTitle title="Your Next Appointment" />
              <Card style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={[styles.dateBadge, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.dateText, { color: colors.primary }]}>
                      {new Date(upcomingAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || "Today"}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={[styles.doctorName, { color: colors.foreground }]}>
                      {doctors.find(d => d.id === upcomingAppointment.doctorId)?.name}
                    </Text>
                    <Text style={[styles.specialty, { color: colors.mutedForeground }]}>
                      {upcomingAppointment.disease}
                    </Text>
                  </View>
                </View>
                <ActionButton 
                  label="View Instructions" 
                  variant="outline" 
                  style={{ marginTop: 12 }} 
                  onPress={() => {}}
                />
              </Card>
            </View>
          ) : null}

          <SectionTitle title="Quick Services" />
          <View style={styles.quickGrid}>
            {[
              { icon: "calendar", label: "Book Now", route: "/appointments" },
              { icon: "file-text", label: "My Records", route: "/records" },
              { icon: "message-square", label: "Chat Support", route: "/calls" },
              { icon: "activity", label: "Vitals", route: "/profile" },
              { icon: "package", label: "Pharmacy", route: "/profile" },
            ].map((item, idx) => (
              <Pressable
                key={idx}
                onPress={() => router.push(item.route as any)}
                style={({ pressed }) => [
                  styles.quickItem,
                  { transform: [{ scale: pressed ? 0.95 : 1 }] }
                ]}
              >
                <View style={[styles.quickIcon, { backgroundColor: colors.accent }]}>
                  <Feather name={item.icon as any} size={22} color={colors.primary} />
                </View>
                <Text style={[styles.quickLabel, { color: colors.foreground }]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Screen>
    );
  }

  if (userRole === "doctor") {
    return (
      <Screen>
        <View style={{ paddingHorizontal: 20 }}>
          <HeroBanner
            eyebrow={`Hello, ${userName}`}
            title="Doctor's Portal"
            subtitle="You have 4 patients waiting in queue"
          >
            <View style={[styles.queueCard, { backgroundColor: "#FFFFFF" }]}>
              <View style={[styles.queueIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="users" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.queueTitleDark, { color: colors.foreground }]}>Next Patient: Maya Sharma</Text>
                <Text style={[styles.queueMetaDark, { color: colors.mutedForeground }]}>In lobby since 11:20 AM</Text>
              </View>
              <ActionButton label="Call" variant="primary" style={{ height: 32, paddingHorizontal: 12 }} />
            </View>
          </HeroBanner>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <SectionTitle title="Today's Schedule" />
          {appointments.filter(a => a.status !== "Cancelled").slice(0, 3).map((apt, idx) => (
            <Card key={idx} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                    {patients.find(p => p.id === apt.patientId)?.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.mutedForeground }}>{apt.date} • {apt.type}</Text>
                </View>
                <View style={{ backgroundColor: apt.status === 'Checked in' ? '#DCFCE7' : colors.secondary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: apt.status === 'Checked in' ? '#166534' : colors.primary }}>{apt.status}</Text>
                </View>
              </View>
            </Card>
          ))}

          <View style={{ marginTop: 12 }}>
            <ActionButton label="View All Appointments" variant="outline" onPress={() => router.push("/appointments")} />
          </View>

          <View style={{ marginTop: 24 }}>
            <SectionTitle title="Quick Insights" />
            <View style={styles.quickGrid}>
              {[
                { icon: "user-check", label: "Patient List", route: "/staff" },
                { icon: "file-plus", label: "Write Pres.", route: "/records" },
                { icon: "video", label: "Telehealth", route: "/calls" },
                { icon: "trending-up", label: "Analytics", route: "/analytics" },
                { icon: "settings", label: "Schedule", route: "/profile" },
              ].map((item, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => router.push(item.route as any)}
                  style={({ pressed }) => [
                    styles.quickItem,
                    { transform: [{ scale: pressed ? 0.95 : 1 }] }
                  ]}
                >
                  <View style={[styles.quickIcon, { backgroundColor: colors.accent }]}>
                    <Feather name={item.icon as any} size={22} color={colors.primary} />
                  </View>
                  <Text style={[styles.quickLabel, { color: colors.foreground }]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Screen>
    );
  }

  // Admin Dashboard (Default)
  return (
    <Screen>
      <View style={{ paddingHorizontal: 20 }}>
        <HeroBanner
          eyebrow={`Morning, ${userName}`}
          title="Let’s get you feeling better today"
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
      </View>

      <View style={{ marginTop: -20, paddingHorizontal: 20 }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search doctor or clinic" />
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        {upcomingAppointment ? (
          <View style={{ marginBottom: 24 }}>
            <SectionTitle title="Upcoming Appointment" />
            <Card style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <View style={[styles.dateBadge, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.dateText, { color: colors.primary }]}>
                    {new Date(upcomingAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={[styles.doctorName, { color: colors.foreground }]}>
                    {doctors.find(d => d.id === upcomingAppointment.doctorId)?.name || "Doctor"}
                  </Text>
                  <Text style={[styles.specialty, { color: colors.mutedForeground }]}>
                    {upcomingAppointment.disease} • {upcomingAppointment.type}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        ) : null}

        <SectionTitle title="Quick Actions" />
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((item, idx) => (
            <Pressable
              key={idx}
              onPress={() => router.push(item.route as any)}
              style={({ pressed }) => [
                styles.quickItem,
                { transform: [{ scale: pressed ? 0.95 : 1 }] }
              ]}
            >
              <View style={[styles.quickIcon, { backgroundColor: colors.accent }]}>
                <Feather name={item.icon} size={22} color={colors.primary} />
              </View>
              <Text style={[styles.quickLabel, { color: colors.foreground }]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: 24 }}>
          <SectionTitle title="Find Clinics by Speciality" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specialtyScroll}>
            {CLINICS.map((clinic, idx) => (
              <Pressable
                key={idx}
                onPress={() => setSelectedSpecialty(clinic.specialty === selectedSpecialty ? null : clinic.specialty)}
                style={({ pressed }) => [
                  styles.specialtyCard,
                  { 
                    backgroundColor: selectedSpecialty === clinic.specialty ? colors.secondary : colors.card,
                    borderColor: selectedSpecialty === clinic.specialty ? colors.primary : colors.border,
                    transform: [{ scale: pressed ? 0.95 : 1 }]
                  }
                ]}
              >
                <View style={[styles.specIconContainer, { backgroundColor: selectedSpecialty === clinic.specialty ? colors.accent : colors.secondary }]}>
                  <Feather name={clinic.icon} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.specLabel, { color: colors.foreground }]}>{clinic.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {selectedSpecialty && userRole === 'admin' && (
          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <SectionTitle title={`${selectedSpecialty} Department Details`} />
              <Pressable onPress={() => setSelectedSpecialty(null)}>
                <View style={{ backgroundColor: colors.muted, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>CLOSE</Text>
                </View>
              </Pressable>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground, marginBottom: 8 }}>Doctors ({filteredDoctors.length})</Text>
              {filteredDoctors.map(doctor => (
                <Card key={doctor.id} style={{ marginBottom: 8, padding: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={{ fontWeight: '700', fontSize: 15, color: colors.foreground }}>{doctor.name}</Text>
                      <Text style={{ fontSize: 12, color: colors.mutedForeground }}>{doctor.focus}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary }}>{doctor.experience}</Text>
                      <Text style={{ fontSize: 10, color: colors.mutedForeground }}>Rating: {doctor.rating}</Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground, marginBottom: 8 }}>Active Patients in Queue ({filteredAppointments.length})</Text>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(apt => (
                  <Card key={apt.id} style={{ marginBottom: 8, padding: 12, borderLeftWidth: 4, borderLeftColor: colors.primary }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View>
                        <Text style={{ fontWeight: '700', color: colors.foreground }}>
                          {patients.find(p => p.id === apt.patientId)?.name || 'Unknown Patient'}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.mutedForeground }}>Reason: {apt.disease}</Text>
                      </View>
                      <View style={{ backgroundColor: colors.secondary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>{apt.status}</Text>
                      </View>
                    </View>
                  </Card>
                ))
              ) : (
                <Card style={{ padding: 16, borderStyle: 'dashed' }}>
                  <Text style={{ fontSize: 13, color: colors.mutedForeground, textAlign: 'center' }}>No active appointments in this department.</Text>
                </Card>
              )}
            </View>
          </View>
        )}
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
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    opacity: 0.9,
  },
  queueCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  queueIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  queueTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  queueMeta: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
  queueTitleDark: {
    fontSize: 15,
    fontWeight: "600",
  },
  queueMetaDark: {
    fontSize: 13,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickItem: {
    width: '18%',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  appointmentCard: {
    marginTop: 8,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBadge: {
    width: 50,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  specialty: {
    fontSize: 13,
  },
  specialtyScroll: {
    marginTop: 8,
    paddingBottom: 20,
  },
  specialtyCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 110,
  },
  specIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  specLabel: {
    fontSize: 13,
    fontWeight: '600',
  }
});
