// File name: htmllog.js
// Date: 03/19/2017
// Programmer: Jim Medlock
//
// Class supporting creation of an HTML-based execution log

const moment = require('moment');

// -------------------------------------------------------------
// HTML Logging Class
// -------------------------------------------------------------
class HtmlLog {
  constructor() {
    this.logEntries = [];
  }
  // Add a new entry to the running log of program events.
  // Prefix each log entry with the current date and time.
  // Returns: N/a
  addEntry(logEntry) {
    this.logEntries.push(`<li>${this.createTimestamp()}: ${logEntry}</li>`);
  }
  // Generate a timestamp for the current point in timestamp
  // Returns: String containing the timestamp
  createTimestamp() {
    return moment().format('MM/DD/YY HH:mm:ss.SSS');
  }
  // Write the log to the response object as an HTML list.
  // Returns: N/a
  writeLog(emitType, response) {
    if (emitType === 'normal') {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      this.addEntry('Database successfully initialized and loaded.');
    } else {
      response.writeHead(400, { 'Content-Type': 'text/html' });
      this.addEntry('Database initialization and loading failed.');
    }
    const html = this.logEntries.join(' ');
    response.write(`<body><div><ul>${html}</ul></div></body>`);
    response.write('End of log');
    response.end();
  }
}

module.exports.HtmlLog = HtmlLog;
