// src/pages/DonorDashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx'; 
import { useNeeds } from '../context/NeedsContext.jsx'; 

const DonorDashboard = () => {
  const { user: currentUser } = useAuth(); // Get the logged-in Donor's info
  const { needs, commitments, commitToNeed } = useNeeds(); // Get needs, commitments, and the commit function

  // Get the current user's committed needs (array of IDs)
  const donorCommittedIds = commitments[currentUser?.id] || [];

  // 1) Compute mock priority and filter open requests
  const allNeedsWithPriority = needs.map(n => ({
    ...n,
    priority: n.quantityCommitted < 10 ? 'HIGH' : (n.quantityCommitted < 50 ? 'MEDIUM' : 'LOW')
  }));
  const openRequests = allNeedsWithPriority.filter(n => n.status !== 'fulfilled');

  // 2) Domain filter state (category)
  const [selectedDomain, setSelectedDomain] = React.useState('All');
  const domains = React.useMemo(() => {
    const set = new Set(['All']);
    openRequests.forEach(n => { if (n.category) set.add(n.category); });
    return Array.from(set);
  }, [openRequests]);
  const filteredByDomain = React.useMemo(() => (
    selectedDomain === 'All' ? openRequests : openRequests.filter(n => n.category === selectedDomain)
  ), [openRequests, selectedDomain]);

  // 3) Sort state
  const [sortBy, setSortBy] = React.useState('priority'); // 'priority' | 'date' | 'title'
  const sortedRequests = React.useMemo(() => {
    const arr = [...filteredByDomain];
    if (sortBy === 'priority') {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      arr.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
    } else if (sortBy === 'date') {
      // Use id as a timestamp surrogate in mock data; newest first
      arr.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (sortBy === 'title') {
      arr.sort((a, b) => String(a.title).localeCompare(String(b.title)));
    }
    return arr;
  }, [filteredByDomain, sortBy]);

  // Prepare table data structure
  const tableData = sortedRequests.map(n => ({
      id: n.id,
      description: n.title,
      status: n.priority,
      date: new Date(parseInt(n.id)).toLocaleDateString('en-US'),
      isCommitted: donorCommittedIds.includes(n.id), // Check if current donor has applied
  }));
  
  const highPriorityCount = openRequests.filter(n => n.priority === 'HIGH').length;
  
  // Handler for the Apply button
  const handleApply = (needId) => {
      if (currentUser?.role !== 'Donor') {
          alert("Please log in as a Donor to commit to a request.");
          return;
      }
      
      // Call the context function to record the commitment and update the need
      commitToNeed(needId, currentUser.id, 1);
  };


  return (
    <div className="container">
      <div className="dashboard-header-row" style={{marginBottom: '15px'}}>
        <div className="dashboard-header">
            <h1 className="dashboard-title">Donor Dashboard</h1>
            <p className="dashboard-subtitle">Discover NGO requests sorted by priority and location</p>
        </div>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card">
            <h3>{openRequests.length}</h3>
            <small className="stat-title">Available Requests</small>
        </div>
        <div className="stat-card">
            <h3>{donorCommittedIds.length}</h3>
            <small className="stat-title">Donations Made</small>
        </div>
        <div className="stat-card">
            <h3>{highPriorityCount}</h3>
            <small className="stat-title">High Priority</small>
        </div>
      </div>
      
      <div className="requests-section">
        <h2 className="section-title">NGO Requests</h2>
        <div className="requests-controls" style={{display:'flex', gap: '12px', alignItems:'center', marginTop: '10px', marginBottom: '15px'}}>
          <div>
            <small style={{color: '#555'}}>Domain:</small>
            <select className="secondary-button" style={{padding: '8px 12px', marginLeft: '8px'}} value={selectedDomain} onChange={(e)=>setSelectedDomain(e.target.value)}>
              {domains.map(d => (<option key={d} value={d}>{d}</option>))}
            </select>
          </div>
          <div>
            <small style={{color: '#555'}}>Sort by:</small>
            <select className="secondary-button" style={{padding: '8px 12px', marginLeft: '8px'}} value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
              <option value="priority">Priority</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="request-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>
                      <span className={`priority-tag ${item.status.toLowerCase()}`}>
                          {item.status} PRIORITY
                      </span>
                  </td>
                  <td>{item.date}</td>
                  <td>
                      <button 
                          className="primary-button small"
                          onClick={() => handleApply(item.id)}
                          disabled={item.isCommitted} // Disable if already committed
                          style={{padding: '8px 15px'}}
                      >
                          {item.isCommitted ? 'Applied' : 'Apply'}
                      </button>
                  </td>
                </tr>
              ))}
              {tableData.length === 0 && (
                  <tr><td colSpan="4" style={{textAlign: 'center'}}>No open requests currently available.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default DonorDashboard;