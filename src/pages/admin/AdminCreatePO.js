import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import procurementService from '../../services/procurementService';
import { Loader2, Upload, FileText } from 'lucide-react';

const emptyItem = { lineNumber: 1, description: '', sku: '', quantity: 1, unitPrice: 0, lineTotal: 0 };

const AdminCreatePO = () => {
  const [mode, setMode] = useState('UPLOAD_AI');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [poId, setPoId] = useState(null);
  const [form, setForm] = useState({
    supplierName: '',
    poNumber: '',
    poDate: '',
    deliveryDate: '',
    currency: 'PHP',
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: '',
    items: [{ ...emptyItem }],
  });
  const [attachments, setAttachments] = useState([]);
  const [extraction, setExtraction] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!poId) return;
    refreshPo(poId);
  }, [poId]);

  const refreshPo = async (id) => {
    try {
      const po = await procurementService.getById(id);
      setPoId(po.id);
      setForm({
        supplierName: po.supplierName || '',
        poNumber: po.poNumber || '',
        poDate: po.poDate || '',
        deliveryDate: po.deliveryDate || '',
        currency: po.currency || 'PHP',
        subtotal: po.subtotal || 0,
        tax: po.tax || 0,
        total: po.total || 0,
        notes: po.notes || '',
        items: po.items?.length ? po.items : [{ ...emptyItem }],
      });
      setAttachments(po.attachments || []);
      setExtraction(po.latestExtraction || null);
    } catch (err) {
      console.error('Failed to load PO:', err);
    }
  };

  const handleField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleItemField = (idx, name, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === idx ? { ...item, [name]: value } : item)),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...emptyItem, lineNumber: prev.items.length + 1 }] }));
  };

  const removeItem = (idx) => {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  };

  const saveDraft = async () => {
    setSubmitting(true);
    try {
      if (poId) {
        await procurementService.updateDraft(poId, form);
      } else {
        const created = await procurementService.createDraft(form);
        setPoId(created.id);
      }
      if (poId) {
        await refreshPo(poId);
      }
      alert('Draft saved');
    } catch (err) {
      console.error('Failed to save PO draft:', err);
      alert(err.response?.data?.message || 'Failed to save PO draft');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmPo = async () => {
    if (!poId) {
      alert('Save draft first before confirming');
      return;
    }
    setSubmitting(true);
    try {
      await procurementService.confirm(poId, form.notes || 'Confirmed by staff after verification');
      await refreshPo(poId);
      alert('PO confirmed');
    } catch (err) {
      console.error('Failed to confirm PO:', err);
      alert(err.response?.data?.message || 'Failed to confirm PO');
    } finally {
      setSubmitting(false);
    }
  };

  const uploadAndExtract = async () => {
    if (!file) {
      alert('Select a PDF/image file first');
      return;
    }
    setLoading(true);
    try {
      const po = await procurementService.uploadAndExtract(file, poId);
      setPoId(po.id);
      setFile(null);
      await refreshPo(po.id);
    } catch (err) {
      console.error('Failed to upload and extract PO:', err);
      alert(err.response?.data?.message || 'Failed to upload and extract PO');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <h1 className="font-serif text-3xl font-bold text-espresso">Create Procurement PO</h1>
        <p className="mt-1 text-muted-foreground">Manual entry or upload a PDF/image and auto-populate via AI extraction</p>

        <div className="mt-5 flex gap-2">
          <button onClick={() => setMode('UPLOAD_AI')} className={`rounded-full px-4 py-1.5 text-sm ${mode === 'UPLOAD_AI' ? 'bg-primary text-white' : 'bg-cream text-muted-foreground'}`}>Upload & Extract</button>
          <button onClick={() => setMode('MANUAL')} className={`rounded-full px-4 py-1.5 text-sm ${mode === 'MANUAL' ? 'bg-primary text-white' : 'bg-cream text-muted-foreground'}`}>Manual Form</button>
        </div>

        {mode === 'UPLOAD_AI' && (
          <div className="mt-4 rounded-xl border border-sand bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <input type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <Button onClick={uploadAndExtract} disabled={loading} className="bg-primary text-white hover:bg-primary-hover">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="mr-2 h-4 w-4" /> Upload & Extract</>}
              </Button>
            </div>
            {extraction && (
              <p className="mt-3 text-sm text-muted-foreground">Extraction confidence: {Number(extraction.confidence || 0).toFixed(2)} · {extraction.warnings || 'No warnings'}</p>
            )}
            {!!attachments.length && (
              <div className="mt-3 space-y-1 text-sm">
                {attachments.map((a) => (
                  <a key={a.id} href={procurementService.getAttachmentUrl(a.id)} target="_blank" rel="noreferrer" className="block text-primary hover:underline">
                    <FileText className="mr-1 inline h-4 w-4" /> {a.fileName}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-sand bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input value={form.supplierName} onChange={(e) => handleField('supplierName', e.target.value)} className="rounded-lg border border-sand px-3 py-2 text-sm" placeholder="Supplier Name" />
            <input value={form.poNumber} onChange={(e) => handleField('poNumber', e.target.value)} className="rounded-lg border border-sand px-3 py-2 text-sm" placeholder="PO Number" />
            <input type="date" value={form.poDate} onChange={(e) => handleField('poDate', e.target.value)} className="rounded-lg border border-sand px-3 py-2 text-sm" />
            <input type="date" value={form.deliveryDate} onChange={(e) => handleField('deliveryDate', e.target.value)} className="rounded-lg border border-sand px-3 py-2 text-sm" />
            <input value={form.currency} onChange={(e) => handleField('currency', e.target.value)} className="rounded-lg border border-sand px-3 py-2 text-sm" placeholder="Currency" />
            <input value={form.subtotal} type="number" onChange={(e) => handleField('subtotal', Number(e.target.value))} className="rounded-lg border border-sand px-3 py-2 text-sm" placeholder="Subtotal" />
            <input value={form.tax} type="number" onChange={(e) => handleField('tax', Number(e.target.value))} className="rounded-lg border border-sand px-3 py-2 text-sm" placeholder="Tax" />
            <input value={form.total} type="number" onChange={(e) => handleField('total', Number(e.target.value))} className="rounded-lg border border-sand px-3 py-2 text-sm" placeholder="Total" />
          </div>

          <textarea value={form.notes} onChange={(e) => handleField('notes', e.target.value)} rows={3} className="mt-3 w-full rounded-lg border border-sand px-3 py-2 text-sm" placeholder="Notes / verification remarks" />

          <div className="mt-4 space-y-2">
            {form.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <input value={item.description} onChange={(e) => handleItemField(idx, 'description', e.target.value)} className="col-span-4 rounded-lg border border-sand px-2 py-1.5 text-sm" placeholder="Description" />
                <input value={item.sku || ''} onChange={(e) => handleItemField(idx, 'sku', e.target.value)} className="col-span-2 rounded-lg border border-sand px-2 py-1.5 text-sm" placeholder="SKU" />
                <input type="number" min="1" value={item.quantity} onChange={(e) => handleItemField(idx, 'quantity', Number(e.target.value))} className="col-span-2 rounded-lg border border-sand px-2 py-1.5 text-sm" placeholder="Qty" />
                <input type="number" value={item.unitPrice || 0} onChange={(e) => handleItemField(idx, 'unitPrice', Number(e.target.value))} className="col-span-2 rounded-lg border border-sand px-2 py-1.5 text-sm" placeholder="Unit Price" />
                <input type="number" value={item.lineTotal || 0} onChange={(e) => handleItemField(idx, 'lineTotal', Number(e.target.value))} className="col-span-1 rounded-lg border border-sand px-2 py-1.5 text-sm" placeholder="Line Total" />
                <Button type="button" variant="outline" className="col-span-1" onClick={() => removeItem(idx)}>X</Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem}>Add Item</Button>
          </div>

          <div className="mt-5 flex gap-2">
            <Button onClick={saveDraft} disabled={submitting} className="bg-primary text-white hover:bg-primary-hover">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Draft'}
            </Button>
            <Button onClick={confirmPo} disabled={submitting || !poId} variant="outline">Confirm PO</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatePO;
