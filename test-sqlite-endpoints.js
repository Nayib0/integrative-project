// Test SQLite endpoints
async function testSQLiteEndpoints() {
    const endpoints = [
        '/api/test-db',
        '/api/teacher-students/7',
        '/api/ai-dashboard/7/teacher',
        '/api/student-details/2'
    ];
    
    console.log('🧪 Testing SQLite server endpoints...\n');
    
    for (const endpoint of endpoints) {
        try {
            console.log(`Testing: ${endpoint}`);
            const response = await fetch(`http://localhost:3000${endpoint}`);
            console.log(`Status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Success:`, data.success ? 'OK' : 'Failed');
                if (endpoint.includes('teacher-students') && data.students) {
                    console.log(`   Students found: ${data.students.length}`);
                }
            } else {
                console.log(`❌ Failed: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        console.log('');
    }
}

testSQLiteEndpoints();