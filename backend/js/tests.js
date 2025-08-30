// INTEGRATED QUICK TESTS FOR THE APPLICATION
// Runs basic functionality tests to verify system integrity
function runQuickTests() {
    console.log('🧪 Running LearnEx tests...');
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: Verify initial data loading
    try {
        if (AppState.data.students.length === 6) {
            console.log('✅ Test 1: Student data loaded correctly');
            passed++;
        } else {
            throw new Error('Incorrect data');
        }
    } catch (e) {
        console.log('❌ Test 1: Error in student data');
        failed++;
    }
    
    // Test 2: Verify role determination function
    try {
        if (determineRole('admin123') === 'admin' && determineRole('teacher_test') === 'teacher') {
            console.log('✅ Test 2: determineRole function works correctly');
            passed++;
        } else {
            throw new Error('Role function incorrect');
        }
    } catch (e) {
        console.log('❌ Test 2: Error in role function');
        failed++;
    }
    
    // Test 3: Verify menu configuration
    try {
        if (MenuConfig.student && MenuConfig.admin && MenuConfig.teacher) {
            console.log('✅ Test 3: Menu configuration available');
            passed++;
        } else {
            throw new Error('Menu configuration missing');
        }
    } catch (e) {
        console.log('❌ Test 3: Error in menu configuration');
        failed++;
    }
    
    // Test 4: Verify view generation
    try {
        const dashboard = generateDashboard();
        if (dashboard && dashboard.includes('Bienvenido')) {
            console.log('✅ Test 4: Dashboard generation works');
            passed++;
        } else {
            throw new Error('Error in dashboard generation');
        }
    } catch (e) {
        console.log('❌ Test 4: Error in view generation');
        failed++;
    }
    
    // Test 5: Verify basic functions
    try {
        const studentData = getRoleSpecificData('student');
        if (studentData && studentData.myAverage === 4.2) {
            console.log('✅ Test 5: Basic functions operational');
            passed++;
        } else {
            throw new Error('Error in basic functions');
        }
    } catch (e) {
        console.log('❌ Test 5: Error in basic functions');
        failed++;
    }
    
    console.log(`\n📊 Results: ${passed}/${passed + failed} tests passed`);
    
    // Show alert with results
    alert(`Tests completed!\n✅ ${passed} passed\n❌ ${failed} failed\n\nCheck console for more details (F12)`);
}