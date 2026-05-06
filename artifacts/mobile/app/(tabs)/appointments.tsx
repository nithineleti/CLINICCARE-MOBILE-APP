import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import { ActionButton, Card, Header, LoginScreen, Pill, Screen, SectionTitle } from "@/components/ClinicUI";
import { useClinic } from "@/lib/ClinicContext";
import { useColors } from "@/hooks/useColors";

const issues = ["Chest pain", "Fever", "Skin rash", "Joint pain", "Diabetes", "General checkup"];
const diseases = ["Hypertension", "Viral infection", "Allergy", "Fracture", "Diabetes review", "Preventive care"];
const visitTypes = ["In-person", "Virtual"] as const;

export default function AppointmentsScreen() {
  const colors = useColors();
  const { doctors, appointments, selectedPatient, bookAppointment, markCheckedIn, cancelAppointment, userRole } = useClinic();
  const [issue, setIssue] = useState(issues[0]);
  const [disease, setDisease] = useState(diseases[0]);
  const [visitType, setVisitType] = useState<(typeof visitTypes)[number]>("In-person");
  const [doctorId, setDoctorId] = useState(doctors[0]?.id ?? "");
  const [notes, setNotes] = useState("");

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === doctorId) ?? doctors[0],
    [doctorId, doctors],
  );

  if (!userRole) return <LoginScreen />;

  const visibleAppointments =
    userRole === "doctor"
      ? appointments.filter((appointment) => appointment.doctorId === doctors[0]?.id)
      : userRole === "patient"
        ? appointments.filter((appointment) => appointment.patientId === selectedPatient.id)
        : appointments;

  const submit = () => {
    if (!selectedDoctor || !issue.trim() || !disease.trim()) {
      Alert.alert("Missing details", "Please select an issue, disease, and doctor.");
      return;
    }
    bookAppointment({
      patientId: selectedPatient.id,
      doctorId: selectedDoctor.id,
      issue: notes.trim() || issue,
      disease,
      type: visitType,
      date: selectedDoctor.nextSlot,
    });
    setNotes("");
    Alert.alert("Appointment booked", `${selectedDoctor.name} is scheduled for ${selectedDoctor.nextSlot}.`);
  };

  return (
    <Screen>
      <Header
        eyebrow="Appointments"
        title={userRole === "doctor" ? "Doctor appointments" : "Appointments"}
        subtitle={userRole === "doctor" ? "View patient bookings and check-ins assigned to doctors." : "Book a visit by health issue, reason, type, and doctor."}
      />

      {userRole !== "doctor" ? (
        <>
          <SectionTitle title="Health issue" />
          <View style={styles.wrap}>
            {issues.map((item) => (
              <Pill key={item} label={item} active={issue === item} onPress={() => setIssue(item)} />
            ))}
          </View>

          <SectionTitle title="Reason for visit" />
          <View style={styles.wrap}>
            {diseases.map((item) => (
              <Pill key={item} label={item} active={disease === item} onPress={() => setDisease(item)} />
            ))}
          </View>

          <Card>
            <Text style={[styles.label, { color: colors.foreground }]}>Describe symptoms</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Example: pain started yesterday, mild breathing difficulty"
              placeholderTextColor={colors.mutedForeground}
              multiline
              style={[
                styles.input,
                {
                  color: colors.foreground,
                  borderColor: colors.input,
                  backgroundColor: colors.background,
                },
              ]}
            />
          </Card>

          <SectionTitle title="Consultation type" />
          <View style={styles.row}>
            {visitTypes.map((item) => (
              <Pill key={item} label={item} active={visitType === item} onPress={() => setVisitType(item)} />
            ))}
          </View>

          <SectionTitle title="Available doctors" />
          {doctors.map((doctor) => (
            <Card key={doctor.id}>
              <View style={styles.doctorRow}>
                <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
                  <Feather name="user" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.doctorName, { color: colors.foreground }]}>{doctor.name}</Text>
                  <Text style={[styles.meta, { color: colors.mutedForeground }]}>
                    {doctor.specialty} · {doctor.experience} · {doctor.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.focus, { color: colors.mutedForeground }]}>{doctor.focus}</Text>
              <View style={styles.doctorFooter}>
                <Text style={[styles.slot, { color: colors.primary }]}>{doctor.nextSlot}</Text>
                <Pill label={doctorId === doctor.id ? "Selected" : "Choose"} active={doctorId === doctor.id} onPress={() => setDoctorId(doctor.id)} />
              </View>
            </Card>
          ))}

          <ActionButton title="Confirm appointment" icon="calendar" onPress={submit} />
        </>
      ) : null}

      <SectionTitle title="Upcoming appointments" action={`${visibleAppointments.length} total`} />
      {visibleAppointments.map((appointment) => {
        const doctor = doctors.find((item) => item.id === appointment.doctorId);
        return (
          <Card key={appointment.id}>
            <View style={styles.doctorRow}>
              <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.doctorName, { color: colors.foreground }]}>{appointment.issue}</Text>
                <Text style={[styles.meta, { color: colors.mutedForeground }]}>
                  {appointment.disease} · {appointment.type} · {appointment.date}
                </Text>
                <Text style={[styles.meta, { color: colors.mutedForeground }]}>
                  {doctor?.name ?? "Assigned doctor"} · {appointment.status}
                </Text>
              </View>
            </View>
            {appointment.status === "Booked" ? (
              <View style={styles.actionRow}>
                {userRole !== "patient" ? (
                  <ActionButton title="Check in" icon="check-circle" variant="secondary" onPress={() => markCheckedIn(appointment.id)} />
                ) : null}
                {userRole !== "doctor" ? (
                  <ActionButton title="Cancel" icon="x" variant="secondary" onPress={() => cancelAppointment(appointment.id)} />
                ) : null}
              </View>
            ) : null}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  label: {
    fontWeight: "700",
    fontSize: 15,
  },
  input: {
    borderRadius: 18,
    borderWidth: 1,
    fontWeight: "500",
    fontSize: 15,
    minHeight: 92,
    padding: 14,
    textAlignVertical: "top",
  },
  doctorRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    alignItems: "center",
    borderRadius: 18,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  doctorName: {
    fontWeight: "700",
    fontSize: 16,
  },
  meta: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
  },
  focus: {
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 19,
  },
  doctorFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  slot: {
    fontWeight: "700",
    fontSize: 13,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  statusDot: {
    borderRadius: 7,
    height: 14,
    width: 14,
  },
});