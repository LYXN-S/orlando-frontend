import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import procurementService from '../../services/procurementService';
import { Loader2, Upload, FileText } from 'lucide-react';

const emptyItem = { lineNumber: 1, description: '', sku: '', quantity: 1, unitPrice: 0, lineTotal: 0 };

const AdminCreatePO = ({ embedded = false, onClose, onSaved }) => {
  const [mode, setMode] = useState('UPLOAD_AI');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [poId, setPoId] = useState(null);
  const [form, setForm] = useState({
    customerName: '',
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
  const [extractionStatus, setExtractionStatus] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview?.revoke) preview.revoke();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!poId) return;
    refreshPo(poId);
  }, [poId]);

  const refreshPo = async (id) => {
    try {
      const po = await procurementService.getById(id);
      setPoId(po.id);
      setForm({
        customerName: po.customerName || po.supplierName || '',
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
      if (onSaved) onSaved();
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
      if (onSaved) onSaved();
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
    setExtractionStatus('Uploading document...');
    try {
      const started = await procurementService.uploadAndExtractAsync(file, poId);
      const requestId = started?.requestId;
      if (!requestId) {
        throw new Error('Missing requestId from async extraction endpoint');
      }

      const maxPolls = 90;
      for (let i = 0; i < maxPolls; i += 1) {
        setExtractionStatus(`Running AI extraction... (${i + 1}/${maxPolls})`);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        let status;
        try {
          status = await procurementService.getExtractionAsyncStatus(requestId);
        } catch (pollErr) {
          if (pollErr?.response?.status === 202) {
            continue;
          }
          throw pollErr;
        }

        if (!status) {
          continue;
        }

        if (status.status === 'PENDING') {
          continue;
        }

        if (status.status === 'FAILED') {
          throw new Error(status.message || 'Async extraction failed');
        }

        if (status.status === 'SUCCESS' && status.result) {
          const po = status.result;
          setPoId(po.id);
          setFile(null);
          setExtractionStatus('Extraction completed. Loading draft...');
          await refreshPo(po.id);
          if (onSaved) onSaved();
          setExtractionStatus('Extraction finished successfully.');
          return;
        }
      }

      throw new Error('Extraction is taking too long. Please check again in a moment.');
    } catch (err) {
      console.error('Failed to upload and extract PO:', err);
      setExtractionStatus('Extraction failed.');
      alert(err.response?.data?.message || err.message || 'Failed to upload and extract PO');
    } finally {
      setLoading(false);
    }
  };

  const handleAttachmentPreview = async (attachmentId) => {
    try {
      if (preview?.revoke) preview.revoke();
      const next = await procurementService.getAttachmentPreview(attachmentId);
      setPreview(next);
    } catch (err) {
      console.error('Failed to load attachment preview:', err);
      alert(err.response?.data?.message || 'Failed to load attachment preview');
    }
  };

  const formCard = (
    <div className="rounded-xl border border-sand bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <label className="space-y-1 text-sm text-foreground">
          <span className="block font-medium">Customer Name</span>
          <input value={form.customerName} onChange={(e) => handleField('customerName', e.target.value)} className="w-full rounded-lg border border-sand px-3 py-2 text-sm" placeholder="Customer Name" />
        </label>
        <label className="space-y-1 text-sm text-foreground">
          <span className="block font-medium">PO Number</span>
          <input value={form.poNumber} onChange={(e) => handleField('poNumber', e.target.value)} className="w-full rounded-lg border border-sand px-3 py-2 text-sm" placeholder="PO Number" />
        </label>
        <label className="space-y-1 text-sm text-foreground">
          <span className="block font-medium">PO Date</span>
          <input type="date" value={form.poDate} onChange={(e) => handleField('poDate', e.target.value)} className="w-full rounded-lg border border-sand px-3 py-2 text-sm" />
        </label>
        <label className="space-y-1 text-sm text-foreground">
          <span className="block font-medium">Delivery Date</span>
          <input type="date" value={form.deliveryDate} onChange={(e) => handleField('deliveryDate', e.target.value)} className="w-full rounded-lg border border-sand px-3 py-2 text-sm" />
        </label>
        <label className="space-y-1 text-sm text-foreground">
          <span className="block font-medium">Currency</span>
          <input value={form.currency} onChange={(e) => handleField('currency', e.target.value)} className="w-full rounded-lg border border-sand px-3 py-2 text-sm" placeholder="Currency" />
        </label>
        <label className="space-y-1 text-sm text-foreground">
          <span className="block font-medium">Subtotal</span>
          <input value={form.subtotal} type="number" onChange={(e) => handleField('subtotal', Number(e.target.value))} className="w-full rounded-lg border border-sand px-3 py-2 text-sm" placeholder="Subtotal" />
        </label>
        <label className="space-y-1 text-sm text-foreground">
          <span className="block font-medium">Tax</span>
          <input value={form.tax} type="number" onChange={(e) => handleField('tax', Number(e.target.value))} className="w-full rounded-lg border border-sand px-3 py-2 text-sm" placeholder="Tax" />
        </label>
        <label className="space-y-1 text-sm text-foreground">
          <span className="block font-medium">Total</span>
          <input value={form.total} type="number" onChange={(e) => handleField('total', Number(e.target.value))} className="w-full rounded-lg border border-sand px-3 py-2 text-sm" placeholder="Total" />
        </label>
      </div>

      <label className="mt-3 block space-y-1 text-sm text-foreground">
        <span className="block font-medium">Notes / Verification Remarks</span>
        <textarea value={form.notes} onChange={(e) => handleField('notes', e.target.value)} rows={3} className="w-full rounded-lg border border-sand px-3 py-2 text-sm" placeholder="Notes / verification remarks" />
      </label>

      <div className="mt-4 space-y-2">
        <div className="hidden grid-cols-12 gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
          <div className="col-span-4">Description</div>
          <div className="col-span-2">SKU</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-2">Unit Price</div>
          <div className="col-span-1">Line Total</div>
          <div className="col-span-1">Remove</div>
        </div>
        {form.items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2">
            <label className="col-span-12 space-y-1 text-xs text-foreground md:col-span-4">
              <span className="block md:hidden font-medium">Description</span>
              <input value={item.description} onChange={(e) => handleItemField(idx, 'description', e.target.value)} className="w-full rounded-lg border border-sand px-2 py-1.5 text-sm" placeholder="Description" />
            </label>
            <label className="col-span-6 space-y-1 text-xs text-foreground md:col-span-2">
              <span className="block md:hidden font-medium">SKU</span>
              <input value={item.sku || ''} onChange={(e) => handleItemField(idx, 'sku', e.target.value)} className="w-full rounded-lg border border-sand px-2 py-1.5 text-sm" placeholder="SKU" />
            </label>
            <label className="col-span-6 space-y-1 text-xs text-foreground md:col-span-2">
              <span className="block md:hidden font-medium">Quantity</span>
              <input type="number" min="1" value={item.quantity} onChange={(e) => handleItemField(idx, 'quantity', Number(e.target.value))} className="w-full rounded-lg border border-sand px-2 py-1.5 text-sm" placeholder="Qty" />
            </label>
            <label className="col-span-6 space-y-1 text-xs text-foreground md:col-span-2">
              <span className="block md:hidden font-medium">Unit Price</span>
              <input type="number" value={item.unitPrice || 0} onChange={(e) => handleItemField(idx, 'unitPrice', Number(e.target.value))} className="w-full rounded-lg border border-sand px-2 py-1.5 text-sm" placeholder="Unit Price" />
            </label>
            <label className="col-span-4 space-y-1 text-xs text-foreground md:col-span-1">
              <span className="block md:hidden font-medium">Line Total</span>
              <input type="number" value={item.lineTotal || 0} onChange={(e) => handleItemField(idx, 'lineTotal', Number(e.target.value))} className="w-full rounded-lg border border-sand px-2 py-1.5 text-sm" placeholder="Line Total" />
            </label>
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
  );

  return (
    <div className={embedded ? '' : 'min-h-screen bg-background'}>
      <div className={embedded ? 'mx-auto w-full max-w-[1200px]' : 'mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12'}>
        {embedded && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-espresso">Create Customer PO</h2>
            {onClose && <Button variant="outline" onClick={onClose}>Close</Button>}
          </div>
        )}
        <h1 className="font-serif text-3xl font-bold text-espresso">Customer PO Intake</h1>
        <p className="mt-1 text-muted-foreground">Staff can encode customer-submitted PO files, even when the customer has no account</p>

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
            {!!extractionStatus && (
              <p className="mt-3 text-sm text-muted-foreground">{extractionStatus}</p>
            )}
            {extraction && (
              <p className="mt-3 text-sm text-muted-foreground">Extraction confidence: {Number(extraction.confidence || 0).toFixed(2)} · {extraction.warnings || 'No warnings'}</p>
            )}
            {!!attachments.length && (
              <div className="mt-3 space-y-1 text-sm">
                {attachments.map((a) => (
                  <button key={a.id} type="button" onClick={() => handleAttachmentPreview(a.id)} className="block text-primary hover:underline">
                    <FileText className="mr-1 inline h-4 w-4" /> {a.fileName}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {preview?.url ? (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-sand bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-espresso">Uploaded PO Document</h3>
              <iframe title="PO document preview" src={preview.url} className="h-[700px] w-full rounded border border-sand" />
            </div>
            {formCard}
          </div>
        ) : (
          <div className="mt-6">{formCard}</div>
        )}
      </div>
    </div>
  );
};

export default AdminCreatePO;
