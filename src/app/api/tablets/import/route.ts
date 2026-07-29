import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as XLSX from 'xlsx';

export const runtime = 'nodejs';

const fields = ['model', 'status', 'battery', 'storage', 'ram', 'os', 'location', 'lastSeen', 'lastChecked', 'condition', 'department', 'notes', 'warranty'] as const;
const key = (value: unknown) => String(value ?? '').trim();

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Excel file is required' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File exceeds the 10 MB limit' }, { status: 413 });
    const workbook = XLSX.read(Buffer.from(await file.arrayBuffer()), { type: 'buffer', cellDates: true });
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[workbook.SheetNames[0]] || {}, { defval: '' });
    if (!rows.length) return NextResponse.json({ error: 'The workbook has no data rows' }, { status: 400 });

    const updated: string[] = [], errors: { row: number; message: string }[] = [];
    for (const [index, row] of rows.entries()) {
      const deviceId = key(row.deviceId ?? row['Device ID'] ?? row.device_id ?? row.ID);
      const serialNumber = key(row.serialNumber ?? row['Serial Number']);
      const imei = key(row.imei ?? row.IMEI);
      if (!deviceId && !serialNumber && !imei) { errors.push({ row: index + 2, message: 'Provide deviceId, serialNumber or IMEI' }); continue; }
      const where = deviceId ? { deviceId } : serialNumber ? { serialNumber } : { imei };
      const tablet = await prisma.tablet.findFirst({ where });
      if (!tablet) { errors.push({ row: index + 2, message: `Tablet ${deviceId || serialNumber || imei} was not found` }); continue; }
      const data: Record<string, unknown> = {};
      for (const field of fields) if (row[field] !== undefined || row[field[0].toUpperCase() + field.slice(1)] !== undefined) {
        const value = row[field] ?? row[field[0].toUpperCase() + field.slice(1)];
        if (['battery'].includes(field)) data[field] = Math.max(0, Math.min(100, Number(value)));
        else if (['status', 'condition'].includes(field)) data[field] = key(value).toUpperCase();
        else if (['lastSeen', 'lastChecked'].includes(field) && value) data[field] = new Date(value as string | number | Date);
        else data[field] = value === '' ? null : value;
      }
      if (!Object.keys(data).length) { errors.push({ row: index + 2, message: 'No update fields supplied' }); continue; }
      await prisma.tablet.update({ where: { id: tablet.id }, data });
      updated.push(tablet.deviceId);
    }
    return NextResponse.json({ success: errors.length === 0, totalRows: rows.length, updatedCount: updated.length, updated, errors });
  } catch (error) {
    console.error('Tablet import failed', error);
    return NextResponse.json({ error: 'Invalid workbook or import failed' }, { status: 400 });
  }
}
