// Test if endpoints are working
async function testEndpoints() {
    const endpoints = [
        '/api/test-db',
        '/api/teacher-students/7',
        '/api/ai-dashboard/7/teacher'
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`\n🧪 Testing: ${endpoint}`);
            const response = await fetch(`http://localhost:3000${endpoint}`);
            console.log(`Status: ${response.status}`);
            
            const text = await response.text();
            console.log(`Response: ${text.substring(0, 100)}...`);
            
            if (response.headers.get('content-type')?.includes('application/json')) {
                console.log('✅ JSON response');
            } else {
                console.log('❌ Not JSON response');
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
    }
}

testEndpoints();