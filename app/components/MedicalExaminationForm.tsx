"use client";

import { useState, useEffect } from "react";
import { Patient } from "@/types";

interface MedicalExaminationFormProps {
  patient: Patient | null;
  onSave: (patientData: Partial<Patient>) => void;
  onClose: () => void;
}

export default function MedicalExaminationForm({
  patient,
  onSave,
  onClose,
}: MedicalExaminationFormProps) {
  const [showEyeExaminationPopup, setShowEyeExaminationPopup] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({
    surname: patient?.surname || "",
    gender: patient?.gender || "",
    chiefComplaint: patient?.chiefComplaint || "",
    vod: patient?.vod || "",
    vos: patient?.vos || "",
    odSph: patient?.odSph || "",
    odCyl: patient?.odCyl || "",
    odAxis: patient?.odAxis || "",
    osSph: patient?.osSph || "",
    osCyl: patient?.osCyl || "",
    osAxis: patient?.osAxis || "",
    nearVisionOD: patient?.nearVisionOD || "",
    nearVisionOS: patient?.nearVisionOS || "",
    iop: patient?.iop || "",
    eyeMovement: patient?.eyeMovement || "",
    eyeMovementDirection: patient?.eyeMovementDirection || "",
    eyeMovementRestricted: patient?.eyeMovementRestricted || "",
    conjunctivaOD: patient?.conjunctivaOD || "",
    conjunctivaOS: patient?.conjunctivaOS || "",
    corneaOD: patient?.corneaOD || "",
    corneaOS: patient?.corneaOS || "",
    anteriorChamberOD: patient?.anteriorChamberOD || "",
    anteriorChamberOS: patient?.anteriorChamberOS || "",
    pupilOD: patient?.pupilOD || "",
    pupilOS: patient?.pupilOS || "",
    irisOD: patient?.irisOD || "",
    irisOS: patient?.irisOS || "",
    lensOD: patient?.lensOD || "",
    lensOS: patient?.lensOS || "",
    retinaOD: patient?.retinaOD || "",
    retinaOS: patient?.retinaOS || "",
    vitreousOD: patient?.vitreousOD || "",
    vitreousOS: patient?.vitreousOS || "",
    maculaOD: patient?.maculaOD || "",
    maculaOS: patient?.maculaOS || "",
    bloodVesselsOD: patient?.bloodVesselsOD || "",
    bloodVesselsOS: patient?.bloodVesselsOS || "",
    diagnosis: patient?.diagnosis || "",
    recommendations: patient?.recommendations || "",
    followUp: patient?.followUp || "",
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        surname: patient.surname || "",
        gender: patient.gender || "",
        chiefComplaint: patient.chiefComplaint || "",
        vod: patient.vod || "",
        vos: patient.vos || "",
        odSph: patient.odSph || "",
        odCyl: patient.odCyl || "",
        odAxis: patient.odAxis || "",
        osSph: patient.osSph || "",
        osCyl: patient.osCyl || "",
        osAxis: patient.osAxis || "",
        nearVisionOD: patient.nearVisionOD || "",
        nearVisionOS: patient.nearVisionOS || "",
        iop: patient.iop || "",
        eyeMovement: patient.eyeMovement || "",
        eyeMovementDirection: patient.eyeMovementDirection || "",
        eyeMovementRestricted: patient.eyeMovementRestricted || "",
        conjunctivaOD: patient.conjunctivaOD || "",
        conjunctivaOS: patient.conjunctivaOS || "",
        corneaOD: patient.corneaOD || "",
        corneaOS: patient.corneaOS || "",
        anteriorChamberOD: patient.anteriorChamberOD || "",
        anteriorChamberOS: patient.anteriorChamberOS || "",
        pupilOD: patient.pupilOD || "",
        pupilOS: patient.pupilOS || "",
        irisOD: patient.irisOD || "",
        irisOS: patient.irisOS || "",
        lensOD: patient.lensOD || "",
        lensOS: patient.lensOS || "",
        retinaOD: patient.retinaOD || "",
        retinaOS: patient.retinaOS || "",
        vitreousOD: patient.vitreousOD || "",
        vitreousOS: patient.vitreousOS || "",
        maculaOD: patient.maculaOD || "",
        maculaOS: patient.maculaOS || "",
        bloodVesselsOD: patient.bloodVesselsOD || "",
        bloodVesselsOS: patient.bloodVesselsOS || "",
        diagnosis: patient.diagnosis || "",
        recommendations: patient.recommendations || "",
        followUp: patient.followUp || "",
      });
    }
  }, [patient]);

  useEffect(() => {
    if (!patient?.id) return;
    const controller = new AbortController();
    fetch(`/api/medical-examinations?patientId=${patient.id}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.exam) {
          setFormData((prev) => ({ ...prev, ...data.exam }));
        }
      })
      .catch(() => {
        // swallow fetch errors to keep UI usable
      });
    return () => controller.abort();
  }, [patient?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient?.id) {
      onClose();
      return;
    }

    try {
      const res = await fetch("/api/medical-examinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: patient.id, exam: formData }),
      });
      if (!res.ok) {
        console.error("Failed to save examination");
      }
    } catch (err) {
      console.error("Failed to save examination", err);
    }

    onSave(formData);
    onClose();
  };

  const updateField = (field: keyof Patient, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[90vh] my-4 flex flex-col">
        <div className="flex-shrink-0 mb-3">
          <h2 className="text-xl font-bold">Эмнэлгийн шинжилгээний бүртгэл</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-y-auto flex-1 pr-2"
        >
          {/* Top Section - Patient Demographics and Visual Acuity */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column - Patient Info and Visual Acuity */}
            <div className="bg-gray-100 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Овог</label>
                  <input
                    type="text"
                    value={formData.surname || ""}
                    onChange={(e) => updateField("surname", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Нэр</label>
                  <input
                    type="text"
                    value={patient?.name || ""}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Нас</label>
                  <input
                    type="text"
                    value={patient?.age || ""}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Хүйс</label>
                  <input
                    type="text"
                    value={formData.gender || ""}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Зовуур:
                </label>
                <textarea
                  value={formData.chiefComplaint || ""}
                  onChange={(e) =>
                    updateField("chiefComplaint", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">VOD</label>
                  <input
                    type="text"
                    value={formData.vod || ""}
                    onChange={(e) => updateField("vod", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">VOS</label>
                  <input
                    type="text"
                    value={formData.vos || ""}
                    onChange={(e) => updateField("vos", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">BCVA</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-12 font-medium">OD</span>
                    <span className="text-sm">sph</span>
                    <input
                      type="text"
                      value={formData.odSph || ""}
                      onChange={(e) => updateField("odSph", e.target.value)}
                      className="w-20 px-2 py-1 border rounded-md text-sm"
                      placeholder="0.00"
                    />
                    <span className="text-sm">cyl</span>
                    <input
                      type="text"
                      value={formData.odCyl || ""}
                      onChange={(e) => updateField("odCyl", e.target.value)}
                      className="w-20 px-2 py-1 border rounded-md text-sm"
                      placeholder="0.00"
                    />
                    <span className="text-sm">x</span>
                    <input
                      type="text"
                      value={formData.odAxis || ""}
                      onChange={(e) => updateField("odAxis", e.target.value)}
                      className="w-20 px-2 py-1 border rounded-md text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-12 font-medium">OS</span>
                    <span className="text-sm">sph</span>
                    <input
                      type="text"
                      value={formData.osSph || ""}
                      onChange={(e) => updateField("osSph", e.target.value)}
                      className="w-20 px-2 py-1 border rounded-md text-sm"
                      placeholder="0.00"
                    />
                    <span className="text-sm">cyl</span>
                    <input
                      type="text"
                      value={formData.osCyl || ""}
                      onChange={(e) => updateField("osCyl", e.target.value)}
                      className="w-20 px-2 py-1 border rounded-md text-sm"
                      placeholder="0.00"
                    />
                    <span className="text-sm">x</span>
                    <input
                      type="text"
                      value={formData.osAxis || ""}
                      onChange={(e) => updateField("osAxis", e.target.value)}
                      className="w-20 px-2 py-1 border rounded-md text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Near Vision OD
                  </label>
                  <input
                    type="text"
                    value={formData.nearVisionOD || ""}
                    onChange={(e) =>
                      updateField("nearVisionOD", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="+ 0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Near Vision OS
                  </label>
                  <input
                    type="text"
                    value={formData.nearVisionOS || ""}
                    onChange={(e) =>
                      updateField("nearVisionOS", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="+ 0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">IOP</label>
                  <input
                    type="text"
                    value={formData.iop || ""}
                    onChange={(e) => updateField("iop", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Нүдний хөдөлгөөн
                </label>
                <textarea
                  value={formData.eyeMovement || ""}
                  onChange={(e) => updateField("eyeMovement", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  rows={2}
                />
              </div>
            </div>

            {/* Right Column - Eye Findings */}
            <div className="bg-gray-200 p-4 rounded-lg flex flex-col justify-center items-center">
              <div className="text-center">
                <h3 className="font-semibold text-base mb-3">
                  Нүдний шинжилгээ
                </h3>
                <button
                  type="button"
                  onClick={() => setShowEyeExaminationPopup(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium mb-2"
                >
                  Нээх
                </button>
                <p className="text-xs text-gray-600">
                  Нүдний шинжилгээний мэдээллийг харах/засах
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section - Diagnosis, Recommendations, Follow-up */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <label className="block text-sm font-medium mb-2">Онош:</label>
              <textarea
                value={formData.diagnosis || ""}
                onChange={(e) => updateField("diagnosis", e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={3}
              />
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <label className="block text-sm font-medium mb-2">
                Зөвлөгөө:
              </label>
              <textarea
                value={formData.recommendations || ""}
                onChange={(e) => updateField("recommendations", e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={3}
              />
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <label className="block text-sm font-medium mb-2">
                Дараагийн үзлэг:
              </label>
              <textarea
                value={formData.followUp || ""}
                onChange={(e) => updateField("followUp", e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0 pt-2 border-t">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Хадгалах
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 text-sm"
            >
              Цуцлах
            </button>
          </div>
        </form>

        {/* Eye Examination Popup */}
        {showEyeExaminationPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Нүдний шинжилгээ</h3>
                <button
                  type="button"
                  onClick={() => setShowEyeExaminationPopup(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium border-b pb-2">
                  <div>Зовхи</div>
                  <div>Баруун</div>
                  <div>Зүүн</div>
                </div>
                {[
                  { key: "conjunctiva", label: "Салст" },
                  { key: "cornea", label: "Эвэрлэг" },
                  { key: "anteriorChamber", label: "Өмнөд торго" },
                  { key: "pupil", label: "Хүүхэн хараа" },
                  { key: "iris", label: "Солонгон бүрхүүл" },
                  { key: "lens", label: "Болор" },
                  { key: "retina", label: "Торлог" },
                  { key: "vitreous", label: "Шилэнцэр" },
                  { key: "macula", label: "Шар толбо" },
                  { key: "bloodVessels", label: "Судсууд" },
                ].map(({ key, label }) => {
                  const odKey = `${key}OD` as keyof Patient;
                  const osKey = `${key}OS` as keyof Patient;
                  return (
                    <div
                      key={key}
                      className="grid grid-cols-3 gap-4 items-start"
                    >
                      <div className="text-sm font-medium py-2">{label}</div>
                      <textarea
                        value={(formData[odKey] as string) || ""}
                        onChange={(e) => updateField(odKey, e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm w-full"
                        rows={3}
                        placeholder="Мэдээлэл оруулах..."
                      />
                      <textarea
                        value={(formData[osKey] as string) || ""}
                        onChange={(e) => updateField(osKey, e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm w-full"
                        rows={3}
                        placeholder="Мэдээлэл оруулах..."
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEyeExaminationPopup(false)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Хадгалах
                </button>
                <button
                  type="button"
                  onClick={() => setShowEyeExaminationPopup(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Хаах
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
