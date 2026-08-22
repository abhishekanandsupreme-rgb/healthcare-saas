import { careerOpsStats } from '@/lib/store';
import { jsonResponse } from '@/lib/store';

export async function GET(_request: Request) {
  // Add a touch of freshness to the response
  const stats = {
    ...careerOpsStats,
    generatedAt: new Date().toISOString(),
  };
  return jsonResponse(stats);
}

export async function POST(_request: Request) {
  const body = await _request.json().catch(() => null);
  // Accept a lightweight "heartbeat" or metadata post but keep the same payload shape
  const stats = {
    ...careerOpsStats,
    generatedAt: new Date().toISOString(),
    lastSync: body?.lastSync || null,
  };
  return jsonResponse(stats, 202);
}
