import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Linking, StyleSheet, Text, TextInput, View } from "react-native";

import { ActionButton, Card, Header, LoginScreen, Pill, Screen, SectionTitle } from "@/components/ClinicUI";
import { useColors } from "@/hooks/useColors";
import { useClinic } from "@/lib/ClinicContext";

const purposes = ["Appointment", "Emergency", "Report follow-up", "Billing", "Insurance", "Doctor query"];
const fields = ["General Medicine", "Cardiology", "Dermatology", "Orthopedics", "Nursing", "Billing"];

export default function CallsScreen() {
  const colors = useColors();
  const { calls, patients, addCall, bookAppointment, doctors, clinicNumber, userRole } = useClinic();
  const [patientName, setPatientName] = useState("New caller");
  const [phone, setPhone] = useState("+91 ");
  const [city, setCity] = useState("Unknown area");
  const [purpose, setPurpose] = useState(purposes[0]);
  const [field, setField] = useState(fields[0]);
  const [transcript, setTranscript] = useState("");

  const submit = () => {
    if (!phone.trim() || !transcript.trim()) {
      Alert.alert("Call details needed", "Add the caller phone number and call notes.");
      return;
    }
    addCall({
      patientName: patientName.trim() || "New caller",
      phone,
      city,
      purpose,
      field,
      transcript,
      action: purpose === "Emergency" ? "Escalate to emergency desk" : "Reception follow-up",
    });
    if (purpose === "Appointment") {
      const doctor = doctors.find((item) => item.specialty === field) ?? doctors[1];
      bookAppointment({
        patientId: patients[0].id,
        doctorId: doctor.id,
        issue: transcript,
        disease: field,
        type: "In-person",
        date: doctor.nextSlot,
      });
    }
    setTranscript("");
    Alert.alert("Call recorded", purpose === "Appointment" ? "The call is recorded and an appointment was booked from the call reason." : "The call purpose, caller area, field, and notes are saved.");
  };

  const callPatient = async (number: string) => {
    const canOpen = await Linking.canOpenURL(`tel:${number}`);
    if (!canOpen) {
      Alert.alert("Calling unavailable", "This device cannot open phone calls from the preview.");
      return;
    }
    await Linking.openURL(`tel:${number}`);
  };

  if (!userRole) return <LoginScreen />;

  return (
    <Screen>
      <Header
        eyebrow="Reception"
        title="Call records"
        subtitle={`Clinic number: ${clinicNumber}. Record incoming calls, caller reason, and book appointments from call notes.`}
      />

      <Card>
        <View style={styles.patientRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Feather name="phone" size={18} color={colors.primaryForeground} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.patientName, { color: colors.foreground }]}>Official clinic contact number</Text>
            <Text style={[styles.help, { color: colors.mutedForeground }]}>{clinicNumber}</Text>
          </View>
        </View>
        <Text style={[styles.help, { color: colors.mutedForeground }]}>
          Automatic telecom recording requires a phone provider integration. This screen stores the call notes and reason for the MVP.
        </Text>
      </Card>

      <Card>
        <Text style={[styles.label, { color: colors.foreground }]}>Caller information</Text>
        <View style={styles.inputGrid}>
          <TextInput
            value={patientName}
            onChangeText={setPatientName}
            placeholder="Patient name"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.background }]}
          />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            keyboardType="phone-pad"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.background }]}
          />
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Area or city"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.background }]}
          />
        </View>
      </Card>

      <SectionTitle title="Purpose" />
      <View style={styles.wrap}>
        {purposes.map((item) => (
          <Pill key={item} label={item} active={purpose === item} onPress={() => setPurpose(item)} />
        ))}
      </View>

      <SectionTitle title="Clinic field" />
      <View style={styles.wrap}>
        {fields.map((item) => (
          <Pill key={item} label={item} active={field === item} onPress={() => setField(item)} />
        ))}
      </View>

      <Card>
        <Text style={[styles.label, { color: colors.foreground }]}>Call notes</Text>
        <Text style={[styles.help, { color: colors.mutedForeground }]}>
          Store what the patient said and the next action for reception.
        </Text>
        <TextInput
          value={transcript}
          onChangeText={setTranscript}
          placeholder="Write what the patient said in the call"
          placeholderTextColor={colors.mutedForeground}
          multiline
          style={[styles.textarea, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.background }]}
        />
        <ActionButton title="Save call record" icon="save" onPress={submit} />
      </Card>

      <SectionTitle title="Call patients" />
      {patients.map((patient) => (
        <Card key={patient.id}>
          <View style={styles.patientRow}>
            <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
              <Feather name="phone-call" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.patientName, { color: colors.foreground }]}>{patient.name}</Text>
              <Text style={[styles.help, { color: colors.mutedForeground }]}>{patient.city} · {patient.phone}</Text>
            </View>
          </View>
          <ActionButton title="Call patient" icon="phone" variant="secondary" onPress={() => void callPatient(patient.phone)} />
        </Card>
      ))}

      <SectionTitle title="Saved call history" action={`${calls.length} calls`} />
      {calls.map((call) => (
        <Card key={call.id}>
          <View style={styles.patientRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Feather name="radio" size={18} color={colors.primaryForeground} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.patientName, { color: colors.foreground }]}>{call.patientName}</Text>
              <Text style={[styles.help, { color: colors.mutedForeground }]}>{call.city} · {call.time} · {call.purpose}</Text>
            </View>
          </View>
          <Text style={[styles.badge, { color: colors.primary }]}>{call.field}</Text>
          <Text style={[styles.transcript, { color: colors.foreground }]}>{call.transcript}</Text>
          <Text style={[styles.help, { color: colors.mutedForeground }]}>Action: {call.action}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "700",
    fontSize: 15,
  },
  inputGrid: {
    gap: 10,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    fontWeight: "500",
    fontSize: 14,
    padding: 13,
  },
  textarea: {
    borderRadius: 18,
    borderWidth: 1,
    fontWeight: "500",
    fontSize: 14,
    minHeight: 112,
    padding: 14,
    textAlignVertical: "top",
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  help: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
  },
  patientRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    alignItems: "center",
    borderRadius: 18,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  patientName: {
    fontWeight: "700",
    fontSize: 16,
  },
  badge: {
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
  },
  transcript: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 21,
  },
});