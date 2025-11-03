// src/pages/NGODashboard.jsx
import React, { useState, useRef } from "react";
import RequestTable from "../components/RequestTable.jsx"; // <-- Uses the simplified table component
import Modal from "../components/Modal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNeeds } from "../context/NeedsContext.jsx";

// -----------------------------------------------------------------
// 1. DYNAMIC OPTIONS FROM CSV DATA
// -----------------------------------------------------------------

const DOMAIN_OPTIONS = ['Disaster Relief', 'Education', 'Employment', 'Food', 'Healthcare', 'Shelter'];

const STATE_OPTIONS = ['Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana'];

const RESOURCE_TYPE_OPTIONS = ['Beds/Shelter', 'Food Kits', 'Funds', 'Medicines', 'Volunteers'];

const URGENCY_REASON_OPTIONS = ['Community Emergency', 'Disease Outbreak', 'Health Emergency', 'Natural Disaster (Flood/Earthquake)', 'Seasonal Need'];

const TIMELINE_OPTIONS = ['Immediate', 'Long term', 'Within 1 week'];

// -----------------------------------------------------------------
// END DYNAMIC OPTIONS
// -----------------------------------------------------------------

// --- ICON MAP --- (Using Unicode/Text)
const ICON_MAP = {
    ClipboardList: "📋", 
    Clock: "🕓",        
    CheckCircle2: "✅",  
    Brain: "🧠",         
    Plus: "+",           
    X: "×"
};
// ----------------

// -----------------------------------------------------------------
// EXTRACTED COMPONENT: RequestForm (Now accepts an 'options' prop)
// -----------------------------------------------------------------
const RequestForm = ({ formData, handleInputChange, handlePostNeed, setIsModalOpen, options }) => {
    
    const handleCancel = () => {
        setIsModalOpen(false); 
    };

    // Helper function to map an array of values to options
    const renderOptions = (list) => (
        list.map(item => (
            <option key={item} value={item}>{item}</option>
        ))
    );

    return (
        <form onSubmit={handlePostNeed}>
            <p style={{marginBottom: '15px', color: '#666', fontSize: '0.9em'}}>
              Fill in all the details below. Our AI will analyze and assign priority automatically.
            </p>
            
            {/* 1. Request Title */}
            <input 
              type="text" name="title" placeholder="Request Title *" 
              onChange={handleInputChange} 
              value={formData.title || ''} 
              required 
            />
            
            {/* 2. Domain (Category) - DYNAMIC */}
            <select name="domain" onChange={handleInputChange} value={formData.domain || ''} required>
                <option value="">Select Domain *</option>
                {renderOptions(options.domain)}
            </select>

            {/* 3. State - DYNAMIC */}
            <select name="state" onChange={handleInputChange} value={formData.state || ''} required>
                <option value="">Select State *</option>
                {renderOptions(options.state)}
            </select>

            {/* 4. District */}
            <input 
              type="text" name="district" placeholder="Enter District *" 
              onChange={handleInputChange} 
              value={formData.district || ''}
              required 
            />

            {/* 5. Local Area */}
            <input 
              type="text" name="localArea" placeholder="Enter local area/village" 
              onChange={handleInputChange} 
              value={formData.localArea || ''}
            />

            {/* 6. People Affected */}
            <input 
              type="number" name="peopleAffected" placeholder="Number of people impacted" 
              onChange={handleInputChange} 
              value={formData.peopleAffected || ''}
            />
            
            {/* 7. Resources Required (resourceType) - DYNAMIC */}
            <select name="resourceType" onChange={handleInputChange} value={formData.resourceType || ''} required>
                <option value="">Select resource type *</option>
                {renderOptions(options.resourceType)}
            </select>

            {/* 8. Urgency Reason (urgencyReason) - DYNAMIC */}
            <select name="urgencyReason" onChange={handleInputChange} value={formData.urgencyReason || ''}>
                <option value="">Select urgency reason</option>
                {renderOptions(options.urgencyReason)}
            </select>
            
            {/* 9. Timeline (timeline) - DYNAMIC */}
            <select name="timeline" onChange={handleInputChange} value={formData.timeline || ''}>
                <option value="">Select timeline</option>
                {renderOptions(options.timeline)}
            </select>

            {/* 10. Full Description */}
            <textarea 
              name="description" 
              placeholder="Provide detailed information about your request" 
              rows={4} 
              onChange={handleInputChange}
              value={formData.description || ''}
            ></textarea>

            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="primary-button">Create Request</button>
            </div>
        </form>
    );
};
// -----------------------------------------------------------------


