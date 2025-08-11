const axios = require('axios');

async function testServer() {
  try {
    console.log('🧪 Testing server...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:3001/api/ping');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test demo endpoint
    const demoResponse = await axios.get('http://localhost:3001/api/demo');
    console.log('✅ Demo endpoint:', demoResponse.data);
    
    // Test root endpoint
    const rootResponse = await axios.get('http://localhost:3001/api');
    console.log('✅ Root endpoint:', rootResponse.data);
    
    console.log('🎉 All tests passed! Server is working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testServer();
