import React, { useEffect, useState } from 'react';
import mlService from '../services/mlModelService.js';

const UrgencyPrediction = () => {
  const [schemaLoading, setSchemaLoading] = useState(true);
  const [schemaError, setSchemaError] = useState('');
  const [featuresSchema, setFeaturesSchema] = useState([]);
  const [modelName, setModelName] = useState('');

  const [formValues, setFormValues] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const schema = await mlService.getUrgencySchema();
        if (!isMounted) return;
        if (schema?.features && Array.isArray(schema.features)) {
          setFeaturesSchema(schema.features);
          setModelName(schema?.model || '');
          const init = {};
          schema.features.forEach((f) => { init[f.name] = ''; });
          setFormValues(init);
        } else {
          setSchemaError('Invalid schema from server.');
        }
      } catch (err) {
        setSchemaError(err?.message || 'Failed to load schema.');
      } finally {
        setSchemaLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const mapNumericToLabel = (value) => {
    if (value === 0 || value === '0') return 'Low';
    if (value === 1 || value === '1') return 'Medium';
    if (value === 2 || value === '2') return 'High';
    return String(value);
  };

  const getUrgencyClass = (label) => {
    const normalized = String(label).toLowerCase();
    if (normalized === 'low') return 'urgency-badge low';
    if (normalized === 'medium') return 'urgency-badge medium';
    if (normalized === 'high') return 'urgency-badge high';
    return 'urgency-badge';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    for (const f of featuresSchema) {
      if (formValues[f.name] === '' || formValues[f.name] === undefined || formValues[f.name] === null) {
        setError('Please fill all required fields.');
        return;
      }
    }

    const payload = {};
    featuresSchema.forEach((f) => {
      if (f.type === 'number') {
        const num = Number(formValues[f.name]);
        payload[f.name] = Number.isFinite(num) ? num : 0;
      } else {
        payload[f.name] = formValues[f.name];
      }
    });

    setLoading(true);
    try {
      const response = await mlService.predictUrgencyScore(payload);
      // Accept either a string label or a numeric code
      const label = typeof response?.urgency === 'number'
        ? mapNumericToLabel(response.urgency)
        : (response?.urgency || '');

      setResult({
        label,
        model: response?.model || response?.bestModel || '',
      });
    } catch (err) {
      setError(err?.message || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="prediction-page">
      <h2>Predict Request Urgency</h2>
      {modelName ? (<p className="model-name">Model in use: {modelName}</p>) : null}

      {schemaLoading ? (
        <p>Loading form…</p>
      ) : schemaError ? (
        <div className="error-box" role="alert">{schemaError}</div>
      ) : (
        <form className="prediction-form" onSubmit={handleSubmit}>
          {featuresSchema.map((f) => (
            <div className="form-row" key={f.name}>
              <label htmlFor={f.name}>{f.name}<span className="req">*</span></label>
              {f.type === 'select' ? (
                <select
                  id={f.name}
                  name={f.name}
                  value={formValues[f.name]}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select {f.name}</option>
                  {(f.options || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={f.name}
                  name={f.name}
                  type="number"
                  inputMode="decimal"
                  value={formValues[f.name]}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}
          <div className="actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Predicting…' : 'PREDICT URGENCY'}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="error-box" role="alert">{error}</div>
      )}

      {result && (
        <div className="result-box">
          <div className="result-row">
            <span className="result-label">Predicted Urgency:</span>
            <span className={getUrgencyClass(result.label)}>{result.label}</span>
          </div>
          {result.model ? (
            <div className="result-row">
              <span className="result-label">Model Used:</span>
              <span className="model-name">{result.model}</span>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
};

export default UrgencyPrediction;


