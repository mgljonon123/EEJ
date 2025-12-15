"use client";

import { useState } from "react";
import { Appointment, Doctor, Patient } from "@/types";

interface AppointmentFormProps {
  doctors: Doctor[];
  patients: Patient[];
  onAdd?: (appointment: Omit<Appointment, "id">) => void;
  onUpdate?: (appointment: Appointment) => void;
  appointment?: Appointment;
  onClose: () => void;
}

export default function AppointmentForm({
  doctors,
  patients,
  onAdd,
  onUpdate,
  appointment,
  onClose,
}: AppointmentFormProps) {
  const isEdit = Boolean(appointment);
  const [formData, setFormData] = useState({
    doctorId: appointment?.doctorId ?? "",
    patientId: appointment?.patientId ?? "",
    date: appointment?.date ?? "",
    time: appointment?.time ?? "",
    reason: appointment?.reason ?? "",
    status: appointment?.status ?? "scheduled",
  });
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  // Generate time slots from 10:00 AM to 4:30 PM in 15-minute intervals
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 10; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 16 && minute > 30) break; // Stop at 4:30 PM
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Check if selected date is a weekday (Monday-Friday)
  const isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday = 1, Friday = 5
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (selectedDate && !isWeekday(selectedDate)) {
      alert("Зөвхөн Даваа-Баасан гаригт цаг захиалж болно.");
      return;
    }
    setFormData({ ...formData, date: selectedDate });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) {
      alert("Цаг сонгоно уу.");
      return;
    }
    if (
      formData.doctorId &&
      formData.patientId &&
      formData.date &&
      formData.time &&
      formData.reason
    ) {
      if (isEdit && appointment && onUpdate) {
        onUpdate({
          ...appointment,
          ...formData,
        });
      } else if (onAdd) {
        onAdd({
          doctorId: formData.doctorId,
          patientId: formData.patientId,
          date: formData.date,
          time: formData.time,
          reason: formData.reason,
          status: formData.status as Appointment["status"],
        });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {isEdit ? "Захиалга засах" : "Цаг захиалах"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Эмч</label>
            <select
              value={formData.doctorId}
              onChange={(e) =>
                setFormData({ ...formData, doctorId: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Сонгох</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Өвчтөн</label>
            <select
              value={formData.patientId}
              onChange={(e) =>
                setFormData({ ...formData, patientId: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Сонгох</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.age} настай)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Огноо (Даваа-Баасан гариг)
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Зөвхөн Даваа-Баасан гаригт цаг захиалж болно
            </p>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Цаг (10:00 - 16:30, 15 минутын интервал)
            </label>
            <button
              type="button"
              onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
              className="w-full px-3 py-2 border rounded-md text-left bg-white flex items-center justify-between"
            >
              <span>
                {formData.time
                  ? (() => {
                      const [hours, minutes] = formData.time.split(":");
                      const hour = parseInt(hours);
                      const ampm = hour >= 12 ? "PM" : "AM";
                      const displayHour =
                        hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                      return `${displayHour}:${minutes} ${ampm}`;
                    })()
                  : "Цаг сонгох"}
              </span>
              <span className="text-gray-400">▼</span>
            </button>
            {isTimeDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsTimeDropdownOpen(false)}
                />
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, time: "" });
                      setIsTimeDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                      !formData.time ? "bg-blue-50" : ""
                    }`}
                  >
                    Цаг сонгох
                  </button>
                  {timeSlots.map((time) => {
                    const [hours, minutes] = time.split(":");
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? "PM" : "AM";
                    const displayHour =
                      hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                    const displayTime = `${displayHour}:${minutes} ${ampm}`;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, time });
                          setIsTimeDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                          formData.time === time ? "bg-blue-50" : ""
                        }`}
                      >
                        {displayTime}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Шалтгаан</label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Төлөв</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as Appointment["status"],
                })
              }
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="scheduled">Захиалсан</option>
              <option value="completed">Дууссан</option>
              <option value="cancelled">Цуцлагдсан</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
            >
              {isEdit ? "Хадгалах" : "Захиалах"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
            >
              Цуцлах
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


