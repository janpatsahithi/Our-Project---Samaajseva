import React from 'react';

// --- Helper Functions to Map Status to Display Text and CSS Class ---

const getPriorityStatus = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'high') return 'HIGH PRIORITY';
    if (statusLower === 'medium') return 'MEDIUM PRIORITY';
    if (statusLower === 'low') return 'LOW PRIORITY';
    
    // Default for 'pending' or unanalyzed status
    return 'High Priority';
}

const getPriorityClass = (status) => {
    const statusLower = status.toLowerCase();
    // Use the ML predicted status if it's one of the priority levels
    if (['high', 'medium', 'low'].includes(statusLower)) {
        return statusLower;
    }
    // Use 'pending' class for default/unaudited requests
    return 'high'; 
}

// ------------------------------------------------------------------

const RequestTable = ({ requests }) => {

    return (
        <div className="table-container">
            <table className="request-table">
                <thead>
                    <tr>
                        {/* Headers match your final desired layout */}
                        <th>Description</th>
                        {/* CHANGED: Header from Status to Prediction */}
                        <th>Prediction</th> 
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {requests && requests.length > 0 ? (
                        requests.map(request => (
                            <tr key={request.id}>
                                <td>{request.title}</td> 
                                <td>
                                    {/* CRITICAL FIX: Display status based on ML prediction */}
                                    <span className={`priority-tag ${getPriorityClass(request.status)}`}>
                                        {getPriorityStatus(request.status)}
                                    </span>
                                </td>
                                <td>{new Date(request.date || parseInt(request.id)).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{textAlign: 'center', padding: '20px'}}>
                                No requests found. Create a new one above!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RequestTable;
