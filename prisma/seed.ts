import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const iso = (d: Date) => d.toISOString();

async function main() {
  console.log('Seeding database...');

  // Clean up existing data (order matters due to FK constraints)
  await prisma.checkIn.deleteMany();
  await prisma.billingRecord.deleteMany();
  await prisma.insuranceRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.provider.deleteMany();

  // Create providers
  const emily = await prisma.provider.create({
    data: {
      firstName: 'Emily',
      lastName: 'Chen',
      npi: '1234567890',
      dea: 'BC1234567',
      license: 'LIC-IL-001',
      licenseState: 'IL',
      specialty: 'Family Medicine',
      acceptingNewPatients: true,
      maxDailyAppointments: 20,
      email: 'emily.chen@clinic.example.com',
      phone: '+1-555-1001',
      title: 'MD',
      pronouns: 'she/her',
      defaultSlotDurationMinutes: 15,
      bufferMinutesBetweenAppointments: 5,
      createdBy: 'system-seed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
  });
  console.log(`Created provider: ${emily.firstName} ${emily.lastName} (${emily.id})`);

  const david = await prisma.provider.create({
    data: {
      firstName: 'David',
      lastName: 'Okafor',
      npi: '0987654321',
      dea: 'BD7654321',
      license: 'LIC-IL-002',
      licenseState: 'IL',
      specialty: 'Pediatrics',
      acceptingNewPatients: true,
      maxDailyAppointments: 16,
      email: 'david.okafor@clinic.example.com',
      phone: '+1-555-1002',
      title: 'DO',
      pronouns: 'he/him',
      defaultSlotDurationMinutes: 20,
      bufferMinutesBetweenAppointments: 10,
      createdBy: 'system-seed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    },
  });
  console.log(`Created provider: ${david.firstName} ${david.lastName} (${david.id})`);

  // Create patients
  const alice = await prisma.patient.create({
    data: {
      mrn: 'MRN-001',
      firstName: 'Alice',
      lastName: 'Johnson',
      dateOfBirth: new Date('1985-03-12'),
      gender: 'female',
      email: 'alice.johnson@example.com',
      phone: '+1-555-0101',
      address: JSON.parse(JSON.stringify({
        line1: '123 Maple St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62704',
        country: 'US',
      })),
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      allergies: JSON.parse(JSON.stringify([
        { substance: 'Penicillin', reaction: 'Hives', severity: 'moderate', onsetDate: '2010-05-20' },
      ])),
      insuranceMemberId: 'INS-1001',
      insuranceProvider: 'BlueCross',
      insuranceGroupNumber: 'GRP-500',
      primaryProviderId: emily.id,
      createdBy: 'system-seed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
  });
  console.log(`Created patient: ${alice.firstName} ${alice.lastName} (${alice.id})`);

  const bob = await prisma.patient.create({
    data: {
      mrn: 'MRN-002',
      firstName: 'Bob',
      lastName: 'Martinez',
      dateOfBirth: new Date('1972-11-08'),
      gender: 'male',
      email: 'bob.martinez@example.com',
      phone: '+1-555-0102',
      address: JSON.parse(JSON.stringify({
        line1: '456 Oak Ave',
        line2: 'Apt 2B',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
        country: 'US',
      })),
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      allergies: null,
      insuranceMemberId: 'INS-1002',
      insuranceProvider: 'Aetna',
      insuranceGroupNumber: 'GRP-501',
      primaryProviderId: david.id,
      createdBy: 'system-seed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
  });
  console.log(`Created patient: ${bob.firstName} ${bob.lastName} (${bob.id})`);

  const carol = await prisma.patient.create({
    data: {
      mrn: 'MRN-003',
      firstName: 'Carol',
      lastName: 'Nguyen',
      dateOfBirth: new Date('1999-07-22'),
      gender: 'female',
      email: 'carol.nguyen@example.com',
      phone: '+1-555-0103',
      address: JSON.parse(JSON.stringify({
        line1: '789 Pine Rd',
        city: 'Naperville',
        state: 'IL',
        postalCode: '60540',
        country: 'US',
      })),
      city: 'Naperville',
      state: 'IL',
      zipCode: '60540',
      allergies: JSON.parse(JSON.stringify([
        { substance: 'Sulfa drugs', reaction: 'Rash', severity: 'mild', onsetDate: '2022-01-15' },
        { substance: 'Peanuts', reaction: 'Anaphylaxis', severity: 'severe', onsetDate: '1999-07-22' },
      ])),
      insuranceMemberId: 'INS-1003',
      insuranceProvider: 'UnitedHealth',
      insuranceGroupNumber: 'GRP-502',
      primaryProviderId: emily.id,
      createdBy: 'system-seed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    },
  });
  console.log(`Created patient: ${carol.firstName} ${carol.lastName} (${carol.id})`);

  // Create appointments
  const apt1 = await prisma.appointment.create({
    data: {
      patientId: alice.id,
      providerId: emily.id,
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1 + 15 * 60 * 1000),
      type: 'routine',
      visitType: 'routine',
      status: 'scheduled',
      reasonForVisit: 'Annual physical exam',
      reason: 'Annual physical exam',
      insuranceVerified: true,
      createdBy: 'system-seed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
  });
  console.log(`Created appointment: ${apt1.id}`);

  const apt2 = await prisma.appointment.create({
    data: {
      patientId: bob.id,
      providerId: david.id,
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2 + 20 * 60 * 1000),
      type: 'follow-up',
      visitType: 'follow-up',
      status: 'confirmed',
      reasonForVisit: 'Follow-up on blood pressure',
      reason: 'Follow-up on blood pressure',
      insuranceVerified: true,
      createdBy: 'system-seed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    },
  });
  console.log(`Created appointment: ${apt2.id}`);

  const apt3 = await prisma.appointment.create({
    data: {
      patientId: carol.id,
      providerId: emily.id,
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 15 * 60 * 1000),
      actualStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      actualEnd: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 12 * 60 * 1000),
      type: 'routine',
      visitType: 'routine',
      status: 'completed',
      reasonForVisit: 'Allergy consultation',
      reason: 'Allergy consultation',
      visitNotes: 'Discussed peanut allergy management.',
      notes: 'Discussed peanut allergy management.',
      billingCode: '99213',
      insuranceVerified: true,
      createdBy: 'system-seed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    },
  });
  console.log(`Created appointment: ${apt3.id}`);

  const apt4 = await prisma.appointment.create({
    data: {
      patientId: alice.id,
      providerId: david.id,
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 20 * 60 * 1000),
      type: 'urgent',
      visitType: 'urgent',
      status: 'cancelled',
      reasonForVisit: 'Cold symptoms',
      reason: 'Cold symptoms',
      insuranceVerified: false,
      createdBy: 'system-seed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
  });
  console.log(`Created appointment: ${apt4.id}`);

  // Create billing records
  const bill1 = await prisma.billingRecord.create({
    data: {
      patientId: alice.id,
      appointmentId: apt3.id,
      amount: 150,
      currency: 'USD',
      status: 'paid',
      insuranceAmount: 120,
      patientAmount: 30,
      billingCode: '99213',
      description: 'Family medicine visit',
      dueDate: new Date('2025-08-20'),
      paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    },
  });
  console.log(`Created billing record: ${bill1.id}`);

  const bill2 = await prisma.billingRecord.create({
    data: {
      patientId: carol.id,
      appointmentId: apt3.id,
      amount: 200,
      currency: 'USD',
      status: 'pending',
      insuranceAmount: 170,
      patientAmount: 30,
      billingCode: '99214',
      description: 'Allergy consultation',
      dueDate: new Date('2025-08-25'),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    },
  });
  console.log(`Created billing record: ${bill2.id}`);

  const bill3 = await prisma.billingRecord.create({
    data: {
      patientId: bob.id,
      amount: 75,
      currency: 'USD',
      status: 'overdue',
      insuranceAmount: 0,
      patientAmount: 75,
      description: 'Lab work - metabolic panel',
      dueDate: new Date('2025-08-01'),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    },
  });
  console.log(`Created billing record: ${bill3.id}`);

  // Create insurance records
  const ins1 = await prisma.insuranceRecord.create({
    data: {
      patientId: alice.id,
      insuranceProvider: 'BlueCross',
      memberId: 'INS-1001',
      groupNumber: 'GRP-500',
      eligibilityStatus: 'active',
      coverageStart: new Date('2025-01-01'),
      coverageEnd: new Date('2025-12-31'),
      copayAmount: 25,
      deductibleRemaining: 500,
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
  });
  console.log(`Created insurance record: ${ins1.id}`);

  const ins2 = await prisma.insuranceRecord.create({
    data: {
      patientId: bob.id,
      insuranceProvider: 'Aetna',
      memberId: 'INS-1002',
      groupNumber: 'GRP-501',
      eligibilityStatus: 'active',
      coverageStart: new Date('2025-03-01'),
      coverageEnd: new Date('2026-02-28'),
      copayAmount: 30,
      deductibleRemaining: 1200,
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
  });
  console.log(`Created insurance record: ${ins2.id}`);

  const ins3 = await prisma.insuranceRecord.create({
    data: {
      patientId: carol.id,
      insuranceProvider: 'UnitedHealth',
      memberId: 'INS-1003',
      groupNumber: 'GRP-502',
      eligibilityStatus: 'active',
      coverageStart: new Date('2025-01-01'),
      coverageEnd: new Date('2025-12-31'),
      copayAmount: 20,
      deductibleRemaining: 350,
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    },
  });
  console.log(`Created insurance record: ${ins3.id}`);

  // Create check-in records
  const ci1 = await prisma.checkIn.create({
    data: {
      appointmentId: apt3.id,
      patientId: carol.id,
      checkedInAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 - 10 * 60 * 1000),
      status: 'completed',
      notes: 'Arrived 10 min early, vitals taken.',
    },
  });
  console.log(`Created check-in: ${ci1.id}`);

  console.log('\nSeed completed successfully!');
  console.log(`Providers: 2`);
  console.log(`Patients: 3`);
  console.log(`Appointments: 4`);
  console.log(`Billing records: 3`);
  console.log(`Insurance records: 3`);
  console.log(`Check-ins: 1`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });