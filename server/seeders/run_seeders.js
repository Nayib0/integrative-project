/*imports to load my database*/

import { loadusers } from "./load_users.js"; //import route
import { loadcurses } from "./load_curses.js"; //import route
import { loadsubjects } from "./load_subjects.js"; //import route
import { loadcst } from "./load_curse_subject_teacher.js"; //import route
import { loadnotes } from "./load_notes.js"; //import route
import { loadstudentscurses } from "./load_students_curses.js"; //import route
// import { loadExtendedData } from "./load_extended_data.js"; // Comentado - no compatible con ES modules

(async () => {
  try {
    console.log("🚀 Starting seeders...");

    await loadusers();
    await loadcurses();
    await loadsubjects();
    await loadcst();
    await loadnotes();
    await loadstudentscurses();
    // await loadExtendedData(); // Comentado temporalmente - requiere archivos CSV extendidos

    console.log("✅ All seeders executed correctly.");
  } catch (error) {
    console.error("❌ Error executing seeders:", error.message);
  } finally {
    process.exit();
  }
})();
