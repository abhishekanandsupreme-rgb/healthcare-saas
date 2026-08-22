# Healthcare SaaS Backend

A HIPAA-compliant TypeScript backend scaffold for a Healthcare SaaS platform. Built with Express.js, Prisma ORM, and PostgreSQL.

## Features

- **Patient Management**: Medical records with PHI protection
- **Provider Management**: Healthcare provider profiles with NPI tracking
- **Appointment Scheduling**: Full appointment lifecycle management
- **Audit Logging**: HIPAA-compliant audit trail for all PHI access
- **RBAC**: Role-based access control (Admin, Provider, Nurse, Billing, Patient)
- **Type Safety**: Full TypeScript strict mode
- **No Real DB Connections**: Scaffold with placeholder configurations

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (configured, not connected)
- **Language**: TypeScript (strict mode)
- **Authentication**: JWT-based

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema with Patient, Provider, Appointment, AuditLog
│   ├── migrations/
│   │   └── 001_init.sql       # Initial SQL migration
│   └── seed.ts                # (Optional) Seed data
├── src/
│   ├── lib/
│   │   └── prisma.ts          # Prisma client singleton
│   ├── middleware/
│   │   ├── auth.ts            # HIPAA-compliant auth middleware with RBAC
│   │   └── audit.ts           # Audit logging middleware for PHI access
│   ├── routes/                # (Future) API routes
│   ├── controllers/           # (Future) Request handlers
│   ├── services/              # (Future) Business logic
│   └── types/                 # (Future) TypeScript type definitions
├── .env.example               # Environment variable template
├── .env                       # Environment variables (copy from .env.example)
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Database Schema

### Models

1. **Patient**
   - Medical Record Number (MRN) - unique identifier
   - Personal information (name, DOB, gender, contact)
   - Address information
   - Relations: appointments, auditLogs

2. **Provider**
   - Healthcare provider details
   - National Provider Identifier (NPI) - unique
   - Specialty and license information
   - Relations: appointments, auditLogs

3. **Appointment**
   - Links Patient and Provider
   - Scheduling details (start/end time)
   - Type and status tracking
   - Reason and notes fields

4. **AuditLog**
   - Tracks all PHI access
   - Actor information (who accessed)
   - Resource information (what was accessed)
   - IP address and user agent
   - Timestamp for compliance

### Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| Admin | Full system access | All permissions |
| Provider | Medical staff | Read/write patients and appointments |
| Nurse | Nursing staff | Read patients, manage appointments |
| Billing | Financial staff | Read patients, billing operations |
| Patient | Patient access | View own appointments |
| System | Automated processes | Limited read/write access |

## Setup Instructions

### Prerequisites

- Node.js v18+
- PostgreSQL v14+
- npm or yarn

### Installation

1. **Clone or navigate to the backend directory**

```bash
cd C:/Users/asus/healthcare-saas/backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your database credentials and secrets
```

4. **Configure PostgreSQL**

Create a database:
```sql
CREATE DATABASE healthcare_saas;
CREATE USER healthcare_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE healthcare_saas TO healthcare_user;
```

5. **Run database migrations**

```bash
npx prisma migrate dev --name init
```

Or use the SQL migration directly:
```bash
psql -U healthcare_user -d healthcare_saas -f prisma/migrations/001_init.sql
```

6. **Generate Prisma Client**

```bash
npx prisma generate
```

7. **(Optional) Seed database**

```bash
npx prisma db seed
```

### TypeScript Configuration

This project uses strict TypeScript. Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Running the Application

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Scripts (Add to package.json)

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "test": "jest"
  }
}
```

## HIPAA Compliance Notes

### Required Controls

1. **Access Control**
   - Unique user identification
   - Role-based access control (RBAC)
   - Automatic logoff after inactivity
   - Encryption and decryption

2. **Audit Controls**
   - Implement hardware/software mechanisms to record and examine activity
   - Audit logs stored for minimum 6 years
   - Protected from alteration

3. **Integrity Controls**
   - PHI is not improperly altered or destroyed
   - Implement mechanisms to ensure integrity

4. **Transmission Security**
   - End-to-end encryption for data in transit
   - TLS 1.2+ required

### Audit Logging

All PHI access is automatically logged:
- Who accessed the data
- What was accessed
- When it was accessed
- From where (IP address)
- User agent details

### Data Protection

- PHI fields should be encrypted at rest
- Database connections must use TLS
- Passwords hashed with bcrypt (12+ rounds)
- JWT tokens with secure expiration

## Security Considerations

- Never commit `.env` file to version control
- Rotate secrets regularly
- Use strong JWT secrets (minimum 32 characters)
- Enable PostgreSQL SSL connections
- Implement rate limiting
- Use HTTPS in production
- Regular security audits

## API Endpoints (Planned)

### Patients
- `GET /api/patients` - List patients (requires `patient:read`)
- `GET /api/patients/:id` - Get patient details (requires `patient:read`)
- `POST /api/patients` - Create patient (requires `patient:write`)
- `PUT /api/patients/:id` - Update patient (requires `patient:write`)
- `DELETE /api/patients/:id` - Delete patient (requires `patient:delete`)

### Appointments
- `GET /api/appointments` - List appointments (requires `appointment:read`)
- `POST /api/appointments` - Create appointment (requires `appointment:write`)
- `PUT /api/appointments/:id` - Update appointment (requires `appointment:write`)
- `DELETE /api/appointments/:id` - Cancel appointment (requires `appointment:delete`)

### Providers
- `GET /api/providers` - List providers (requires `provider:read`)

### Audit
- `GET /api/audit/logs` - Query audit logs (requires `audit:read`)

## License

Proprietary - Healthcare SaaS Platform

## Support

For issues and questions, contact the development team.
