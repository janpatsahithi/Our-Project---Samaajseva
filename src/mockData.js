// src/mockData.js
const mockData = {
  users: [
    { id: '1', name: 'NGO Shanti', location: 'Mumbai', contact: 'shanti@ngo.org', role: 'NGO' },
    { id: '2', name: 'Donor Priya', location: 'Pune', role: 'Donor' },
  ],
  needs: [
    {
      id: 'n1',
      ngoId: '1',
      title: 'Emergency Food Drive for 50 Families',
      category: 'Food',
      description: 'Need dry rations (rice, lentils, oil) for families displaced by recent floods.',
      location: 'Mumbai',
      quantityNeeded: 50,
      quantityCommitted: 20,
      status: 'pending',
    },
    {
      id: 'n2',
      ngoId: '1',
      title: 'Volunteer Tutors for Primary School',
      category: 'Volunteering',
      description: 'Require 10 volunteers to teach math and science, 2 hours/week.',
      location: 'Pune',
      quantityNeeded: 10,
      quantityCommitted: 3,
      status: 'pending',
    },
    {
      id: 'n3',
      ngoId: '1',
      title: 'Blankets for Winter Shelter',
      category: 'Clothes',
      description: 'Need 100 blankets for the upcoming winter season in Delhi.',
      location: 'Delhi',
      quantityNeeded: 100,
      quantityCommitted: 100,
      status: 'fulfilled', 
    },
  ],
};

export default mockData;