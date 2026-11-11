// =============================================================================
// MÓDULO DE AUTENTICACIÓN JWT & SEGURIDAD OWASP TOP 10 (2025) — URBAN_DROP
// =============================================================================

import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './supabase';

export interface DecodedJwtHeader {
  alg: string;
  typ?: string;
  kid?: string;
}

export interface DecodedJwtPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  email?: string;
  role?: string;
  session_id?: string;
  app_metadata?: {
    provider?: string;
    providers?: string[];
    role?: string;
    permissions?: string[];
  };
  user_metadata?: Record<string, unknown>;
}

export interface JwtVerificationReport {
  valid: boolean;
  header: DecodedJwtHeader | null;
  payload: DecodedJwtPayload | null;
  signaturePreview: string;
  checks: {
    structureThreeParts: boolean;
    algorithmAllowed: boolean; // Rechaza 'none' (OWASP JWT Cheat Sheet)
    notExpired: boolean;
    issuerMatches: boolean;
    roleFromAppMetadata: string; // Nunca confiar en user_metadata (Supabase Security Rule)
    sessionIdPresent: boolean;
  };
  errors: string[];
}

const ALLOWED_JWT_ALGORITHMS = new Set(['HS256', 'RS256', 'ES256', 'EdDSA']);

/**
 * Decodifica Base64URL de forma segura conforme a RFC 7515 / RFC 7519.
 */
export function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return decodeURIComponent(
    Array.from(atob(padded))
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

/**
 * Inspecciona y valida un token JWT bajo las reglas de OWASP Top 10 (2025):
 * - Verifica estructura de 3 segmentos (`header.payload.signature`).
 * - Bloquea el ataque `alg: "none"` exigiendo algoritmos criptográficos fuertes.
 * - Valida expiración (`exp`) e issuer (`iss`).
 * - Extrae privilegios exclusivamente desde `app_metadata` (nunca `user_metadata`).
 */
export function inspectAndValidateJwt(token: string): JwtVerificationReport {
  const errors: string[] = [];
  const parts = (token || '').trim().split('.');

  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
    return {
      valid: false,
      header: null,
      payload: null,
      signaturePreview: '',
      checks: {
        structureThreeParts: false,
        algorithmAllowed: false,
        notExpired: false,
        issuerMatches: false,
        roleFromAppMetadata: 'none',
        sessionIdPresent: false,
      },
      errors: ['Estructura JWT inválida: debe contener exactamente Header, Payload y Signature.'],
    };
  }

  let header: DecodedJwtHeader | null = null;
  let payload: DecodedJwtPayload | null = null;

  try {
    header = JSON.parse(decodeBase64Url(parts[0])) as DecodedJwtHeader;
  } catch {
    errors.push('No fue posible decodificar el encabezado (Header) del JWT.');
  }

  try {
    payload = JSON.parse(decodeBase64Url(parts[1])) as DecodedJwtPayload;
  } catch {
    errors.push('No fue posible decodificar la carga útil (Payload) del JWT.');
  }

  const alg = header?.alg || '';
  const algorithmAllowed = ALLOWED_JWT_ALGORITHMS.has(alg) && alg.toLowerCase() !== 'none';
  if (!algorithmAllowed) {
    errors.push(`Algoritmo JWT no permitido o inseguro (${alg || 'desconocido'}).`);
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const notExpired = typeof payload?.exp === 'number' && payload.exp > nowSec;
  if (!notExpired) {
    errors.push('El token JWT ha expirado (claim `exp` vencido).');
  }

  const expectedIssuerPrefix = `${SUPABASE_URL}/auth/v1`;
  const issuerMatches = Boolean(
    payload?.iss && (payload.iss.startsWith(expectedIssuerPrefix) || payload.iss === 'urban-drop-local-auth')
  );
  if (!issuerMatches) {
    errors.push('El emisor del token (`iss`) no coincide con la autoridad de autenticación.');
  }

  const roleFromAppMetadata = payload?.app_metadata?.role || 'authenticated';
  const sessionIdPresent = Boolean(payload?.session_id || payload?.sub);

  return {
    valid: errors.length === 0,
    header,
    payload,
    signaturePreview: `${parts[2].slice(0, 14)}...${parts[2].slice(-10)}`,
    checks: {
      structureThreeParts: true,
      algorithmAllowed,
      notExpired,
      issuerMatches,
      roleFromAppMetadata,
      sessionIdPresent,
    },
    errors,
  };
}

/**
 * Enmascara un correo electrónico para los registros de auditoría (OWASP A09:2025 Privacy-by-Design).
 */
export function maskEmailForAudit(email: string): string {
  const clean = (email || '').trim().toLowerCase();
  const [user, domain] = clean.split('@');
  if (!user || !domain) return 'invalid-email';
  const visible = user.slice(0, 2);
  return `${visible}***@${domain}`;
}
