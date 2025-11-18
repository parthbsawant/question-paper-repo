// require('dotenv').config();
// const express = require('express');
// const sql = require('mssql');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // SQL Database Config
// const dbConfig = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   options: {
//     encrypt: true,
//     trustServerCertificate: false
//   }
// };

// // Test DB connection on startup
// sql.connect(dbConfig)
//   .then(() => console.log("Connected to Azure SQL successfully"))
//   .catch(err => console.error("DB Connection Error:", err));

// // API Health Check
// app.get("/", (req, res) => {
//   res.json({ status: "Backend is running" });
// });

// // Insert log entry into database
// app.post('/api/log-download', async (req, res) => {
//     try {
//         const { paperName, studentPrn } = req.body;

//         if (!paperName || !studentPrn) {
//             return res.status(400).json({ error: "paperName & studentPrn are required" });
//         }

//         await sql.connect(dbConfig);
//         await sql.query`
//             INSERT INTO paperDownloadLogs (studentPrn, paperName, downloadTime)
//             VALUES (${studentPrn}, ${paperName}, GETDATE())
//         `;

//         res.json({ message: "Log inserted successfully" });

//     } catch (err) {
//         console.error("Insert Error:", err);
//         res.status(500).json({ error: "DB insert failed" });
//     }
// });


// // Start Server
// const PORT = 4000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// SQL DB Config
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

// Health Check Route
app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

// Download Log Route
app.post('/api/log-download', async (req, res) => {
  try {
    const { studentPrn, paperName } = req.body;

    if (!studentPrn || !paperName) {
      return res.status(400).json({ error: "Missing data" });
    }

    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("studentPrn", sql.NVarChar, studentPrn)
      .input("paperName", sql.NVarChar, paperName)
      .query(`
        INSERT INTO paperDownloadLogs (studentPrn, paperName)
        VALUES (@studentPrn, @paperName)
      `);

    res.json({ message: "Log inserted successfully" });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: "DB insert failed", details: err.message });
  }
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
