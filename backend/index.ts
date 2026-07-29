import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { prisma } from '../src/lib/db';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN?.split(',') || true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/healthz', async (_req, res) => {
  try { await prisma.$queryRaw`SELECT 1`; res.json({ status: 'ok' }); }
  catch { res.status(503).json({ status: 'unavailable' }); }
});
app.get('/api/tablets', async (_req, res) => res.json(await prisma.tablet.findMany({ orderBy: { createdAt: 'desc' } })));
app.get('/api/participants', async (_req, res) => res.json(await prisma.participant.findMany({ orderBy: { createdAt: 'desc' } })));
app.get('/api/issuances', async (_req, res) => res.json(await prisma.issuance.findMany({ include: { participant: true, tablet: true, checkoutBy: true }, orderBy: { checkoutDate: 'desc' } })));

app.post('/api/issuances', async (req, res) => {
  const { participantId, tabletId, expectedReturnDate, checkoutLocation, notes } = req.body;
  if (!participantId || !tabletId || !expectedReturnDate || !checkoutLocation) return res.status(400).json({ error: 'Required checkout fields are missing' });
  try {
    const result = await prisma.$transaction(async (tx) => {
      const tablet = await tx.tablet.findUnique({ where: { id: tabletId } });
      const participant = await tx.participant.findUnique({ where: { id: participantId } });
      if (!tablet || !participant) throw new Error('Not found');
      if (tablet.status !== 'AVAILABLE') throw new Error('Tablet is not available');
      if (await tx.issuance.findFirst({ where: { participantId, status: 'ACTIVE' } })) throw new Error('Participant already has an active tablet');
      const issuance = await tx.issuance.create({ data: { participantId, tabletId, expectedReturnDate: new Date(expectedReturnDate), checkoutLocation, notes }, include: { participant: true, tablet: true } });
      await tx.tablet.update({ where: { id: tabletId }, data: { status: 'ISSUED', location: checkoutLocation } });
      await tx.participant.update({ where: { id: participantId }, data: { tabletsIssued: { increment: 1 }, status: 'ACTIVE', tabletSerial: tablet.deviceId, tabletModel: tablet.model, tabletStatus: 'active', issueDate: new Date(), expectedReturnDate: new Date(expectedReturnDate) } });
      return issuance;
    });
    res.status(201).json(result);
  } catch (error) { res.status(409).json({ error: error instanceof Error ? error.message : 'Checkout failed' }); }
});

app.post('/api/tablets/import', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Excel file is required' });
  try {
    const book = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(book.Sheets[book.SheetNames[0]] || {}, { defval: '' });
    const errors: { row: number; message: string }[] = []; let updatedCount = 0;
    for (const [index, row] of rows.entries()) {
      const deviceId = String(row.deviceId ?? row['Device ID'] ?? '').trim();
      if (!deviceId) { errors.push({ row: index + 2, message: 'deviceId is required' }); continue; }
      const tablet = await prisma.tablet.findUnique({ where: { deviceId } });
      if (!tablet) { errors.push({ row: index + 2, message: `Tablet ${deviceId} was not found` }); continue; }
      const data: Record<string, unknown> = {};
      for (const field of ['model','status','battery','storage','ram','os','location','condition','department','notes','warranty']) if (row[field] !== undefined) data[field] = ['status','condition'].includes(field) ? String(row[field]).toUpperCase() : row[field];
      await prisma.tablet.update({ where: { id: tablet.id }, data }); updatedCount++;
    }
    res.json({ success: errors.length === 0, totalRows: rows.length, updatedCount, errors });
  } catch { res.status(400).json({ error: 'Invalid workbook or import failed' }); }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Issuance API listening on ${port}`));
