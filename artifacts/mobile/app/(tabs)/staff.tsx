import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card, Header, MetricCard, Screen, SectionTitle } from "@/components/ClinicUI";
import { useColors } from "@/hooks/useColors";
import { useClinic } from "@/lib/ClinicContext";

const staff = [
  { name: "Nisha Varma", role: "Reception lead", status: "Handling call desk" },
  { name: "Fatima Ali", role: "Senior nurse", status: "Vitals and triage" },
  { name: "George Mathew", role: "Billing coordinator", status: "Insurance desk" },
  { name: "Ritika Sen", role: "Lab technician", status: "Reports queue" },
];

export default function StaffScreen() {
  const colors = useColors();
  const { appointments, calls } = useClinic();
  const fieldCounts = useMemo(() => {
    const totals = new Map<string, number>();
    calls.forEach((call) => totals.set(call.field, (totals.get(call.field) ?? 0) + 1));
    appointments.forEach((appointment) => totals.set(appointment.disease, (totals.get(appointment.disease) ?? 0) + 1));
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [appointments, calls]);

  const max = Math.max(...fieldCounts.map(([, count]) => count), 1);

  return (
    <Screen>
      <Header
        eyebrow="Staff"
        title="Clinic operations"
        subtitle="Track patient demand by department and see staff responsibilities clearly."
      />

      <View style={styles.metrics}>
        <MetricCard label="Visitors today" value={`${appointments.length + 18}`} tone="#1267D8" icon="users" />
        <MetricCard label="Calls logged" value={`${calls.length}`} tone="#2E90FA" icon="phone-call" />
        <MetricCard label="Nurse tasks" value="12" tone="#12B76A" icon="heart" />
        <MetricCard label="Open claims" value="7" tone="#F79009" icon="credit-card" />
      </View>

      <SectionTitle title="Department demand" />
      <Card>
        {fieldCounts.map(([field, count]) => (
          <View key={field} style={styles.barRow}>
            <View style={styles.barTop}>
              <Text style={[styles.barLabel, { color: colors.foreground }]}>{field}</Text>
              <Text style={[styles.barCount, { color: colors.primary }]}>{count}</Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.muted }]}>
              <View style={[styles.bar, { width: `${Math.max((count / max) * 100, 14)}%`, backgroundColor: colors.primary }]} />
            </View>
          </View>
        ))}
      </Card>

      <SectionTitle title="Staff desk" />
      {staff.map((member) => (
        <Card key={member.name}>
          <View style={styles.staffRow}>
            <View style={[styles.staffIcon, { backgroundColor: colors.accent }]}>
              <Feather name="briefcase" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.staffName, { color: colors.foreground }]}>{member.name}</Text>
              <Text style={[styles.meta, { color: colors.mutedForeground }]}>{member.role}</Text>
            </View>
            <Text style={[styles.status, { color: colors.primary }]}>{member.status}</Text>
          </View>
        </Card>
      ))}

      <Card>
        <SectionTitle title="Next production modules" />
        <Text style={[styles.detail, { color: colors.foreground }]}>
          Production version can add real phone integration, automatic call transcription, insurance workflow, payments, telemedicine, and admin permissions.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  barRow: {
    gap: 8,
  },
  barTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  barLabel: {
    fontWeight: "700",
    fontSize: 14,
  },
  barCount: {
    fontWeight: "700",
    fontSize: 14,
  },
  track: {
    borderRadius: 999,
    height: 10,
    overflow: "hidden",
  },
  bar: {
    borderRadius: 999,
    height: 10,
  },
  staffRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  staffIcon: {
    alignItems: "center",
    borderRadius: 16,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  staffName: {
    fontWeight: "700",
    fontSize: 15,
  },
  meta: {
    fontWeight: "500",
    fontSize: 12,
  },
  status: {
    flex: 1,
    fontWeight: "700",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "right",
  },
  detail: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 22,
  },
});