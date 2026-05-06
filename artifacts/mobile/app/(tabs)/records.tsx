import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card, Header, MetricCard, Screen, SectionTitle } from "@/components/ClinicUI";
import { useColors } from "@/hooks/useColors";
import { useClinic } from "@/lib/ClinicContext";

export default function RecordsScreen() {
  const colors = useColors();
  const { records, selectedPatient } = useClinic();

  return (
    <Screen>
      <Header
        eyebrow="Patient records"
        title="Patient profile"
        subtitle="View contact details, insurance, emergency contact, vitals, reports, prescriptions, and allergies."
      />

      <Card>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Feather name="user-check" size={24} color={colors.primaryForeground} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.foreground }]}>{selectedPatient.name}</Text>
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {selectedPatient.age} · {selectedPatient.gender} · {selectedPatient.city}
            </Text>
          </View>
        </View>
        <View style={styles.infoGrid}>
          <Text style={[styles.info, { color: colors.foreground }]}>Phone: {selectedPatient.phone}</Text>
          <Text style={[styles.info, { color: colors.foreground }]}>Insurance: {selectedPatient.insurance}</Text>
          <Text style={[styles.info, { color: colors.foreground }]}>Emergency: {selectedPatient.emergencyContact}</Text>
        </View>
      </Card>

      <View style={styles.metrics}>
        <MetricCard label="Blood pressure" value="138/88" tone="#1267D8" icon="activity" />
        <MetricCard label="Glucose" value="104" tone="#2E90FA" icon="droplet" />
        <MetricCard label="Temperature" value="98.4" tone="#F79009" icon="thermometer" />
        <MetricCard label="Medication due" value="8 PM" tone="#12B76A" icon="clock" />
      </View>

      <SectionTitle title="Medical timeline" />
      {records.map((record) => (
        <Card key={record.id}>
          <View style={styles.recordRow}>
            <View style={[styles.recordIcon, { backgroundColor: colors.accent }]}>
              <Feather name={iconFor(record.type)} size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.recordTitle, { color: colors.foreground }]}>{record.title}</Text>
              <Text style={[styles.meta, { color: colors.mutedForeground }]}>{record.type} · {record.date}</Text>
            </View>
          </View>
          <Text style={[styles.detail, { color: colors.foreground }]}>{record.detail}</Text>
        </Card>
      ))}

      <Card>
        <SectionTitle title="Security and access" />
        <Text style={[styles.detail, { color: colors.foreground }]}>
          Production version should add biometric login, encrypted records, access logs, and healthcare compliance controls.
        </Text>
      </Card>
    </Screen>
  );
}

function iconFor(type: string): keyof typeof Feather.glyphMap {
  if (type === "Lab") return "file-text";
  if (type === "Prescription") return "package";
  if (type === "Allergy") return "alert-triangle";
  return "clipboard";
}

const styles = StyleSheet.create({
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  avatar: {
    alignItems: "center",
    borderRadius: 24,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  name: {
    fontWeight: "700",
    fontSize: 20,
  },
  meta: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
  },
  infoGrid: {
    gap: 7,
  },
  info: {
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 19,
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  recordRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  recordIcon: {
    alignItems: "center",
    borderRadius: 16,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  recordTitle: {
    fontWeight: "700",
    fontSize: 16,
  },
  detail: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 21,
  },
});