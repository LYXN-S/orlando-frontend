import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import orderService from '../../services/orderService';
import inventoryService from '../../services/inventoryService';
import procurementService from '../../services/procurementService';
import AdminCreatePO from './AdminCreatePO';
import { Loader2, CheckCircle, XCircle, Clock, FileCheck2 } from 'lucide-react';

const statusColors = {
  PENDING_REVIEW: 'muted',
  APPROVED: 'success',
  REJECTED: 'destructive',
};

const statusIcon = {
  PENDING_REVIEW: <Clock className="h-4 w-4 text-amber-500" />,
  APPROVED: <CheckCircle className="h-4 w-4 text-green-600" />,
  REJECTED: <XCircle className="h-4 w-4 text-red-500" />,
};

const emptyAllocation = (item, defaultWarehouse = 'OFFICE') => ({
  orderItemId: item.orderItemId ?? null,
  productId: item.productId,
  warehouseCode: defaultWarehouse,
  allocatedQuantity: item.quantity,
});

const AdminOrders = () => {
  const [moduleTab, setModuleTab] = useState('PO_REVIEWS');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [poReviews, setPoReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [activePoId, setActivePoId] = useState(null);
  const [activePo, setActivePo] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [note, setNote] = useState('');
  const [savingAllocations, setSavingAllocations] = useState(false);
  const [deciding, setDeciding] = useState(false);
  const [systemPos, setSystemPos] = useState([]);
  const [loadingSystemPos, setLoadingSystemPos] = useState(false);
  const [systemPoFilter, setSystemPoFilter] = useState('ALL');
  const [activeSystemPoId, setActiveSystemPoId] = useState(null);
  const [activeSystemPo, setActiveSystemPo] = useState(null);
  const [systemPoPreview, setSystemPoPreview] = useState(null);

  useEffect(() => {
    loadPoReviews();
    loadWarehouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    loadSystemPos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemPoFilter]);

  useEffect(() => {
    if (activePoId) {
      loadPoDetail(activePoId);
    }
  }, [activePoId]);

  useEffect(() => {
    if (activeSystemPoId) {
      loadSystemPoDetail(activeSystemPoId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSystemPoId]);

  const loadPoReviews = async () => {
    try {
      setLoading(true);
      const data = await orderService.getPOReviews(filter);
      setPoReviews(data);
      if (data.length && !activePoId) {
        setActivePoId(data[0].id);
      }
      if (!data.length) {
        setActivePoId(null);
        setActivePo(null);
      }
    } catch (err) {
      console.error('Failed to load PO reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSystemPos = async () => {
    try {
      setLoadingSystemPos(true);
      const data = await procurementService.list(systemPoFilter);
      setSystemPos(data || []);
      if (data?.length && !activeSystemPoId) {
        setActiveSystemPoId(data[0].id);
      }
      if (!data?.length) {
        setActiveSystemPoId(null);
        setActiveSystemPo(null);
      }
    } catch (err) {
      console.error('Failed to load procurement POs:', err);
    } finally {
      setLoadingSystemPos(false);
    }
  };

  const loadSystemPoDetail = async (id) => {
    try {
      const detail = await procurementService.getById(id);
      setActiveSystemPo(detail);
      setSystemPoPreview(null);
      if (detail?.attachments?.length) {
        openSystemPoAttachment(detail.attachments[0].id);
      }
    } catch (err) {
      console.error('Failed to load procurement PO detail:', err);
    }
  };

  const openSystemPoAttachment = async (attachmentId) => {
    try {
      if (systemPoPreview?.revoke) {
        systemPoPreview.revoke();
      }
      const preview = await procurementService.getAttachmentPreview(attachmentId);
      setSystemPoPreview(preview);
    } catch (err) {
      console.error('Failed to preview attachment:', err);
    }
  };

  const loadWarehouses = async () => {
    try {
      const data = await inventoryService.getWarehouses();
      setWarehouses(data || []);
    } catch (err) {
      console.error('Failed to load warehouses:', err);
    }
  };

  const loadPoDetail = async (poId) => {
    try {
      const detail = await orderService.getPOReviewById(poId);
      setActivePo(detail);
      setNote(detail.reviewNote || '');

      const existing = detail.allocations || [];
      if (existing.length) {
        setAllocations(existing.map((a) => ({
          orderItemId: a.orderItemId,
          productId: a.productId,
          warehouseCode: a.warehouseCode,
          allocatedQuantity: a.allocatedQuantity,
        })));
      } else {
        setAllocations((detail.items || []).map((item) => ({
          orderItemId: item.orderItemId,
          productId: item.productId,
          warehouseCode: 'OFFICE',
          allocatedQuantity: item.quantity,
        })));
      }
    } catch (err) {
      console.error('Failed to load PO detail:', err);
    }
  };

  const allocatedByItem = useMemo(() => {
    const map = new Map();
    allocations.forEach((line) => {
      const key = line.orderItemId || line.productId;
      map.set(key, (map.get(key) || 0) + Number(line.allocatedQuantity || 0));
    });
    return map;
  }, [allocations]);

  const allocationValid = useMemo(() => {
    if (!activePo) return false;
    return (activePo.items || []).every((item) => {
      const key = item.orderItemId;
      const allocated = allocatedByItem.get(key) || 0;
      return allocated === item.quantity;
    });
  }, [activePo, allocatedByItem]);

  const setAllocationField = (index, field, value) => {
    setAllocations((prev) => prev.map((line, idx) => (idx === index ? { ...line, [field]: value } : line)));
  };

  const addAllocationLine = (item) => {
    setAllocations((prev) => [...prev, emptyAllocation({
      orderItemId: item.orderItemId || item.productId,
      productId: item.productId,
      quantity: 1,
    })]);
  };

  const removeAllocationLine = (index) => {
    setAllocations((prev) => prev.filter((_, idx) => idx !== index));
  };

  const saveAllocations = async () => {
    if (!activePo) return;
    setSavingAllocations(true);
    try {
      const payload = allocations.map((line) => ({
        orderItemId: line.orderItemId,
        productId: line.productId,
        warehouseCode: line.warehouseCode,
        allocatedQuantity: Number(line.allocatedQuantity),
      }));
      await orderService.savePOAllocations(activePo.id, payload);
      await loadPoDetail(activePo.id);
    } catch (err) {
      console.error('Failed to save allocations:', err);
      alert(err.response?.data?.message || 'Failed to save allocations');
    } finally {
      setSavingAllocations(false);
    }
  };

  const decide = async (approved) => {
    if (!activePo) return;
    if (approved && !allocationValid) {
      alert('Allocation must match required quantity per item before approval.');
      return;
    }

    setDeciding(true);
    try {
      await orderService.decidePO(activePo.id, approved, note);
      await loadPoReviews();
      await loadPoDetail(activePo.id);
    } catch (err) {
      console.error('Failed to submit decision:', err);
      alert(err.response?.data?.message || 'Failed to submit decision');
    } finally {
      setDeciding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:px-8 md:py-12 lg:grid-cols-5">
        <section className="rounded-xl border border-sand bg-white p-4 shadow-sm lg:col-span-2">
          <h1 className="font-serif text-2xl font-bold text-espresso">Order & PO Module</h1>
          <p className="mt-1 text-sm text-muted-foreground">PO reviews, procurement PO list, and create PO in one place</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setModuleTab('PO_REVIEWS')}
              className={`rounded-full px-3 py-1 text-xs font-medium ${moduleTab === 'PO_REVIEWS' ? 'bg-primary text-white' : 'bg-cream text-muted-foreground hover:bg-sand'}`}
            >
              PO Reviews
            </button>
            <button
              onClick={() => setModuleTab('PROCUREMENT_POS')}
              className={`rounded-full px-3 py-1 text-xs font-medium ${moduleTab === 'PROCUREMENT_POS' ? 'bg-primary text-white' : 'bg-cream text-muted-foreground hover:bg-sand'}`}
            >
              Procurement POs
            </button>
            <Button size="sm" onClick={() => setCreateModalOpen(true)} className="ml-auto bg-primary text-white hover:bg-primary-hover">
              Create PO
            </Button>
          </div>

          {moduleTab === 'PO_REVIEWS' && (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                {['ALL', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${filter === status ? 'bg-primary text-white' : 'bg-cream text-muted-foreground hover:bg-sand'}`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {poReviews.length === 0 && <p className="text-sm text-muted-foreground">No PO reviews found.</p>}
                {poReviews.map((po) => (
                  <button
                    key={po.id}
                    onClick={() => setActivePoId(po.id)}
                    className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${activePoId === po.id ? 'border-primary bg-primary/5' : 'border-sand hover:bg-cream/40'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-espresso">PO Review #{po.id}</span>
                      <Badge variant={statusColors[po.status] || 'muted'}>{po.status.replace('_', ' ')}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Order #{po.orderId} · Customer {po.customerId}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {moduleTab === 'PROCUREMENT_POS' && (
            <div className="mt-4 space-y-2">
              <div className="mb-2 flex flex-wrap gap-2">
                {['ALL', 'DRAFT', 'CONFIRMED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSystemPoFilter(status)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${systemPoFilter === status ? 'bg-primary text-white' : 'bg-cream text-muted-foreground hover:bg-sand'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              {loadingSystemPos && <p className="text-sm text-muted-foreground">Loading procurement POs...</p>}
              {!loadingSystemPos && systemPos.length === 0 && <p className="text-sm text-muted-foreground">No procurement POs found.</p>}
              {systemPos.map((po) => (
                <button
                  key={po.id}
                  onClick={() => setActiveSystemPoId(po.id)}
                  className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${activeSystemPoId === po.id ? 'border-primary bg-primary/5' : 'border-sand hover:bg-cream/40'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-espresso">Procurement PO #{po.id}</span>
                    <Badge variant={po.status === 'CONFIRMED' ? 'success' : 'muted'}>{po.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{po.customerName || 'Unknown Customer'} · {po.poNumber || 'No Number'}</p>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-sand bg-white p-5 shadow-sm lg:col-span-3">
          {moduleTab === 'PO_REVIEWS' && (!activePo ? (
            <p className="text-sm text-muted-foreground">Select a PO review to start evaluation.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {statusIcon[activePo.status] || <FileCheck2 className="h-4 w-4" />}
                  <h2 className="font-serif text-xl font-semibold text-espresso">PO #{activePo.id}</h2>
                  <Badge variant={statusColors[activePo.status] || 'muted'}>{activePo.status.replace('_', ' ')}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Order #{activePo.orderId}</p>
              </div>

              <div className="mt-5 space-y-3">
                {(activePo.items || []).map((item) => {
                  const key = item.orderItemId;
                  const allocated = allocatedByItem.get(key) || 0;
                  const valid = allocated === item.quantity;
                  return (
                    <div key={`${item.productId}-${key}`} className="rounded-lg border border-sand p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-espresso">{item.productName}</p>
                        <span className={`text-xs font-medium ${valid ? 'text-green-700' : 'text-red-600'}`}>
                          Required {item.quantity} · Allocated {allocated}
                        </span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {allocations
                          .map((line, idx) => ({ ...line, idx }))
                          .filter((line) => (line.orderItemId || line.productId) === key)
                          .map((line) => (
                            <div key={line.idx} className="grid grid-cols-12 gap-2">
                              <select
                                value={line.warehouseCode}
                                onChange={(e) => setAllocationField(line.idx, 'warehouseCode', e.target.value)}
                                className="col-span-5 rounded-lg border border-sand px-2 py-1.5 text-sm"
                                disabled={activePo.status !== 'PENDING_REVIEW'}
                              >
                                {warehouses.map((w) => <option key={w.code} value={w.code}>{w.displayName}</option>)}
                              </select>
                              <input
                                type="number"
                                min="1"
                                value={line.allocatedQuantity}
                                onChange={(e) => setAllocationField(line.idx, 'allocatedQuantity', e.target.value)}
                                className="col-span-4 rounded-lg border border-sand px-2 py-1.5 text-sm"
                                disabled={activePo.status !== 'PENDING_REVIEW'}
                              />
                              {activePo.status === 'PENDING_REVIEW' && (
                                <Button type="button" variant="outline" className="col-span-3" onClick={() => removeAllocationLine(line.idx)}>
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                      </div>

                      {activePo.status === 'PENDING_REVIEW' && (
                        <Button className="mt-2" size="sm" variant="outline" onClick={() => addAllocationLine(item)}>
                          Add Warehouse Split
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5">
                <label className="mb-1 block text-sm font-medium text-espresso">Review Note</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-sand px-3 py-2 text-sm"
                  disabled={activePo.status !== 'PENDING_REVIEW'}
                />
              </div>

              {activePo.status === 'PENDING_REVIEW' && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button onClick={saveAllocations} variant="outline" disabled={savingAllocations || deciding}>
                    {savingAllocations ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Allocations'}
                  </Button>
                  <Button onClick={() => decide(true)} disabled={!allocationValid || deciding} className="bg-green-600 text-white hover:bg-green-700">
                    {deciding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve PO'}
                  </Button>
                  <Button onClick={() => decide(false)} disabled={deciding} variant="destructive">
                    {deciding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject PO'}
                  </Button>
                </div>
              )}
            </>
          ))}

          {moduleTab === 'PROCUREMENT_POS' && (!activeSystemPo ? (
            <p className="text-sm text-muted-foreground">Select a procurement PO to view details and uploaded source.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold text-espresso">Procurement PO #{activeSystemPo.id}</h2>
                <Badge variant={activeSystemPo.status === 'CONFIRMED' ? 'success' : 'muted'}>{activeSystemPo.status}</Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div><span className="font-semibold">Customer:</span> {activeSystemPo.customerName || '-'}</div>
                <div><span className="font-semibold">PO Number:</span> {activeSystemPo.poNumber || '-'}</div>
                <div><span className="font-semibold">PO Date:</span> {activeSystemPo.poDate || '-'}</div>
                <div><span className="font-semibold">Delivery Date:</span> {activeSystemPo.deliveryDate || '-'}</div>
                <div><span className="font-semibold">Total:</span> {activeSystemPo.total || 0}</div>
              </div>

              {!!activeSystemPo.attachments?.length && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-espresso">Uploaded Documents</p>
                  <div className="flex flex-wrap gap-2">
                    {activeSystemPo.attachments.map((a) => (
                      <Button key={a.id} size="sm" variant="outline" onClick={() => openSystemPoAttachment(a.id)}>
                        <FileCheck2 className="mr-2 h-4 w-4" /> {a.fileName}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-sand p-3">
                  <p className="mb-2 text-sm font-semibold text-espresso">Uploaded PO Preview</p>
                  {systemPoPreview?.url ? (
                    <iframe title="Uploaded PO" src={systemPoPreview.url} className="h-[540px] w-full rounded border border-sand" />
                  ) : (
                    <p className="text-sm text-muted-foreground">Select an uploaded document to preview.</p>
                  )}
                </div>

                <div className="rounded-lg border border-sand p-3">
                  <p className="mb-2 text-sm font-semibold text-espresso">Auto-populated Items</p>
                  <div className="max-h-[540px] space-y-2 overflow-y-auto">
                    {(activeSystemPo.items || []).map((item, idx) => (
                      <div key={`${idx}-${item.lineNumber || idx}`} className="rounded border border-sand p-2 text-xs">
                        <p className="font-medium text-espresso">{item.description || `Line ${idx + 1}`}</p>
                        <p>Qty: {item.quantity || 0}</p>
                        <p>Unit Price: {item.unitPrice || 0}</p>
                        <p>Line Total: {item.lineTotal || 0}</p>
                      </div>
                    ))}
                    {(!activeSystemPo.items || activeSystemPo.items.length === 0) && (
                      <p className="text-sm text-muted-foreground">No extracted items.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl">
            <AdminCreatePO
              embedded
              onClose={() => setCreateModalOpen(false)}
              onSaved={() => {
                loadSystemPos();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
