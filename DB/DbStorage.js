import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("mydatabase.db");

// Function to create Courses table if not exists
const createCoursesTable = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          description TEXT,
          colour TEXT,
          state TEXT,
          category TEXT DEFAULT 'Development'
        )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to insert a course
const insertCourse = async (name, description, colour, state, category = 'Development') => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO courses (name, description, colour, state, category) VALUES (?, ?, ?, ?, ?)`,
        [name, description, colour, state, category],
        (_, result) => {
          resolve(result.insertId);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const getAllCourses = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM courses`,
        [],
        (_, result) => {
          const courses = [];
          for (let i = 0; i < result.rows.length; i++) {
            const course = result.rows.item(i);
            courses.push(course);
          }
          resolve(courses);
        },
        (_, error) => {
          reject("getdata", error);
        }
      );
    });
  });
};

// Function to update a course
const updateCourse = async (id, name, description, colour, state) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE courses SET name=?, description=?, colour=?, state=? WHERE id=?`,
        [name, description, colour, state, id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to delete a course
const deleteCourse = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM courses WHERE id=?`,
        [id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to create Lessons table if not exists
const createLessonsTable = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS lessons (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          course INTEGER,
          name TEXT,
          description TEXT,
          colour TEXT,
          state TEXT,
          FOREIGN KEY(course) REFERENCES courses(id)
        )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to insert a lesson
const insertLesson = async (courseId, name, description, colour, state) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO lessons (course, name, description, colour, state) VALUES (?, ?, ?, ?, ?)`,
        [courseId, name, description, colour, state],
        (_, result) => {
          resolve(result.insertId);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to retrieve all lessons for a given course
const getAllLessonsForCourse = async (courseId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM lessons WHERE course=?`,
        [courseId],
        (_, result) => {
          const lessons = [];
          for (let i = 0; i < result.rows.length; ++i) {
            lessons.push(result.rows.item(i));
          }
          resolve(lessons);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to update a lesson
const updateLesson = async (id, name, description, colour, state) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE lessons SET name=?, description=?, colour=?, state=? WHERE id=?`,
        [name, description, colour, state, id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to delete a lesson
const deleteLesson = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM lessons WHERE id=?`,
        [id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to create Units table if not exists
const createUnitsTable = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS units (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          lesson INTEGER,
          name TEXT,
          description TEXT,
          colour TEXT,
          state TEXT,
          FOREIGN KEY(lesson) REFERENCES lessons(id)
        )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to insert a unit
const insertUnit = async (lessonId, name, description, colour, state) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO units (lesson, name, description, colour, state) VALUES (?, ?, ?, ?, ?)`,
        [lessonId, name, description, colour, state],
        (_, result) => {
          if (result.insertId) {
            resolve(true); // Unit added successfully
          } else {
            resolve(false); // Unit not added
          }
        },
        (_, error) => {
          console.error("Error inserting unit:", error);
          reject(error);
        }
      );
    });
  });
};

// Function to retrieve all units for a given lesson
const getAllUnitsForLesson = async (lessonId) => {
  return new Promise((resolve, reject) => {
    console.log("Fetching units for lessonId:", lessonId);
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM units WHERE lesson=?`,
        [lessonId],
        (_, result) => {
          console.log("SQL query executed successfully:", result);
          const units = [];
          for (let i = 0; i < result.rows.length; ++i) {
            units.push(result.rows.item(i));
          }
          console.log("Units retrieved:", units);
          resolve(units);
        },
        (_, error) => {
          console.log("Error executing SQL query:", error);
          reject(error);
        }
      );
    });
  });
};

// Function to update a unit
const updateUnit = async (id, name, description, colour, state) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE units SET name=?, description=?, colour=?, state=? WHERE id=?`,
        [name, description, colour, state, id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to delete a unit
const deleteUnit = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM units WHERE id=?`,
        [id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};
// Function to create Extras table if not exists
const createExtrasTable = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS UnitAttachments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          unit INTEGER,
          name TEXT,
          blob TEXT,
          type TEXT,
          state TEXT,
          FOREIGN KEY(unit) REFERENCES units(id)
        )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to insert an extra
const insertExtra = async (unitid, name, blob, type, state) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO UnitAttachments (unit,name, blob, type, state) VALUES (?,?, ?, ?, ?)`,
        [unitid, name, blob, type, state],
        (_, result) => {
          resolve(result.insertId);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to retrieve all extras
const getAllExtras = async (unitid) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM UnitAttachments where unit=?`,
        [unitid],
        (_, result) => {
          const extras = [];
          for (let i = 0; i < result.rows.length; ++i) {
            extras.push(result.rows.item(i));
          }
          resolve(extras);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};



const getAllunitsView = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM UnitAttachments`,
        [],
        (_, result) => {
          const extras = [];
          for (let i = 0; i < result.rows.length; ++i) {
            extras.push(result.rows.item(i));
          }
          resolve(extras);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};


const getunitmax = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT Max(id) as MaxOfunits FROM units`,
        [],
        (_, result) => {
          const extras = [];
          for (let i = 0; i < result.rows.length; ++i) {
            extras.push(result.rows.item(i));
          }
          resolve(extras);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};


















// Function to update an extra
const updateExtra = async (id, name, blob, type, state) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE extras SET name=?, blob=?, type=?, state=? WHERE id=?`,
        [name, blob, type, state, id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Function to delete an extra
const deleteExtra = async (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM extras WHERE id=?`,
        [id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export {
  createCoursesTable,
  insertCourse,
  getAllCourses,
  createLessonsTable,
  insertLesson,
  getAllLessonsForCourse,
  createUnitsTable,
  insertUnit,
  getAllUnitsForLesson,
  insertExtra,
  getAllExtras,
  createExtrasTable,
  getAllunitsView,
  getunitmax,
  deleteLesson,
  updateLesson,
  deleteCourse,
  updateCourse,
  deleteUnit,
  updateUnit,
};
