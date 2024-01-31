const fs = require('fs');
const ExcelJS = require('exceljs');
const mysql = require('mysql');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root555',
  database: 'world',
};
const pool = mysql.createPool(dbConfig);
async function importExcelDataToMySQL(filePath) {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);
    // Loop through each row in the sheet
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      const rowData = row.values;
      const query = 'INSERT INTO empdetails (EEID, Full_name, Job_Title,Department) VALUES (?, ?, ?, ?)';
      // Acquire a connection from the pool
      pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(query, rowData.slice(1), (queryError, results) => {
          connection.release();
        if (queryError) {
            console.error('MySQL query error:', queryError);
          } else {
            console.log(`Row ${rowNumber} inserted into MySQL`);
          }
        });
      });
    });
  } catch (error) {
    console.error('Error reading Excel file:', error);
  }
}

// Specify the path to your Excel file
const excelFilePath = 'C:\\Users\\Asus\\Downloads\\emp1.xlsx';

// Call the function to import data from Excel to MySQL
importExcelDataToMySQL(excelFilePath);