import { Request, Response, NextFunction } from 'express';

/**
 * User Roles
 *
 * Role-based access control for healthcare operations.
 * Enforces the principle of least privilege per HIPAA requirements.
 */
export type UserRole = 'admin' | 'provider' | 'nurse' | 'billing' | 'patient' | 'system';

/**
 * Permission types
 */
export type Permission =
  | 'patient:read'
  | 'patient:write'
  | 'patient:delete'
  | 'appointment:read'
  | 'appointment:write'
  | 'appointment:delete'
  | 'provider:read'
  | 'provider:write'
  | 'audit:read'
  | 'billing:read'
  | 'billing:write'
  | 'admin:access';

/**
 * Authenticated user context attached to request
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  providerId?: string; // If the user is a provider
  patientId?: string;  // If the user is a patient
}

/**
 * Extend Express Request type
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Role-Permission Mapping
 *
 * Defines which permissions each role has.
 * Follows HIPAA minimum necessary access principle.
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'patient:read',
    'patient:write',
    'patient:delete',
    'appointment:read',
    'appointment:write',
    'appointment:delete',
    'provider:read',
    'provider:write',
    'audit:read',
    'billing:read',
    'billing:write',
    'admin:access',
  ],
  provider: [
    'patient:read',
    'patient:write',
    'appointment:read',
    'appointment:write',
    'appointment:delete',
    'audit:read',
  ],
  nurse: [
    'patient:read',
    'appointment:read',
    'appointment:write',
  ],
  billing: [
    'patient:read',
    'appointment:read',
    'billing:read',
    'billing:write',
  ],
  patient: [
    'appointment:read',
  ],
  system: [
    'patient:read',
    'patient:write',
    'appointment:read',
    'appointment:write',
    'audit:read',
  ],
};

/**
 * Authenticate a user by verifying JWT token
 *
 * In production, this should:
 * 1. Verify JWT signature using HS256/RS256
 * 2. Check token expiration
 * 3. Validate claims (sub, role, permissions, etc.)
 * 4. Verify against revocation list (if implemented)
 *
 * @param token - Bearer token from Authorization header
 * @returns Authenticated user context or null
 */
async function authenticateUser(token: string): Promise<AuthenticatedUser | null> {
  // Implementation depends on auth provider
  // This is a placeholder for JWT verification logic

  // Example with jsonwebtoken:
  // import jwt from 'jsonwebtoken';
  // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  // return {
  //   id: decoded.sub,
  //   email: decoded.email,
  //   role: decoded.role,
  //   permissions: ROLE_PERMISSIONS[decoded.role],
  // };

  return null;
}

/**
 * Authorization helper
 *
 * Checks if user has required permission for the requested resource.
 * Enforces HIPAA minimum necessary access principle.
 */
function hasPermission(
  user: AuthenticatedUser,
  requiredPermission: Permission
): boolean {
  return user.permissions.includes(requiredPermission);
}

function hasRole(user: AuthenticatedUser, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * Middleware: Authentication & Authorization
 *
 * Extracts and verifies JWT from Authorization header.
 * Attaches authenticated user context to request.
 * Enforces RBAC and HIPAA compliance.
 *
 * Usage:
 *   app.use('/api', authMiddleware);
 *   app.get('/api/patients', authMiddleware, requirePermission('patient:read'), getPatients);
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header',
      });
      return;
    }

    const token = authHeader.substring(7);

    // Verify token (synchronous placeholder - use async in production)
    // For async implementation, wrap in a Promise chain
    authenticateUser(token).then((user) => {
      if (!user) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid or expired token',
        });
        return;
      }

      // Attach user to request
      req.user = user;

      // Log authentication event
      console.info({
        timestamp: new Date().toISOString(),
        event: 'auth_success',
        userId: user.id,
        userRole: user.role,
        path: req.path,
        method: req.method,
        ip: req.ip,
      });

      next();
    }).catch((error) => {
      console.error('Authentication error:', error);
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication failed',
      });
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * Authorization Middleware Factory
 *
 * Creates middleware that requires specific permissions.
 *
 * Usage:
 *   app.get('/api/patients', authMiddleware, requirePermission('patient:read'), getPatients);
 *   app.post('/api/patients', authMiddleware, requirePermission('patient:write'), createPatient);
 */
export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    if (!hasPermission(req.user, permission)) {
      console.warn({
        timestamp: new Date().toISOString(),
        event: 'authz_denied',
        userId: req.user.id,
        userRole: req.user.role,
        requiredPermission: permission,
        path: req.path,
        method: req.method,
        ip: req.ip,
      });

      res.status(403).json({
        error: 'Forbidden',
        message: `Missing required permission: ${permission}`,
      });
      return;
    }

    next();
  };
}

/**
 * Authorization Middleware Factory - Role-based
 *
 * Creates middleware that requires specific roles.
 *
 * Usage:
 *   app.delete('/api/patients/:id', authMiddleware, requireRole(['admin', 'provider']), deletePatient);
 */
export function requireRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    if (!hasRole(req.user, roles)) {
      console.warn({
        timestamp: new Date().toISOString(),
        event: 'authz_denied',
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        path: req.path,
        method: req.method,
        ip: req.ip,
      });

      res.status(403).json({
        error: 'Forbidden',
        message: `Insufficient permissions. Required roles: ${roles.join(', ')}`,
      });
      return;
    }

    next();
  };
}

/**
 * Optional Authentication Middleware
 *
 * Attempts to authenticate if token is present, but doesn't fail if missing.
 * Useful for endpoints that return different data based on auth state.
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.substring(7);

  authenticateUser(token).then((user) => {
    if (user) {
      req.user = user;
    }
    next();
  }).catch(() => {
    next();
  });
}
