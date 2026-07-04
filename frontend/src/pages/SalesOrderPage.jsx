import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchClients } from '../redux/slices/clientsSlice';
import { fetchItems } from '../redux/slices/itemsSlice';
import {
  fetchOrderById,
  saveOrder,
  clearCurrent,
} from '../redux/slices/ordersSlice';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import OrderLinesEditor, { emptyLine } from '../components/OrderLinesEditor';
import { computeTotals } from '../utils/calculations';

// Screen 1: create a new sales order, or edit an existing one (/orders/:id).
export default function SalesOrderPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clients = useSelector((state) => state.clients.list);
  const items = useSelector((state) => state.items.list);
  const { current, currentStatus, saveStatus, saveError } = useSelector(
    (state) => state.orders
  );

  const [form, setForm] = useState({
    clientId: '',
    invoiceNo: '',
    invoiceDate: '',
    referenceNo: '',
    note: '',
  });
  const [lines, setLines] = useState([emptyLine()]);
  const [validationError, setValidationError] = useState('');

  // Load dropdown data, and the order itself when editing.
  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchItems());
    if (isEdit) {
      dispatch(fetchOrderById(id));
    }
    return () => {
      dispatch(clearCurrent());
    };
  }, [dispatch, id, isEdit]);

  // When the order arrives (edit mode), populate the form with its data.
  useEffect(() => {
    if (isEdit && current && String(current.id) === String(id)) {
      setForm({
        clientId: String(current.clientId),
        invoiceNo: current.invoiceNo || '',
        invoiceDate: current.invoiceDate ? current.invoiceDate.slice(0, 10) : '',
        referenceNo: current.referenceNo || '',
        note: current.note || '',
      });
      setLines(
        current.lines.map((line) => ({
          itemId: String(line.itemId),
          note: line.note || '',
          quantity: String(line.quantity),
          taxRate: String(line.taxRate),
        }))
      );
    }
  }, [current, id, isEdit]);

  // Address fields auto-fill from the selected customer.
  const selectedClient = clients.find(
    (c) => String(c.id) === String(form.clientId)
  );

  const totals = computeTotals(lines, items);

  const setField = (field) => (value) => setForm({ ...form, [field]: value });

  const handleSave = async () => {
    const filledLines = lines.filter((l) => l.itemId);

    if (!form.clientId) {
      setValidationError('Please select a customer.');
      return;
    }
    if (filledLines.length === 0) {
      setValidationError('Please add at least one item line.');
      return;
    }
    if (filledLines.some((l) => !l.quantity || parseFloat(l.quantity) <= 0)) {
      setValidationError('Quantity must be greater than zero for every line.');
      return;
    }
    setValidationError('');

    const payload = {
      clientId: Number(form.clientId),
      invoiceNo: form.invoiceNo || null,
      invoiceDate: form.invoiceDate || null,
      referenceNo: form.referenceNo || null,
      note: form.note || null,
      lines: filledLines.map((l) => ({
        itemId: Number(l.itemId),
        note: l.note || null,
        quantity: parseFloat(l.quantity),
        taxRate: parseFloat(l.taxRate) || 0,
      })),
    };

    const action = await dispatch(
      saveOrder({ id: isEdit ? Number(id) : null, data: payload })
    );
    if (saveOrder.fulfilled.match(action)) {
      navigate('/');
    }
  };

  if (isEdit && currentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <p className="text-sm text-gray-500">Loading order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-5xl rounded-lg border border-gray-300 bg-white shadow">
        <div className="border-b border-gray-300 bg-gray-50 px-4 py-3 text-center font-semibold text-gray-700">
          Sales Order
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 px-4 py-3 print:hidden">
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="rounded border border-gray-500 bg-gray-700 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Order'}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded border border-gray-400 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Print
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded border border-gray-400 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Back
          </button>
          {(validationError || saveError) && (
            <span className="text-sm text-red-600">
              {validationError || saveError}
            </span>
          )}
        </div>

        {/* Header: customer + invoice details */}
        <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2">
          <div className="space-y-2">
            <SelectInput
              label="Customer Name"
              value={form.clientId}
              onChange={setField('clientId')}
              options={clients.map((c) => ({
                value: String(c.id),
                label: c.customerName,
              }))}
              placeholder="-- Select customer --"
            />
            <TextInput label="Address 1" value={selectedClient?.address1 || ''} readOnly />
            <TextInput label="Address 2" value={selectedClient?.address2 || ''} readOnly />
            <TextInput label="Address 3" value={selectedClient?.address3 || ''} readOnly />
            <TextInput label="Suburb" value={selectedClient?.suburb || ''} readOnly />
            <TextInput label="State" value={selectedClient?.state || ''} readOnly />
            <TextInput label="Post Code" value={selectedClient?.postCode || ''} readOnly />
          </div>

          <div className="space-y-2">
            <TextInput
              label="Invoice No."
              value={form.invoiceNo}
              onChange={setField('invoiceNo')}
            />
            <TextInput
              label="Invoice Date"
              type="date"
              value={form.invoiceDate}
              onChange={setField('invoiceDate')}
            />
            <TextInput
              label="Reference no"
              value={form.referenceNo}
              onChange={setField('referenceNo')}
            />
            <div className="flex gap-2">
              <label className="w-32 shrink-0 pt-1 text-sm text-gray-700">Note</label>
              <textarea
                rows={5}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="w-full rounded border border-gray-400 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="px-4 pb-4">
          <OrderLinesEditor lines={lines} items={items} onChange={setLines} />
        </div>

        {/* Totals */}
        <div className="flex justify-end px-4 pb-6">
          <div className="w-full max-w-xs space-y-2">
            <TextInput label="Total Excl" value={totals.totalExcl.toFixed(2)} readOnly />
            <TextInput label="Total Tax" value={totals.totalTax.toFixed(2)} readOnly />
            <TextInput label="Total Incl" value={totals.totalIncl.toFixed(2)} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}
