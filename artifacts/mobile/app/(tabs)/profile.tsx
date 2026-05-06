import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ActionButton, Card, Header, LoginScreen, Screen, SectionTitle } from "@/components/ClinicUI";
import { useColors } from "@/hooks/useColors";
import { useClinic } from "@/lib/ClinicContext";

export default function ProfileScreen() {
  const colors = useColors();
  const { clinicNumber, logout, records, selectedPatient, userName, userRole, appointments, calls, doctors } = useClinic();

  if (!userRole) return <LoginScreen />;

  return (
    <Screen>
      <Header
        eyebrow="Profile"
        title={userName}
        subtitle={userRole === "admin" ? "Full app access" : userRole === "doctor" ? "Doctor workspace" : "Patient account"}
      />
      <Card>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.initial, { color: colors.primaryForeground }]}>{userName.slice(0, 1)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.foreground }]}>{userName}</Text>
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>{userRole}@clinic.com</Text>
            <Text style={[styles.roleBadge, { color: colors.primary }]}>{userRole.toUpperCase()}</Text>
          </View>
        </View>
      </Card>

      <SectionTitle title="Contact information" />
      <Card>
        <Info icon="phone" label="Clinic contact number" value={clinicNumber} />
        <Info icon="mail" label="Email" value={`${userRole}@clinic.com`} />
        <Info icon="calendar" label="Date of birth" value={userRole === "patient" ? "12 May 1992" : "-"} />
        <Info icon="user" label="Gender" value={userRole === "patient" ? selectedPatient.gender : "-"} />
      </Card>

      {userRole === "admin" ? (
        <>
          <SectionTitle title="Admin overview" />
          <Card>
            <Text style={[styles.detail, { color: colors.foreground }]}>
              Admin can view all patients, doctors, appointments, call recordings, call reasons, symptom checker results, and department demand.
            </Text>
            <Text style={[styles.detail, { color: colors.mutedForeground }]}>
              Patients: 2 · Doctors: {doctors.length} · Appointments: {appointments.length} · Calls: {calls.length}
            </Text>
          </Card>
        </>
      ) : null}

      {userRole !== "admin" ? (
        <>
          <SectionTitle title="Patient records" />
          {records.map((record) => (
            <Card key={record.id}>
              <Text style={[styles.name, { color: colors.foreground }]}>{record.title}</Text>
              <Text style={[styles.meta, { color: colors.mutedForeground }]}>{record.type} · {record.date}</Text>
              <Text style={[styles.detail, { color: colors.foreground }]}>{record.detail}</Text>
            </Card>
          ))}
        </>
      ) : null}

      <ActionButton title="Logout" icon="log-out" variant="secondary" onPress={logout} />
    </Screen>
  );
}

function Info({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={styles.infoRow}>
      <Feather name={icon} size={19} color={colors.primary} />
      <View>
        <Text style={[styles.meta, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  avatar: {
    alignItems: "center",
    borderRadius: 32,
    height: 66,
    justifyContent: "center",
    width: 66,
  },
  initial: {
    fontSize: 28,
    fontWeight: "700",
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
  roleBadge: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  infoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  detail: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
  },
});