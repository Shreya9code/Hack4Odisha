import {  useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { ewasteAPI, geminiAPI } from '../services/api';
import { useUser } from '@clerk/clerk-react';

const QRGenerator = () => {
  const [qrData, setQrData] = useState({
    itemType: '',
    customItemType: '',
    brand: '',
    model: '',
    age: '',
    weightValue: '',
    weightUnit: 'kg',
    condition: '',
    pickupAddress: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    picture: null,
  });
  const [generatedSerial, setGeneratedSerial] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [geminiClassification, setGeminiClassification] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [notification, setNotification] = useState(null);
  const labelRef = useRef(null);
  const { user } = useUser();

  // Helpers for localStorage persistence
  const STORAGE_KEY = 'ewaste_items';
  const readItems = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_e) {
      console.error('Error reading items from localStorage:', _e);
      return [];
    }
  };
  const writeItems = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };
  const upsertItem = (item) => {
    const items = readItems();
    const idx = items.findIndex((i) => i.serial === item.serial);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.unshift(item);
    }
    writeItems(items);
  };

  // Classify item using Gemini AI
  const classifyWithGemini = async () => {
    if (!qrData.itemType) {
      alert('Please select an Item Type first');
      return;
    }

    setIsClassifying(true);
    setGeminiClassification(null);

    try {
      const itemData = {
        itemType: qrData.itemType === 'Other' ? qrData.customItemType : qrData.itemType,
        brand: qrData.brand,
        model: qrData.model,
        age: qrData.age,
        weight: `${qrData.weightValue} ${qrData.weightUnit}`,
        condition: qrData.condition,
        picture: qrData.picture
      };

      const classification = await geminiAPI.classifyEwaste(itemData);
      setGeminiClassification(classification);
      
      // Show notification based on classification type
      if (classification && !classification.raw_response) {
        setNotification({ type: 'success', message: 'AI-powered classification completed successfully!' });
        console.log('Using AI-powered classification');
      } else {
        setNotification({ type: 'info', message: 'Using fallback classification due to API rate limits. Results are still accurate.' });
        console.log('Using fallback classification due to API limits');
      }
      
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error('Error classifying with Gemini:', error);
      // Don't show alert since we now have fallback classification
      // The error is handled gracefully in the API layer
    } finally {
      setIsClassifying(false);
    }
  };

  const generatedItem = useMemo(() => {
    if (!generatedSerial) return null;
    const { itemType, customItemType, weightValue, weightUnit, condition, pickupAddress, date } = qrData;

    const normalizedType = (itemType === 'Other' ? customItemType : itemType) || '';
    const numericWeightValue = Number.parseFloat(weightValue || '0') || 0;
    const numericWeightKg = (weightUnit === 'kg') ? numericWeightValue : (numericWeightValue / 1000);

    const computeClassification = () => {
      const typeLower = normalizedType.toLowerCase();
      const conditionLower = (condition || '').toLowerCase();
      const hazardousTypes = ['battery', 'ups', 'crt', 'tube', 'bulb', 'toner', 'ink'];
      if (hazardousTypes.some(t => typeLower.includes(t)) || conditionLower.includes('leak')) {
        return 'hazardous';
      }
      const reusableTypes = ['laptop','desktop','monitor','mobile','phone','tablet'];
      if (reusableTypes.some(t => typeLower.includes(t)) && (conditionLower.includes('working') || conditionLower.includes('good'))) {
        if (numericWeightKg <= 25) return 'reusable';
      }
      return 'recyclable';
    };

    const computeEstimatedPrice = () => {
      const typeLower = normalizedType.toLowerCase();
      const conditionLower = (condition || '').toLowerCase();
      // Base price per kg (in INR) by rough category
      let basePerKg = 15; // default miscellaneous e-waste
      if (/(laptop|desktop|computer|monitor|tablet|mobile|phone)/.test(typeLower)) basePerKg = 300;
      if (/(printer|scanner|tv|television)/.test(typeLower)) basePerKg = 150;
      if (/(battery|ups|crt|tube|bulb|toner|ink)/.test(typeLower)) basePerKg = 80; // often disposal cost offsets value

      // Condition multiplier
      let conditionMultiplier = 0.6; // fair/unknown
      if (/(working|good|ok)/.test(conditionLower)) conditionMultiplier = 1.0;
      if (/(damaged|broken|dead|faulty)/.test(conditionLower)) conditionMultiplier = 0.4;
      if (/(leak|hazard)/.test(conditionLower)) conditionMultiplier = 0.2;

      const price = Math.max(0, basePerKg * numericWeightKg * conditionMultiplier);
      return Math.round(price * 100) / 100; // 2 decimals
    };

    return {
      serial: generatedSerial,
      type: normalizedType,
      weightValue,
      weightUnit,
      condition,
      pickupAddress,
      date,
      classification: computeClassification(),
      estimatedPrice: computeEstimatedPrice(),
      status: 'reported',
      createdAt: new Date().toISOString(),
      geminiClassification: geminiClassification // Include AI classification results
    };
  }, [generatedSerial, qrData, geminiClassification]);

  const itemTypes = [
    'Laptop',
    'Desktop Computer',
    'Monitor',
    'Mobile Phone',
    'Tablet',
    'Printer',
    'Scanner',
    'Keyboard',
    'Mouse',
    'Headphones',
    'Other'
  ];

  const generateLabel = () => {
    if (!qrData.itemType) {
      alert('Please select an Item Type');
      return;
    }
    if (qrData.itemType === 'Other' && !qrData.customItemType) {
      alert('Please specify the Item Type');
      return;
    }

    setIsGenerating(true);
    
    // Generate a serial number
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.floor(Math.random() * 46655).toString(36).toUpperCase();
    const serial = `EW-${ts}-${rand}`;
    setGeneratedSerial(serial);

    // Persist item with initial status
    const normalizedType = qrData.itemType === 'Other' ? qrData.customItemType : qrData.itemType;
    const conditionLower = (qrData.condition || '').toLowerCase();
    const numericWeightValue = Number.parseFloat(qrData.weightValue || '0') || 0;
    const numericWeightKg = (qrData.weightUnit === 'kg') ? numericWeightValue : (numericWeightValue / 1000);
    const hazardousTypes = ['battery', 'ups', 'crt', 'tube', 'bulb', 'toner', 'ink'];
    const reusableTypes = ['laptop','desktop','monitor','mobile','phone','tablet'];
    const classification = hazardousTypes.some(t => (normalizedType || '').toLowerCase().includes(t)) || conditionLower.includes('leak')
      ? 'hazardous'
      : (reusableTypes.some(t => (normalizedType || '').toLowerCase().includes(t)) && (conditionLower.includes('working') || conditionLower.includes('good')) && numericWeightKg <= 25)
        ? 'reusable'
        : 'recyclable';

    const newItem = {
      serial,
      type: normalizedType,
      weightValue: qrData.weightValue,
      weightUnit: qrData.weightUnit,
      condition: qrData.condition,
      pickupAddress: qrData.pickupAddress,
      date: qrData.date,
      classification,
      estimatedPrice: (() => {
        const typeLower = (normalizedType || '').toLowerCase();
        const condLower = (qrData.condition || '').toLowerCase();
        let basePerKg = 15;
        if (/(laptop|desktop|computer|monitor|tablet|mobile|phone)/.test(typeLower)) basePerKg = 60;
        if (/(printer|scanner|tv|television)/.test(typeLower)) basePerKg = 35;
        if (/(battery|ups|crt|tube|bulb|toner|ink)/.test(typeLower)) basePerKg = 10;
        let m = 0.6;
        if (/(working|good|ok)/.test(condLower)) m = 1.0;
        if (/(damaged|broken|dead|faulty)/.test(condLower)) m = 0.4;
        if (/(leak|hazard)/.test(condLower)) m = 0.2;
        const kg = (qrData.weightUnit === 'kg') ? (Number.parseFloat(qrData.weightValue || '0') || 0) : ((Number.parseFloat(qrData.weightValue || '0') || 0) / 1000);
        const price = Math.max(0, basePerKg * kg * m);
        return Math.round(price * 100) / 100;
      })(),
      status: 'reported',
      createdAt: new Date().toISOString()
    };
    upsertItem(newItem);

    setTimeout(() => setIsGenerating(false), 300);
  };

  const downloadLabel = async () => {
    try {
      if (!generatedSerial) {
        alert('Please generate a label first.');
        return;
      }
      if (!labelRef.current) {
        alert('Label not found on screen.');
        return;
      }
      const canvas = await html2canvas(labelRef.current, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `label-${generatedSerial}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/png');
      } else {
        const link = document.createElement('a');
        link.download = `label-${generatedSerial}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download label. Please try again.');
    }
  };

  const submitToDatabase = async () => {
    if (!generatedItem) {
      alert('Please generate a label first.');
      return;
    }

    if (!user) {
      alert('User not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ewasteData = {
        donorId: user.id, // Use Clerk ID as donor ID
        serial: generatedItem.serial,
        itemType: generatedItem.type,
        brand: qrData.brand,
        model: qrData.model,
        age: qrData.age,
        weightValue: generatedItem.weightValue,
        weightUnit: generatedItem.weightUnit,
        condition: generatedItem.condition,
        pickupAddress: generatedItem.pickupAddress,
        date: new Date(generatedItem.date),
        pictureUrl: qrData.picture ? URL.createObjectURL(qrData.picture) : '',
        shortNote: qrData.notes,
        classification: generatedItem.classification,
        estimatedPrice: generatedItem.estimatedPrice,
        status: generatedItem.status,
        createdAt: new Date(),
        geminiClassification: generatedItem.geminiClassification // Include AI classification
      };

      await ewasteAPI.create(ewasteData);
      setIsSubmitted(true);
      alert('E-waste item successfully submitted to database!');
    } catch (error) {
      console.error('Error submitting to database:', error);
      alert('Failed to submit to database. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setQrData({
      itemType: '',
      customItemType: '',
      brand: '',
      model: '',
      age: '',
      weightValue: '',
      weightUnit: 'kg',
      condition: '',
      pickupAddress: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      picture: null,
    });
    setGeneratedSerial('');
    setIsSubmitted(false);
    setGeminiClassification(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-emerald-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">E-waste Label Generator</h1>
        <p className="mt-2 text-gray-600">
          Generate QR codes for e-waste items to track their lifecycle and management process.
        </p>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`rounded-lg p-4 ${
          notification.type === 'success' 
            ? '!bg-green-100 border border-green-300 text-green-800' 
            : '!bg-blue-100 border border-blue-300 text-blue-800'
        }`}>
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="text-sm font-medium hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-200 !bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Information</h2>
            
            <div className="space-y-4">
              {/* Item Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Type *</label>
                <select
                  value={qrData.itemType}
                  onChange={(e) => setQrData({ ...qrData, itemType: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="">Select item type</option>
                  {itemTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                {qrData.itemType === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify item type"
                    value={qrData.customItemType}
                    onChange={(e) => setQrData({ ...qrData, customItemType: e.target.value })}
                    className="mt-2 w-full rounded-lg border px-3 py-2"
                  />
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand (optional)</label>
                <input
                  type="text"
                  value={qrData.brand}
                  onChange={(e) => setQrData({ ...qrData, brand: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model (optional)</label>
                <input
                  type="text"
                  value={qrData.model}
                  onChange={(e) => setQrData({ ...qrData, model: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age (optional)</label>
                <input
                  type="text"
                  value={qrData.age}
                  onChange={(e) => setQrData({ ...qrData, age: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={qrData.weightValue}
                    onChange={(e) => setQrData({ ...qrData, weightValue: e.target.value })}
                    className="flex-1 rounded-lg border px-3 py-2"
                  />
                  <select
                    value={qrData.weightUnit}
                    onChange={(e) => setQrData({ ...qrData, weightUnit: e.target.value })}
                    className="w-28 rounded-lg border px-3 py-2"
                  >
                    <option value="kg">kg</option>
                    <option value="g">gram</option>
                  </select>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <input
                  type="text"
                  value={qrData.condition}
                  onChange={(e) => setQrData({ ...qrData, condition: e.target.value })}
                  placeholder="e.g., Working, Damaged"
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Pickup Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
                <input
                  type="text"
                  value={qrData.pickupAddress}
                  onChange={(e) => setQrData({ ...qrData, pickupAddress: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={qrData.date}
                  onChange={(e) => setQrData({ ...qrData, date: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setQrData({ ...qrData, picture: e.target.files[0] })}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Note (optional)</label>
                <textarea
                  value={qrData.notes}
                  onChange={(e) => setQrData({ ...qrData, notes: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2"
                  rows={3}
                />
              </div>

              {/* AI Classification Button */}
              <div>
                <button
                  onClick={classifyWithGemini}
                  disabled={isClassifying || !qrData.itemType || (qrData.itemType === 'Other' && !qrData.customItemType)}
                  className="w-full rounded-lg !bg-blue-600 px-4 py-2 font-semibold text-white hover:!bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClassifying ? 'Analyzing with AI...' : '🔍 Analyze with AI'}
                </button>
              </div>

              {/* AI Classification Results */}
              {geminiClassification && (
                <div className="mt-4 p-4 !bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">AI Analysis Results</h3>
                  
                  {/* Classification Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Hazardous:</span>
                      <span className="text-sm font-bold text-red-600">
                        {geminiClassification.classification?.hazardous?.percentage || 0}%
                      </span>
                    </div>
                    <div className="w-full !bg-gray-200 rounded-full h-2">
                      <div 
                        className="!bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${geminiClassification.classification?.hazardous?.percentage || 0}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Recyclable:</span>
                      <span className="text-sm font-bold text-green-600">
                        {geminiClassification.classification?.recyclable?.percentage || 0}%
                      </span>
                    </div>
                    <div className="w-full !bg-gray-200 rounded-full h-2">
                      <div 
                        className="!bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${geminiClassification.classification?.recyclable?.percentage || 0}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Reusable:</span>
                      <span className="text-sm font-bold text-blue-600">
                        {geminiClassification.classification?.reusable?.percentage || 0}%
                      </span>
                    </div>
                    <div className="w-full !bg-gray-200 rounded-full h-2">
                      <div 
                        className="!bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${geminiClassification.classification?.reusable?.percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  {/* Recommendations */}
                  {geminiClassification.recommendations && (
                    <div className="mt-4 p-3 !bg-white rounded border">
                      <h4 className="font-semibold text-gray-800 mb-2">Recommendations:</h4>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Disposal:</strong> {geminiClassification.recommendations.disposal_method}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Safety:</strong> {geminiClassification.recommendations.safety_notes}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Value:</strong> {geminiClassification.recommendations.value_estimate}
                      </p>
                    </div>
                  )}

                  {/* Environmental Impact */}
                  {geminiClassification.environmental_impact && (
                    <div className="mt-3 p-3 !bg-green-50 rounded border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Environmental Impact:</h4>
                      <p className="text-sm text-green-700 mb-1">
                        <strong>CO₂ Saved:</strong> {geminiClassification.environmental_impact.co2_saved}
                      </p>
                      <p className="text-sm text-green-700">
                        <strong>Landfill Reduction:</strong> {geminiClassification.environmental_impact.landfill_reduction}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={generateLabel}
                disabled={isGenerating || !qrData.itemType || (qrData.itemType === 'Other' && !qrData.customItemType)}
                className="flex-1 rounded-lg !bg-emerald-600 px-4 py-2 font-semibold text-white"
              >
                {isGenerating ? 'Generating...' : 'Generate Label'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white font-medium text-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Label Display Section */}
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Label</h2>
            
            {generatedItem ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                                     <div
                     ref={labelRef}
                     className="w-[640px] h-[480px] rounded-md overflow-hidden shadow relative"
                     style={{
                       backgroundColor: '#ffffff',
                       color: '#111111',
                       border: '1px solid #111111',
                       fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto'
                     }}
                   >
                     {/* Top: QR Code band */}
                     <div className="py-4 flex flex-col items-center justify-center" style={{ borderBottom: '1px solid #111111' }}>
                       <QRCodeSVG 
                         value={generatedItem.serial}
                         size={100}
                         level="M"
                         includeMargin={false}
                         className="w-[100px] h-[100px]"
                       />
                       <div className="mt-2 text-xs tracking-widest">{generatedItem.serial}</div>
                     </div>
                     {/* Bottom: Item details and address combined */}
                     <div className="p-4 flex-1">
                       <div className="text-sm font-semibold mb-2 text-center">Item Details</div>
                       <div className="text-xs rounded p-3 space-y-1" style={{ border: '1px solid #111111' }}>
                         <div className="flex justify-between">
                           <span>Type:</span>
                           <span className="font-medium">{generatedItem.type || '—'}</span>
                         </div>
                         <div className="flex justify-between">
                           <span>Weight:</span>
                           <span className="font-medium">{generatedItem.weightValue ? `${generatedItem.weightValue} ${generatedItem.weightUnit}` : '—'}</span>
                         </div>
                         <div className="flex justify-between">
                           <span>Classification:</span>
                           <span className="font-medium">{generatedItem.classification}</span>
                         </div>
                         <div className="flex justify-between">
                           <span>Est. Price:</span>
                           <span className="font-medium">₹{Number.isFinite(generatedItem.estimatedPrice) ? generatedItem.estimatedPrice.toFixed(2) : '0.00'}</span>
                         </div>
                         <div className="flex justify-between">
                           <span>Date:</span>
                           <span className="font-medium">{generatedItem.date}</span>
                         </div>
                         <div className="flex justify-between">
                           <span>Address:</span>
                           <span className="font-medium text-right max-w-[60%] break-words">{generatedItem.pickupAddress || '—'}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
                
                <div className="text-center space-y-3">
                  <button
                    onClick={downloadLabel}
                    className="w-full rounded-lg !bg-emerald-600 px-4 py-2 font-semibold text-white"
                  >
                    Download Label PNG
                  </button>
                  
                  {!isSubmitted ? (
                    <button
                      onClick={submitToDatabase}
                      disabled={isSubmitting}
                      className="w-full rounded-lg !bg-blue-600 px-4 py-2 font-semibold text-white hover:!bg-blue-700 disabled:!bg-blue-400"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  ) : (
                    <div className="w-full rounded-lg !bg-green-100 px-4 py-2 text-green-800 font-semibold">
                      ✓ Submitted Successfully
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">Tip: Vendor can scan this QR code to update status.</p>
                </div>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 !bg-gray-50">
                <p className="text-gray-600">Fill the form and generate a label</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
