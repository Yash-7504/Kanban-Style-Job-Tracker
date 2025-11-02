const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('Health check:', health.data);
    
    // Test get all jobs (should be empty initially)
    console.log('\n2. Testing get all jobs...');
    const jobs = await axios.get(`${API_URL}/jobs`);
    console.log('Get jobs:', jobs.data);
    
    // Test create job
    console.log('\n3. Testing create job...');
    const newJob = await axios.post(`${API_URL}/jobs`, {
      company: 'Test Company',
      role: 'Software Engineer',
      status: 'Applied',
      dateApplied: '2024-01-15'
    });
    console.log('Created job:', newJob.data);
    
    // Test get jobs again (should have one job)
    console.log('\n4. Testing get jobs after creation...');
    const jobsAfter = await axios.get(`${API_URL}/jobs`);
    console.log('Jobs after creation:', jobsAfter.data);
    
    console.log('\nAll API tests passed!');
    
  } catch (error) {
    console.error('API test failed:', error.response?.data || error.message);
  }
}

testAPI();