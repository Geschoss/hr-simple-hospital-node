({
  method: async (patient: Patient) => {
    return await domain.patient.create(patient);
  },
  reject: (error: Error, patient: Patient) => {
    return `Can't create patient ${patient.fullName}`;
  },
});
