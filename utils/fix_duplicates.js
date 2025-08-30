import fs from 'fs';
import csv from 'csv-parser';

async function fixDuplicates() {
    const users = [];
    const seenEmails = new Set();
    const validUsers = [];
    
    // Read all users
    await new Promise((resolve, reject) => {
        fs.createReadStream('server/data/01_users.csv')
            .pipe(csv({ separator: ";" }))
            .on("data", (row) => {
                users.push(row);
            })
            .on('end', resolve)
            .on('error', reject);
    });
    
    console.log('📊 Total usuarios en CSV original:', users.length);
    
    // Filter duplicates by email, keeping only the first one
    users.forEach(user => {
        if (!seenEmails.has(user.mail)) {
            seenEmails.add(user.mail);
            validUsers.push(user);
        } else {
            console.log(`❌ Eliminando duplicado: ${user.id_user} - ${user.name} ${user.last_name} - ${user.mail}`);
        }
    });
    
    console.log('✅ Usuarios únicos después de filtrar:', validUsers.length);
    
    // Create new CSV without duplicates
    const header = 'id_user;name;last_name;mail;password;rol;state\n';
    const csvContent = header + validUsers.map(user => 
        `${user.id_user};${user.name};${user.last_name};${user.mail};${user.password};${user.rol};${user.state}`
    ).join('\n');
    
    // Save the corrected file
    fs.writeFileSync('server/data/01_users.csv', csvContent);
    console.log('💾 Archivo CSV actualizado sin duplicados');
    
    // Now update students _curses to remove references to deleted users
    const validUserIds = new Set(validUsers.map(u => parseInt(u.id_user)));
    const studentsData = [];
    
    await new Promise((resolve, reject) => {
        fs.createReadStream('server/data/06_students_curses.csv')
            .pipe(csv({ separator: ";" }))
            .on("data", (row) => {
                studentsData.push(row);
            })
            .on('end', resolve)
            .on('error', reject);
    });
    
    const validStudentsCurses = studentsData.filter(row => {
        const userId = parseInt(row.id_user);
        if (!validUserIds.has(userId)) {
            console.log(`❌ Eliminando referencia a usuario inexistente: ${userId}`);
            return false;
        }
        return true;
    });
    
    console.log('📚 Students_curses original:', studentsData.length);
    console.log('✅ Students_curses válidos:', validStudentsCurses.length);
    
    // Save students _curses fixed
    const studentsHeader = 'id_student_curse;id_user;id_curse\n';
    const studentsContent = studentsHeader + validStudentsCurses.map(row => 
        `${row.id_student_curse};${row.id_user};${row.id_curse}`
    ).join('\n');
    
    fs.writeFileSync('server/data/06_students_curses.csv', studentsContent);
    console.log('💾 Archivo students_curses actualizado');
}

fixDuplicates();