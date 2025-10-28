// src/components/CreateRequestDialog.jsx
import React from "react";
// Removed lucide-react imports

const CreateRequestDialog = ({ 
    isDialogOpen, 
    setIsDialogOpen, 
    newRequest, 
    handleChange, 
    handleSelectChange, 
    handleCreateRequest, 
    isPredicting 
}) => {

    if (!isDialogOpen) return null;

    const handleClose = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className="dialog-overlay" onClick={handleClose}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <div className="dialog-header">
                    <div className="dialog-header-row">
                        <h2 className="section-title">Create New NGO Request</h2>
                        <button
                            onClick={handleClose}
                            className="btn btn-ghost btn-icon"
                            style={{fontSize: '1.5em'}}
                        >
                            &times; {/* Replaced X icon with standard Unicode cross */}
                        </button>
                    </div>
                </div>
                
                <div className="dialog-body">
                    <p className="helper-text" style={{marginBottom: '15px'}}>
                        Fill in all the details below. Our AI will analyze and assign priority automatically.
                    </p>
                    
                    {/* --- FORM FIELDS START --- */}
                    <div className="form-grid-2">
                        {/* Request Title */}
                        <div className="stack-sm">
                            <label htmlFor="title" className="label">Request Title *</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Short one-line summary of request"
                                value={newRequest.title || ''} 
                                onChange={handleChange}
                                required
                                className="input"
                            />
                        </div>
                        
                        {/* Domain */}
                        <div className="stack-sm">
                            <label htmlFor="domain" className="label">Domain *</label>
                            <select 
                                id="domain"
                                value={newRequest.domain || ''} 
                                onChange={e => handleSelectChange('domain', e.target.value)}
                                required
                                className="input"
                            >
                                <option value="">Select domain</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Food">Food</option>
                                <option value="Shelter">Shelter</option>
                                <option value="Disaster Relief">Disaster Relief</option>
                                <option value="Employment">Employment</option>
                            </select>
                        </div>
                    </div>

                    {/* Location (State & District) */}
                    <div className="form-grid-2">
                        <div className="stack-sm">
                            <label htmlFor="state" className="label">State *</label>
                            <select 
                                id="state"
                                value={newRequest.state || ''} 
                                onChange={e => handleSelectChange('state', e.target.value)}
                                required
                                className="input"
                            >
                                <option value="">Select state</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                            </select>
                        </div>
                        <div className="stack-sm">
                            <label htmlFor="district" className="label">District *</label>
                            <input
                                id="district"
                                type="text"
                                placeholder="Enter district"
                                value={newRequest.district || ''} 
                                onChange={handleChange}
                                required
                                className="input"
                            />
                        </div>
                    </div>

                    {/* Local Area & People Affected */}
                    <div className="form-grid-2">
                        <div className="stack-sm">
                            <label htmlFor="local_area" className="label">Local Area</label>
                            <input
                                id="local_area"
                                type="text"
                                placeholder="Enter local area/village"
                                value={newRequest.local_area || ''} 
                                onChange={handleChange}
                                className="input"
                            />
                        </div>
                        <div className="stack-sm">
                            <label htmlFor="people_affected" className="label">People Affected</label>
                            <input
                                id="people_affected"
                                type="number"
                                min="0"
                                placeholder="Number of people impacted"
                                value={newRequest.people_affected || ''} 
                                onChange={handleChange}
                                className="input"
                            />
                        </div>
                    </div>
                    
                    {/* Resources Required & Urgency Reason */}
                    <div className="form-grid-2">
                        <div className="stack-sm">
                            <label htmlFor="resources_required" className="label">Resources Required</label>
                            <select 
                                id="resources_required"
                                value={newRequest.resources_required || ''} 
                                onChange={e => handleSelectChange('resources_required', e.target.value)}
                                className="input"
                            >
                                <option value="">Select resource type</option>
                                <option value="Food Kits">Food Kits</option>
                                <option value="Medicines">Medicines</option>
                                <option value="Beds/Shelter">Beds/Shelter</option>
                                <option value="Funds">Funds</option>
                                <option value="Volunteers">Volunteers</option>
                            </select>
                        </div>
                        <div className="stack-sm">
                            <label htmlFor="urgency_reason" className="label">Urgency Reason</label>
                            <select 
                                id="urgency_reason"
                                value={newRequest.urgency_reason || ''} 
                                onChange={e => handleSelectChange('urgency_reason', e.target.value)}
                                className="input"
                            >
                                <option value="">Select urgency reason</option>
                                <option value="Natural Disaster (Flood/Earthquake)">Natural Disaster</option>
                                <option value="Disease Outbreak">Disease Outbreak</option>
                                <option value="Community Emergency">Community Emergency</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Timeline & Description */}
                    <div className="stack-sm">
                        <label htmlFor="timeline" className="label">Timeline</label>
                        <select 
                            id="timeline"
                            value={newRequest.timeline || ''} 
                            onChange={e => handleSelectChange('timeline', e.target.value)}
                            className="input"
                        >
                            <option value="">Select timeline</option>
                            <option value="Immediate">Immediate</option>
                            <option value="Within 1 week">Within 1 week</option>
                            <option value="Long term">Long term</option>
                        </select>
                    </div>

                    <div className="stack-sm">
                        <label htmlFor="description" className="label">Full Description</label>
                        <textarea
                            id="description"
                            placeholder="Provide detailed information about your request"
                            value={newRequest.description || ''} 
                            onChange={handleChange}
                            rows={4}
                            className="textarea"
                        />
                    </div>
                    
                </div>

                {/* Footer */}
                <div className="dialog-footer">
                    <button
                        type="button"
                        className="btn btn-outline btn-md secondary-button"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCreateRequest}
                        disabled={isPredicting}
                        className="btn btn-primary btn-md primary-button"
                        style={{display: 'flex', alignItems: 'center', gap: '5px'}}
                    >
                        {isPredicting ? (
                            <>
                                <span style={{fontSize: '1.2em'}}>🧠</span>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <span style={{fontSize: '1.2em'}}>⚡</span>
                                Create Request
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CreateRequestDialog;