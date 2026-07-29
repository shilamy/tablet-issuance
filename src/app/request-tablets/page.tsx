"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function RequestTabletsPage() {
  const [activities, setActivities] = useState<{ id: string; name: string }[]>([]);
  const [counties, setCounties] = useState<{ id: string; name: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ requester: "", email: "", phone: "", activityId: "", quantity: "1", countyIds: [] as string[], type: "", notes: "" });
  useEffect(() => { Promise.all([fetch('/api/activities').then(r => r.json()), fetch('/api/counties').then(r => r.json())]).then(([a, c]) => { setActivities(a); setCounties(c); }).catch(() => undefined); }, []);
  const update = (name: string, value: string) => setForm(current => ({ ...current, [name]: value }));
  const submit = async (event: React.FormEvent) => { event.preventDefault(); const response = await fetch('/api/request-tablets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, quantity: Number(form.quantity), counties: form.countyIds }) }); if (!response.ok) { alert('Could not submit request'); return; } setSubmitted(true); };
  if (submitted) return <Layout><div className="max-w-xl mx-auto p-8 text-center"><h1 className="text-2xl font-bold">Request submitted</h1><p className="my-4 text-gray-600">Your tablet request has been recorded for review.</p><Link className="text-blue-600" href="/">Back home</Link></div></Layout>;
  return <Layout><div className="max-w-2xl mx-auto p-6"><h1 className="text-2xl font-bold mb-6">Request tablets</h1><form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-xl border">
    <input required className="w-full border p-2 rounded" placeholder="Requester name" value={form.requester} onChange={e => update('requester', e.target.value)} />
    <input type="email" className="w-full border p-2 rounded" placeholder="Email" value={form.email} onChange={e => update('email', e.target.value)} />
    <input className="w-full border p-2 rounded" placeholder="Phone" value={form.phone} onChange={e => update('phone', e.target.value)} />
    <select required className="w-full border p-2 rounded" value={form.activityId} onChange={e => update('activityId', e.target.value)}><option value="">Select activity</option>{activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
    <select multiple className="w-full border p-2 rounded h-28" value={form.countyIds} onChange={e => setForm({ ...form, countyIds: Array.from(e.target.selectedOptions, option => option.value) })}>{counties.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
    <input required min="1" type="number" className="w-full border p-2 rounded" value={form.quantity} onChange={e => update('quantity', e.target.value)} />
    <textarea className="w-full border p-2 rounded" placeholder="Notes" value={form.notes} onChange={e => update('notes', e.target.value)} />
    <button className="bg-blue-600 text-white px-5 py-2 rounded" type="submit">Submit request</button>
  </form></div></Layout>;
}
