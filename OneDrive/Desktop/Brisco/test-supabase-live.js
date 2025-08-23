// Test Supabase connection and lead insertion on live environment
import fetch from 'node-fetch';

async function testLiveAPI() {
  console.log('🔍 Testing LIVE API with detailed logging...\n');
  
  const testEmail = `test-${Date.now()}@example.com`;
  
  try {
    console.log(`📧 Testing with email: ${testEmail}`);
    
    const response = await fetch('https://www.brisclothing.com/api/send-access-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail })
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📊 Raw Response:', responseText);
    
    if (responseText) {
      try {
        const responseJson = JSON.parse(responseText);
        console.log('📊 Parsed Response:', JSON.stringify(responseJson, null, 2));
        
        // Check if lead was captured
        if (responseJson.leadCaptured !== undefined) {
          console.log(`\n🎯 Lead Capture Status: ${responseJson.leadCaptured ? '✅ SUCCESS' : '❌ FAILED'}`);
          if (responseJson.leadError) {
            console.log(`🚨 Lead Error: ${responseJson.leadError}`);
          }
        }
        
      } catch (e) {
        console.log('📊 Response is not valid JSON');
      }
    }

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
}

// Run the test
testLiveAPI();
