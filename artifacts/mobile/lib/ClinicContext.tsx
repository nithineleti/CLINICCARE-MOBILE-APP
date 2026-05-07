import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  focus: string;
  rating: number;
  experience: string;
  nextSlot: string;
  fee: string;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  city: string;
  insurance: string;
  emergencyContact: string;
};

export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  issue: string;
  disease: string;
  type: "In-person" | "Virtual";
  date: string;
  status: "Booked" | "Checked in" | "Completed" | "Cancelled";
};

export type CallRecord = {
  id: string;
  patientName: string;
  phone: string;
  city: string;
  purpose: string;
  field: string;
  transcript: string;
  time: string;
  action: string;
};

export type MedicalRecord = {
  id: string;
  title: string;
  detail: string;
  date: string;
  type: "Visit" | "Lab" | "Prescription" | "Allergy";
};

export type UserRole = "admin" | "patient" | "doctor";

type ClinicState = {
  clinicNumber: string;
  userRole: UserRole | null;
  userName: string;
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  calls: CallRecord[];
  records: MedicalRecord[];
  selectedPatient: Patient;
  bookAppointment: (appointment: Omit<Appointment, "id" | "status">) => void;
  addCall: (call: Omit<CallRecord, "id" | "time">) => void;
  markCheckedIn: (id: string) => void;
  cancelAppointment: (id: string) => void;
  login: (role: UserRole) => void;
  logout: () => void;
};

const STORAGE_KEY = "cliniccare-state-v1";
export const CLINIC_CONTACT_NUMBER = "7416749757";

const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Aisha Raman",
    specialty: "Cardiology",
    focus: "Chest pain, blood pressure, heart rhythm",
    rating: 4.9,
    experience: "14 yrs",
    nextSlot: "Today 4:20 PM",
    fee: "₹200",
  },
  {
    id: "d2",
    name: "Dr. Kabir Malhotra",
    specialty: "General Medicine",
    focus: "Fever, infections, diabetes, general checkups",
    rating: 4.8,
    experience: "11 yrs",
    nextSlot: "Tomorrow 10:15 AM",
    fee: "₹150",
  },
  {
    id: "d3",
    name: "Dr. Sana Joseph",
    specialty: "Dermatology",
    focus: "Rashes, allergies, acne, skin infections",
    rating: 4.7,
    experience: "9 yrs",
    nextSlot: "Today 6:00 PM",
    fee: "₹180",
  },
  {
    id: "d4",
    name: "Dr. Naveen Rao",
    specialty: "Orthopedics",
    focus: "Joint pain, fractures, spine and sports injury",
    rating: 4.8,
    experience: "16 yrs",
    nextSlot: "Friday 1:30 PM",
    fee: "₹300",
  },
  {
    id: "d5",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    focus: "Headache, dizziness, seizures, nerve pain",
    rating: 4.9,
    experience: "15 yrs",
    nextSlot: "Saturday 11:40 AM",
    fee: "₹250",
  },
  {
    id: "d6",
    name: "Dr. Emily Watson",
    specialty: "Pediatrics",
    focus: "Child fever, vaccination, growth and nutrition",
    rating: 4.8,
    experience: "10 yrs",
    nextSlot: "Monday 9:30 AM",
    fee: "₹160",
  },
];

const patients: Patient[] = [
  {
    id: "p1",
    name: "Maya Sharma",
    age: 34,
    gender: "Female",
    phone: "+91 98765 43120",
    city: "Indiranagar",
    insurance: "CarePlus Gold",
    emergencyContact: "Rohan Sharma, spouse",
  },
  {
    id: "p2",
    name: "Arjun Nair",
    age: 48,
    gender: "Male",
    phone: "+91 99887 11220",
    city: "Whitefield",
    insurance: "MediShield Prime",
    emergencyContact: "Kavya Nair, sister",
  },
];

