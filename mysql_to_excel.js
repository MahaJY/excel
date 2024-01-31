const fs = require('fs');
const ExcelJS = require('exceljs');
const mysql = require('mysql2/promise'); 
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root555',
  database: 'sakila',
};
const pool = mysql.createPool(dbConfig);
async function exportDataToExcel() {
  try {
    // Acquire a connection from the pool
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.query('SELECT * FROM customer');
    connection.release();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    // Add column headers to the worksheet
    const headers = fields.map(field => field.name);
    worksheet.addRow(headers);
    // Add data rows to the worksheet
    for (const row of rows) {
      worksheet.addRow(Object.values(row));
    }
    const excelFilePath = 'C:/Users/Asus/Desktop/file1.xlsx';
    await workbook.xlsx.writeFile(excelFilePath);
    console.log('Data exported to Excel successfully.');
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
  } finally {
 
    pool.end();
  }
}

// Call the function to export data from MySQL to Excel
exportDataToExcel();