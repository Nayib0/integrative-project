// Test login endpoint directly
async function testLogin() {
    console.log('🧪 Probando endpoint de login...\n');
    
    const testCredentials = [
        { email: 'carlos.gomez@mail.com', password: 'pass123', role: 'admin' },
        { email: 'ana.rodriguez@mail.com', password: 'ana456', role: 'student' },
        { email: 'pedro.sanchez@mail.com', password: 'ped987', role: 'teacher' }
    ];
    
    for (const cred of testCredentials) {
        try {
            const response = await fetch('http://localhost:3000/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: cred.email, password: cred.password })
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log(`✅ ${cred.role.toUpperCase()}: Login exitoso`);
                console.log(`   Usuario: ${result.user.name} ${result.user.lastName}`);
                console.log(`   Email: ${result.user.email}`);
                console.log(`   Rol: ${result.user.role}\n`);
            } else {
                console.log(`❌ ${cred.role.toUpperCase()}: Login falló`);
                console.log(`   Error: ${result.message}\n`);
            }
        } catch (error) {
            console.log(`❌ ${cred.role.toUpperCase()}: Error de conexión`);
            console.log(`   Error: ${error.message}\n`);
        }
    }
}

testLogin();