"use client";

import { useState, useEffect } from "react";
import { Doctor, Patient, Appointment } from "@/types";
import DoctorForm from "./components/DoctorForm";
import PatientForm from "./components/PatientForm";
import AppointmentForm from "./components/AppointmentForm";
import MedicalExaminationForm from "./components/MedicalExaminationForm";

export default function Home() {
  const [currentUserRole, setCurrentUserRole] = useState<
    "SUPERADMIN" | "DOCTOR" | null
  >(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showMedicalExaminationForm, setShowMedicalExaminationForm] =
    useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    // fetch current user info
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUserRole(data.user.role);
          setCurrentUserEmail(data.user.email);
        }
      })
      .catch(() => {
        setCurrentUserRole(null);
        setCurrentUserEmail(null);
      });

    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        if (data.patients) setPatients(data.patients);
      })
      .catch(() => setPatients([]));

    const savedDoctors = localStorage.getItem("doctors");
    const savedAppointments = localStorage.getItem("appointments");

    if (savedDoctors) setDoctors(JSON.parse(savedDoctors));
    if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("doctors", JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const addDoctor = (doctorData: Omit<Doctor, "id">) => {
    const newDoctor: Doctor = {
      ...doctorData,
      id: Date.now().toString(),
    };
    setDoctors([...doctors, newDoctor]);
  };

  const addPatient = async (patientData: Omit<Patient, "id">) => {
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData),
      });
      if (!res.ok) throw new Error("Failed to create patient");
      const data = await res.json();
      if (data.patient) {
        setPatients((prev) => [data.patient, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updatePatientMedicalData = (patientData: Partial<Patient>) => {
    if (!selectedPatient) return;
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id ? { ...p, ...patientData } : p
      )
    );
    setSelectedPatient(null);
  };

  const deletePatient = async (id: string) => {
    try {
      const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete patient");
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setAppointments((prev) => prev.filter((apt) => apt.patientId !== id));
      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
        setShowMedicalExaminationForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addAppointment = (appointmentData: Omit<Appointment, "id">) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
    };
    setAppointments([...appointments, newAppointment]);
  };

  const saveEditedAppointment = (updated: Appointment) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === updated.id ? updated : apt))
    );
    setEditingAppointment(null);
  };

  const updateAppointmentStatus = (
    id: string,
    status: Appointment["status"]
  ) => {
    setAppointments(
      appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  const getDoctorName = (id: string) => {
    return doctors.find((d) => d.id === id)?.name || "Тодорхойгүй";
  };

  const getPatientName = (id: string) => {
    return patients.find((p) => p.id === id)?.name || "Тодорхойгүй";
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "Захиалсан";
      case "completed":
        return "Дууссан";
      case "cancelled":
        return "Цуцлагдсан";
      default:
        return status;
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    setCurrentUserRole(null);
    setCurrentUserEmail(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Эмчийн Цаг Захиалгын Систем
            </h1>
            <p className="text-gray-600">Эмч, өвчтөний цаг бүртгэл удирдах</p>
          </div>
          <div className="flex items-center gap-3">
            {currentUserEmail ? (
              <>
                <div className="text-right">
                  <p className="text-sm text-gray-700">{currentUserEmail}</p>
                  <p className="text-xs text-gray-500">
                    Эрх:{" "}
                    {currentUserRole === "SUPERADMIN" ? "Superadmin" : "Эмч"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
                >
                  Гарах
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                Нэвтрэх
              </a>
            )}
          </div>
        </header>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {currentUserRole === "SUPERADMIN" && (
            <button
              onClick={() => setShowDoctorForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              + Эмч нэмэх (зөвхөн супер админ)
            </button>
          )}
          <button
            onClick={() => setShowPatientForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-lg"
          >
            + Өвчтөн нэмэх
          </button>
          <button
            onClick={() => setShowAppointmentForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg"
          >
            + Цаг захиалах
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Эмч</h3>
            <p className="text-3xl font-bold text-blue-600">{doctors.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Өвчтөн</h3>
            <p className="text-3xl font-bold text-green-600">
              {patients.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Захиалга
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {appointments.length}
            </p>
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Өвчтөний жагсаалт
          </h2>
          {patients.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Өвчтөн байхгүй байна. Өвчтөн нэмэх товч дараад нэмнэ үү.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-gray-700">Нэр</th>
                    <th className="text-left p-3 text-gray-700">Утас</th>
                    <th className="text-left p-3 text-gray-700">Имэйл</th>
                    <th className="text-left p-3 text-gray-700">Нас</th>
                    <th className="text-left p-3 text-gray-700">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{patient.name}</td>
                      <td className="p-3">{patient.phone}</td>
                      <td className="p-3">{patient.email}</td>
                      <td className="p-3">{patient.age}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setShowMedicalExaminationForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-600 rounded hover:bg-blue-50"
                          >
                            Эмнэлгийн шинжилгээ
                          </button>
                          <button
                            onClick={() => deletePatient(patient.id)}
                            className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-600 rounded hover:bg-red-50"
                          >
                            Устгах
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Захиалгын жагсаалт
          </h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Захиалга байхгүй байна. Цаг захиалах товч дараад нэмнэ үү.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-gray-700">Эмч</th>
                    <th className="text-left p-3 text-gray-700">Өвчтөн</th>
                    <th className="text-left p-3 text-gray-700">Огноо</th>
                    <th className="text-left p-3 text-gray-700">Цаг</th>
                    <th className="text-left p-3 text-gray-700">Шалтгаан</th>
                    <th className="text-left p-3 text-gray-700">Төлөв</th>
                    <th className="text-left p-3 text-gray-700">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        {getDoctorName(appointment.doctorId)}
                      </td>
                      <td className="p-3">
                        {getPatientName(appointment.patientId)}
                      </td>
                      <td className="p-3">{appointment.date}</td>
                      <td className="p-3">{appointment.time}</td>
                      <td className="p-3 max-w-xs truncate">
                        {appointment.reason}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingAppointment(appointment);
                              setShowAppointmentForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Засах
                          </button>
                          {appointment.status === "scheduled" && (
                            <>
                              <button
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment.id,
                                    "completed"
                                  )
                                }
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                Дуусгах
                              </button>
                              <button
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment.id,
                                    "cancelled"
                                  )
                                }
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Цуцлах
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteAppointment(appointment.id)}
                            className="text-gray-600 hover:text-gray-800 text-sm"
                          >
                            Устгах
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Forms */}
        {showDoctorForm && (
          <DoctorForm
            onAdd={addDoctor}
            onClose={() => setShowDoctorForm(false)}
          />
        )}
        {showPatientForm && (
          <PatientForm
            onAdd={addPatient}
            onClose={() => setShowPatientForm(false)}
          />
        )}
        {showAppointmentForm && (
          <AppointmentForm
            doctors={doctors}
            patients={patients}
            appointment={editingAppointment ?? undefined}
            onAdd={!editingAppointment ? addAppointment : undefined}
            onUpdate={editingAppointment ? saveEditedAppointment : undefined}
            onClose={() => {
              setEditingAppointment(null);
              setShowAppointmentForm(false);
            }}
          />
        )}
        {showMedicalExaminationForm && selectedPatient && (
          <MedicalExaminationForm
            patient={selectedPatient}
            onSave={updatePatientMedicalData}
            onClose={() => {
              setShowMedicalExaminationForm(false);
              setSelectedPatient(null);
            }}
          />
        )}
      </div>
    </main>
  );
}
