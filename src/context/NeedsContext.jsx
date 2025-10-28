// src/context/NeedsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
// import mockData from '../mockData.js'; // <-- NO LONGER NEEDED FOR INITIALIZATION

const NeedsContext = createContext();

export const useNeeds = () => useContext(NeedsContext);

const NEEDS_STORAGE_KEY = 'samaajseva_needs';
const COMMITMENTS_STORAGE_KEY = 'samaajseva_commitments';

// Helper function to initialize state: Tries to load from localStorage, otherwise returns an EMPTY ARRAY.
const initializeNeeds = () => {
    try {
        const localData = localStorage.getItem(NEEDS_STORAGE_KEY);
        // CRITICAL FIX: If data exists, use it. Otherwise, return []
        if (localData) {
            return JSON.parse(localData);
        }
    } catch (error) {
        console.error("Error loading needs from local storage:", error);
    }
    // Return an empty array if nothing is saved or if there was an error.
    return []; 
};

// Helper function to load commitments (still needs to be an object)
const initializeCommitments = () => {
    try {
        const localData = localStorage.getItem(COMMITMENTS_STORAGE_KEY);
        if (localData) {
            return JSON.parse(localData);
        }
    } catch (error) {
        console.error("Error loading commitments from local storage:", error);
    }
    return {}; // Must return an empty object, not an array
};


export const NeedsProvider = ({ children }) => {
  // Needs: Persisted list of all requests, initialized to empty if not found
  const [needs, setNeeds] = useState(initializeNeeds);
  
  // Commitments: Persisted map of DonorID -> [NeedIDs]
  const [commitments, setCommitments] = useState(initializeCommitments);

  // Effect to save 'needs' to local storage whenever 'needs' state changes
  useEffect(() => {
    localStorage.setItem(NEEDS_STORAGE_KEY, JSON.stringify(needs));
  }, [needs]);
  
  // Effect to save 'commitments' to local storage whenever 'commitments' state changes
  useEffect(() => {
    localStorage.setItem(COMMITMENTS_STORAGE_KEY, JSON.stringify(commitments));
  }, [commitments]);

  // Function to add a new need (used by NGO Dashboard)
  const addNeed = (newNeedData, ngoId) => {
    const newNeed = {
      id: Date.now().toString(),
      ngoId: ngoId,
      ...newNeedData,
      quantityCommitted: 0,
      status: 'pending',
    };
    
    setNeeds(prevNeeds => [newNeed, ...prevNeeds]); 
    return newNeed;
  };

  // Function to handle a donor committing to a need
  const commitToNeed = (needId, donorId, commitmentAmount = 1) => {
      // 1. Update the 'needs' list (increase committed quantity)
      setNeeds(prevNeeds => 
          prevNeeds.map(need => {
              if (need.id === needId) {
                  const newCommitted = (need.quantityCommitted || 0) + commitmentAmount;
                  return { 
                      ...need, 
                      quantityCommitted: newCommitted,
                      status: newCommitted >= need.quantityNeeded ? 'fulfilled' : 'pending' 
                  };
              }
              return need;
          })
      );
      
      // 2. Update the 'commitments' map (record donor's action)
      setCommitments(prevCommitments => {
          const donorCommitments = prevCommitments[donorId] || [];
          
          if (!donorCommitments.includes(needId)) {
              return {
                  ...prevCommitments,
                  [donorId]: [...donorCommitments, needId]
              };
          }
          return prevCommitments;
      });
  };

  const value = {
    needs,
    commitments, 
    addNeed,
    commitToNeed,
  };

  return <NeedsContext.Provider value={value}>{children}</NeedsContext.Provider>;
};