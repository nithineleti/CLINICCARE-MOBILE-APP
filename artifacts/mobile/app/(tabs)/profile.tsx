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

      {userRole === "patient" && (
        <>
          <SectionTitle title="Patient Metrics" />
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Metric label="Age" value={`${selectedPatient.age} yrs`} />
              <Metric label="Gender" value={selectedPatient.gender} />
              <Metric label="City" value={selectedPatient.city} />
            </View>
          </Card>

          <SectionTitle title="Emergency Contact" />
          <Card>
            <Info icon="alert-circle" label="Emergency person" value={selectedPatient.emergencyContact} />
          </Card>

          <SectionTitle title="Insurance Information" />
          <Card>
            <Info icon="shield" label="Primary Policy" value={selectedPatient.insurance} />
          </Card>
        </>
      )}

      {userRole === "doctor" && (
        <>
          <SectionTitle title="Physician Details" />
          <Card>
            <Info icon="award" label="Experience" value={doctors[0].experience} />
            <Info icon="activity" label="Specialty" value={doctors[0].specialty} />
            <Info icon="star" label="Rating" value={`${doctors[0].rating}/5.0`} />
          </Card>

          <SectionTitle title="Current Schedule Stats" />
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Metric label="Appts" value={appointments.length.toString()} />
              <Metric label="Calls" value={calls.length.toString()} />
              <Metric label="Wait" value="12m" />
            </View>
          </Card>
        </>
      )}

      {userRole === "admin" && (
        <>
          <SectionTitle title="Global Admin Summary" />
          <Card>
            <Text style={[styles.detail, { color: colors.foreground }]}>
              Admin can view all patients, doctors, appointments, call recordings, and analytical insights.
            </Text>
            <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Metric label="Patients" value="2" />
              <Metric label="Doctors" value={doctors.length.toString()} />
              <Metric label="Appts" value={appointments.length.toString()} />
            </View>
          </Card>

          <SectionTitle title="System Settings" />
          <Card>
            <Info icon="settings" label="Version" value="1.0.4-dev" />
            <Info icon="database" label="API Status" value="Online" />
          </Card>
        </>
      )}

      <View style={{ padding: 20 }}>
        <ActionButton label="Log Out" icon="log-out" variant="secondary" onPress={logout} />
      </View>
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

function Metric({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 13, color: colors.mutedForeground, marginBottom: 4 }}>{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground }}>{value}</Text>
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