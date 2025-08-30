import fs from 'fs';
import csv from 'csv-parser';

async function checkUsersCSV() {
    const users = [];
    const emails = new Set();
    const duplicateEmails = [];
    
    await new Promise((resolve, reject) => {
        fs.createReadStream('server/data/01_users.csv')
            .pipe(csv({ separator: ";" }))
            .on("data", (row) => {
                if (emails.has(row.mail)) {
                    duplicateEmails.push(row.mail);
                }
                emails.add(row.mail);
                users.push(row);
            })
            .on('end', resolve)
            .on('error', reject);
    });
    
    console.log('📊 Total de líneas en CSV:', users.length);
    console.log('📧 Emails únicos:', emails.size);
    
    if (duplicateEmails.length > 0) {
        console.log('❌ Emails duplicados encontrados:', duplicateEmails);
    }
    
    // Verificar usuarios específicos que faltan
    const missingIds = [91, 92, 93, 94];
    console.log('\n🔍 Verificando usuarios específicos:');
    missingIds.forEach(id => {
        const user = users.find(u => parseInt(u.id_user) === id);
        if (user) {
            console.log(`✅ Usuario ${id}: ${user.name} ${user.last_name} - ${user.mail}`);
        } else {
            console.log(`❌ Usuario ${id}: NO ENCONTRADO`);
        }
    });
}

checkUsersCSV();