const initialAppointments: Appointment[] = [
  {
    id: "a1",
    patientId: "p1",
    doctorId: "d1",
    issue: "Chest discomfort",
    disease: "Hypertension review",
    type: "In-person",
    date: "Today 4:20 PM",
    status: "Booked",
  },
  {
    id: "a2",
    patientId: "p2",
    doctorId: "d2",
    issue: "Fever and weakness",
    disease: "Viral infection",
    type: "Virtual",
    date: "Tomorrow 10:15 AM",
    status: "Checked in",
  },
];

const initialCalls: CallRecord[] = [
  {
    id: "c1",
    patientName: "Maya Sharma",
    phone: "+91 98765 43120",
    city: "Indiranagar",
    purpose: "Appointment booking",
    field: "Cardiology",
    transcript: "Patient reported chest discomfort after climbing stairs and asked for the earliest cardiology appointment.",
    time: "09:42 AM",
    action: "Booked cardiology visit",
  },
  {
    id: "c2",
    patientName: "Vikram Das",
    phone: "+91 97654 00219",
    city: "Koramangala",
    purpose: "Report follow-up",
    field: "General Medicine",
    transcript: "Patient asked whether blood test reports are ready and requested a call back from nursing staff.",
    time: "11:05 AM",
    action: "Assigned nurse callback",
  },
];

const records: MedicalRecord[] = [
  {
    id: "r1",
    title: "Blood pressure follow-up",
    detail: "BP 138/88. Continue medication and monitor twice daily for two weeks.",
    date: "Apr 8",
    type: "Visit",
  },
  {
    id: "r2",
    title: "CBC and lipid profile",
    detail: "Reports reviewed. LDL slightly elevated. Lifestyle changes advised.",
    date: "Apr 7",
    type: "Lab",
  },
  {
    id: "r3",
    title: "Amlodipine 5mg",
    detail: "One tablet every morning after breakfast. Refill due in 18 days.",
    date: "Active",
    type: "Prescription",
  },
  {
    id: "r4",
    title: "Penicillin allergy",
    detail: "Severe rash reported in childhood. Avoid penicillin-based medication.",
    date: "Critical",
    type: "Allergy",
  },
];

const ClinicContext = createContext<ClinicState | null>(null);

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [calls, setCalls] = useState<CallRecord[]>(initialCalls);
  const [userRole, setUserRole] = useState<UserRole | null>("admin");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!stored) return;
      const parsed = JSON.parse(stored) as {
        appointments?: Appointment[];
        calls?: CallRecord[];
        userRole?: UserRole | null;
      };
      setAppointments(parsed.appointments ?? initialAppointments);
      setCalls(parsed.calls ?? initialCalls);
      setUserRole(parsed.userRole ?? "admin");
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ appointments, calls, userRole }));
  }, [appointments, calls, userRole]);

  const value = useMemo<ClinicState>(
    () => ({
      clinicNumber: CLINIC_CONTACT_NUMBER,
      userRole,
      userName:
        userRole === "doctor"
          ? doctors[0].name
          : userRole === "patient"
            ? patients[0].name
            : "Clinic Admin",
      doctors,
      patients,
      appointments,
      calls,
      records,
      selectedPatient: patients[0],
      bookAppointment: (appointment) => {
        setAppointments((current) => [
          {
            ...appointment,
            id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
            status: "Booked",
          },
          ...current,
        ]);
      },
      addCall: (call) => {
        setCalls((current) => [
          {
            ...call,
            id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          ...current,
        ]);
      },
      markCheckedIn: (id) => {
        setAppointments((current) =>
          current.map((item) =>
            item.id === id ? { ...item, status: "Checked in" } : item,
          ),
        );
      },
      cancelAppointment: (id) => {
        setAppointments((current) =>
          current.map((item) =>
            item.id === id ? { ...item, status: "Cancelled" } : item,
          ),
        );
      },
      login: (role) => setUserRole(role),
      logout: () => setUserRole(null),
    }),
    [appointments, calls, userRole],
  );

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error("useClinic must be used within ClinicProvider");
  }
  return context;
}