// Rapid tests integrated into the application
function runQuickTests() {
    console.log('🧪 Ejecutando tests de LearnEx...');
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: Verify initial data
    try {
        if (AppState.data.students.length === 6) {
            console.log('✅ Test 1: Datos de estudiantes cargados correctamente');
            passed++;
        } else {
            throw new Error('Datos incorrectos');
        }
    } catch (e) {
        console.log('❌ Test 1: Error en datos de estudiantes');
        failed++;
    }
    
    // Test 2: Verify role function
    try {
        if (determineRole('admin123') === 'admin' && determineRole('teacher_test') === 'teacher') {
            console.log('✅ Test 2: Función determineRole funciona correctamente');
            passed++;
        } else {
            throw new Error('Función de roles incorrecta');
        }
    } catch (e) {
        console.log('❌ Test 2: Error en función de roles');
        failed++;
    }
    
    // Test 3: Verify menu configuration
    try {
        if (MenuConfig.student && MenuConfig.admin && MenuConfig.teacher) {
            console.log('✅ Test 3: Configuración de menús disponible');
            passed++;
        } else {
            throw new Error('Configuración de menús faltante');
        }
    } catch (e) {
        console.log('❌ Test 3: Error en configuración de menús');
        failed++;
    }
    
    // Test 4: Verify view generation
    try {
        const dashboard = generateDashboard();
        if (dashboard && dashboard.includes('Bienvenido')) {
            console.log('✅ Test 4: Generación de dashboard funciona');
            passed++;
        } else {
            throw new Error('Error en generación de dashboard');
        }
    } catch (e) {
        console.log('❌ Test 4: Error en generación de vistas');
        failed++;
    }
    
    // Test 5: Verify basic functions
    try {
        const studentData = getRoleSpecificData('student');
        if (studentData && studentData.myAverage === 4.2) {
            console.log('✅ Test 5: Funciones básicas operativas');
            passed++;
        } else {
            throw new Error('Error en funciones básicas');
        }
    } catch (e) {
        console.log('❌ Test 5: Error en funciones básicas');
        failed++;
    }
    
    console.log(`\n📊 Resultados: ${passed}/${passed + failed} tests pasaron`);
    
    // Show alert with results
    alert(`Tests completados!\n✅ ${passed} pasaron\n❌ ${failed} fallaron\n\nRevisa la consola para más detalles (F12)`);
}