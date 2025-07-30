// Google Apps Script for Contact Form to Google Sheets
// Instructions: Copy this code into Google Apps Script and deploy as a web app

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get or create the spreadsheet
    const spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your spreadsheet ID
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Get or create the sheet
    let sheet = spreadsheet.getSheetByName('Contact Form Submissions');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Contact Form Submissions');
      // Add headers
      sheet.getRange(1, 1, 1, 9).setValues([[
        'Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 
        'Child Age', 'Service Interest', 'Message', 'Consent'
      ]]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
    }
    
    // Prepare the row data
    const timestamp = new Date(data.timestamp).toLocaleString();
    const rowData = [
      timestamp,
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.childAge || '',
      data.serviceInterest || '',
      data.message || '',
      data.consent ? 'Yes' : 'No'
    ];
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, 9);
    
    // Optional: Send email notification
    sendEmailNotification(data);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Email notification function
function sendEmailNotification(data) {
  try {
    const emailAddress = 'your-email@example.com'; // Replace with your email
    const subject = 'New Contact Form Submission - Learn by Design';
    
    const emailBody = `
New contact form submission received:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Child's Age: ${data.childAge || 'Not specified'}
Service Interest: ${data.serviceInterest || 'Not specified'}
Consent Given: ${data.consent ? 'Yes' : 'No'}

Message:
${data.message}

Submitted at: ${new Date(data.timestamp).toLocaleString()}
    `;
    
    GmailApp.sendEmail(emailAddress, subject, emailBody);
  } catch (error) {
    console.error('Error sending email notification:', error);
    // Don't throw error here - we still want the form submission to succeed
  }
}

// Test function (optional)
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe', 
        email: 'john@example.com',
        phone: '555-123-4567',
        childAge: '4-5',
        serviceInterest: 'early-development',
        message: 'This is a test message',
        consent: true,
        timestamp: new Date().toISOString()
      })
    }
  };
  
  console.log(doPost(testData));
}