const NGODashboard = () => {
    const { user: currentUser } = useAuth(); 
    const { needs: requests, addNeed: addRequest } = useNeeds(); 
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({
        title: "", domain: "", state: "", district: "", localArea: "",
        peopleAffected: "", resourceType: "", urgencyReason: "",
        timeline: "", description: "",
    });

    // 2. Combine the options into one object for easy passing
    const formOptions = {
        domain: DOMAIN_OPTIONS,
        state: STATE_OPTIONS,
        resourceType: RESOURCE_TYPE_OPTIONS,
        urgencyReason: URGENCY_REASON_OPTIONS,
        timeline: TIMELINE_OPTIONS
    };

    const visibleRequests = Array.isArray(requests)
        ? requests.filter(r => r.ngoId === currentUser?.id)
        : [];

    const stats = [
        { title: "Total Requests", value: visibleRequests.length, icon: ICON_MAP.ClipboardList, description: "All time" },
        { title: "Open Requests", value: visibleRequests.filter(r => r.status === 'pending').length, icon: ICON_MAP.Clock, description: "Pending action" },
        { title: "Completed Requests", value: visibleRequests.filter(r => r.status === 'fulfilled').length, icon: ICON_MAP.CheckCircle2, description: "Successfully handled" },
        { title: "ML Predictions", value: 0, icon: ICON_MAP.Brain, description: "AI analyzed" },
    ];

    const resetForm = () => {
        setNewRequest({
            title: "", domain: "", state: "", district: "", localArea: "",
            peopleAffected: "", resourceType: "", urgencyReason: "",
            timeline: "", description: "",
        });
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRequest(prev => ({ ...prev, [name]: value || '' }));
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault(); 
        const req = newRequest;
        
        if (!req.title || !req.domain || !req.state || !req.district || !req.resourceType) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const requestData = {
                ...req,
                ngoId: currentUser.id, 
                description: req.description || req.title,
                status: 'pending', 
                date: new Date().toISOString().split('T')[0],
                category: req.domain,
            };

            const savedRequest = addRequest(requestData, currentUser.id); 
            
            if (savedRequest) {
                alert(`Request "${req.title}" created successfully!`);
                resetForm(); 
                setIsDialogOpen(false); 
            } else {
                alert("Failed to create request!");
            }
        } catch (error) {
            alert("An unknown error occurred during request submission.");
            console.error("Submission error:", error);
        }
    };
    
    const handleOpenDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        resetForm();
        setIsDialogOpen(false);
    };

    return (
        <div className="dashboard-layout container">
            <div className="dashboard-header-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <div className="dashboard-header">
                    <h1 className="dashboard-title">NGO Dashboard: {currentUser?.name}</h1>
                    <p className="dashboard-subtitle">Create and manage your requests</p>
                </div>
                <button
                    onClick={handleOpenDialog}
                    className="primary-button"
                    style={{whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px'}}
                >
                    <span style={{fontSize: '1.2em'}}>{ICON_MAP.Plus}</span>
                    Create New Request
                </button>
            </div>

            <div className="stats-grid">
                {stats.map((stat) => (
                    <div key={stat.title} className="stat-card">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                            <h3 className="stat-value">{stat.value}</h3>
                            <span style={{fontSize: '1.5em', color: '#4CAF50'}}>{stat.icon}</span>
                        </div>
                        <p className="stat-title" style={{fontWeight: 500, marginTop: '5px'}}>{stat.title}</p>
                        <small className="stat-description" style={{color: '#777'}}>{stat.description}</small>
                    </div>
                ))}
            </div>

            <div className="requests-section" style={{marginTop: '30px'}}>
                <h2 className="section-title">All Requests</h2>
                <div className="table-container">
                    <RequestTable requests={visibleRequests} />
                </div>
            </div>

            <Modal 
                title="Create New NGO Request"
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
            >
                <RequestForm 
                    formData={newRequest}
                    handleInputChange={handleInputChange}
                    handlePostNeed={handleCreateRequest}
                    setIsModalOpen={setIsDialogOpen}
                    options={formOptions} // 3. Pass the options object here
                />
            </Modal>
        </div>
    );
};

export default NGODashboard;