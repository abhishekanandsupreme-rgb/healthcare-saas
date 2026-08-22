import { Request, Response, NextFunction } from 'express';

/**
 * Audit Log Entry
 *
 * Structured log entry for HIPAA-compliant audit trail.
 * Captures all PHI access and system events.
 */
export interface AuditLogEntry {
  actorId: string;
  actorType: string;
  actorName: string;
  patientId?: string;
  resourceType: string;
  resourceId?: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export' | 'access';
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

/**
 * Audit Action Types
 *
 * Standardized action types for consistent audit logging.
 */
export type AuditAction =
  | 'patient.view'
  | 'patient.create'
  | 'patient.update'
  | 'patient.delete'
  | 'appointment.view'
  | 'appointment.create'
  | 'appointment.update'
  | 'appointment.cancel'
  | 'provider.view'
  | 'auth.login'
  | 'auth.logout'
  | 'auth.failed'
  | 'system.access'
  | 'data.export'
  | 'phi.access';

/**
 * Middleware: Audit Logging
 *
 * Logs all PHI access for HIPAA compliance.
 * Must be used after authentication middleware.
 *
 * HIPAA Requirements:
 * - Record all access to PHI
 * - Include who accessed, what was accessed, when, and from where
 * - Retain logs for minimum 6 years
 * - Protect log integrity
 *
 * Usage:
 *   app.use('/api', authMiddleware, auditMiddleware);
 */
export function auditMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  // Capture request details
  const requestDetails = {
    method: req.method,
    path: req.path,
    query: req.query,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString(),
  };

  // Override res.json to capture response
  const originalJson = res.json.bind(res);

  res.json = function (body: unknown) {
    const responseDetails = {
      statusCode: res.statusCode,
      durationMs: Date.now() - startTime,
    };

    // Log audit event after response is sent
    // In production, queue this to avoid blocking the response
    logAuditEvent({
      request: requestDetails,
      response: responseDetails,
      body: sanitizeForAudit(body),
    }).catch((error) => {
      console.error('Audit logging failed:', error);
    });

    return originalJson(body);
  };

  next();
}

/**
 * Specific Audit Logger
 *
 * Use this in route handlers for detailed PHI access logging.
 *
 * Usage:
 *   const user = req.user!;
 *   await logPHIAccess(user, 'patient.view', patientId, { mrn: patient.mrn });
 */
export async function logPHIAccess(
  user: {
    id: string;
    email: string;
    role: string;
  },
  action: AuditAction,
  patientId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  const auditEntry: AuditLogEntry = {
    actorId: user.id,
    actorType: user.role,
    actorName: user.email,
    patientId,
    resourceType: getResourceType(action),
    resourceId: patientId,
    action: mapAction(action),
    ipAddress: details?.ipAddress as string | undefined,
    userAgent: details?.userAgent as string | undefined,
    details: details?.context as Record<string, unknown> | undefined,
  };

  await persistAuditLog(auditEntry);
}

/**
 * Create a custom audit event
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  await persistAuditLog(entry);
}

/**
 * Map audit action to resource type
 */
function getResourceType(action: AuditAction): string {
  if (action.startsWith('patient.')) return 'patient';
  if (action.startsWith('appointment.')) return 'appointment';
  if (action.startsWith('provider.')) return 'provider';
  if (action.startsWith('auth.')) return 'auth';
  if (action.startsWith('data.')) return 'data';
  return 'system';
}

/**
 * Map audit action to standard action type
 */
function mapAction(action: AuditAction): AuditLogEntry['action'] {
  if (action.endsWith('.view') || action.endsWith('.access')) return 'read';
  if (action.endsWith('.create')) return 'create';
  if (action.endsWith('.update')) return 'update';
  if (action.endsWith('.delete') || action.endsWith('.cancel')) return 'delete';
  if (action.endsWith('.login')) return 'login';
  if (action.endsWith('.logout')) return 'logout';
  return 'access';
}

/**
 * Persist audit log to database
 *
 * In production, implement this with:
 * 1. Direct database insert (fastest, most reliable)
 * 2. Message queue for high-volume scenarios
 * 3. Append-only log storage for immutability
 */
async function persistAuditLog(entry: AuditLogEntry): Promise<void> {
  // Placeholder implementation
  // In production:
  // const prisma = getPrismaClient();
  // await prisma.auditLog.create({
  //   data: {
  //     actorId: entry.actorId,
  //     actorType: entry.actorType,
  //     actorName: entry.actorName,
  //     patientId: entry.patientId,
  //     resourceType: entry.resourceType,
  //     resourceId: entry.resourceId,
  //     action: entry.action,
  //     ipAddress: entry.ipAddress,
  //     userAgent: entry.userAgent,
  //     details: entry.details ? JSON.stringify(entry.details) : null,
  //   },
  // });

  console.info({
    timestamp: new Date().toISOString(),
    event: 'audit_log',
    ...entry,
  });
}

/**
 * Log audit event (middleware helper)
 */
async function logAuditEvent(data: {
  request: Record<string, unknown>;
  response: Record<string, unknown>;
  body: Record<string, unknown> | null;
}): Promise<void> {
  const userId = data.request.ipAddress as string | undefined;

  const auditEntry: AuditLogEntry = {
    actorId: 'system',
    actorType: 'system',
    actorName: 'system',
    resourceType: 'system',
    action: 'access',
    ipAddress: data.request.ipAddress as string | undefined,
    userAgent: data.request.userAgent as string | undefined,
    details: {
      request: data.request,
      response: data.response,
      body: data.body,
    },
  };

  await persistAuditLog(auditEntry);
}

/**
 * Sanitize response body for audit logging
 *
 * Remove sensitive data that shouldn't be stored in logs.
 * Follows HIPAA minimum necessary principle.
 */
function sanitizeForAudit(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  // Define fields that should never be logged
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'ssn',
    'socialSecurityNumber',
    'creditCard',
    'bankAccount',
  ];

  const sanitize = (obj: Record<string, unknown>): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = sanitize(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }

    return result;
  };

  return sanitize(body as Record<string, unknown>);
}

/**
 * Query Audit Logs
 *
 * Retrieves audit logs with filtering capabilities.
 * Requires 'audit:read' permission.
 */
export async function queryAuditLogs(filters: {
  actorId?: string;
  patientId?: string;
  resourceType?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  // const prisma = getPrismaClient();
  // return prisma.auditLog.findMany({
  //   where: {
  //     ...(filters.actorId && { actorId: filters.actorId }),
  //     ...(filters.patientId && { patientId: filters.patientId }),
  //     ...(filters.resourceType && { resourceType: filters.resourceType }),
  //     ...(filters.action && { action: filters.action }),
  //     ...(filters.startDate && { timestamp: { gte: filters.startDate } }),
  //     ...(filters.endDate && { timestamp: { lte: filters.endDate } }),
  //   },
  //   orderBy: { timestamp: 'desc' },
  //   take: filters.limit || 100,
  //   skip: filters.offset || 0,
  // });

  return [];
}
