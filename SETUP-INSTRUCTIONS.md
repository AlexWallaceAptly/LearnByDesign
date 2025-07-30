# Contact Form to Google Spreadsheet Setup Instructions

## Overview
Your custom contact form will now submit data directly to a Google Spreadsheet using Google Apps Script. This eliminates CORS issues while maintaining your professional styling.

## Step-by-Step Setup

### 1. Create a Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Create" → "Blank spreadsheet"
3. Name it something like "Learn by Design - Contact Form Submissions"
4. Copy the spreadsheet ID from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`
   - Save the `SPREADSHEET_ID_HERE` part for later

### 2. Set Up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code in `Code.gs`
4. Copy and paste ALL the code from `google-apps-script.js` (in your project folder)
5. **Important Updates Required:**
   - Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID
   - Replace `your-email@example.com` with your actual email address

### 3. Deploy the Script
1. In Google Apps Script, click "Deploy" → "New deployment"
2. Click the gear icon ⚙️ next to "Type" and select "Web app"
3. Fill in the settings:
   - **Description:** "Contact Form Handler"
   - **Execute as:** "Me"
   - **Who has access:** "Anyone"
4. Click "Deploy"
5. **Copy the Web App URL** - it will look like:
   `https://script.google.com/macros/s/LONG_ID_HERE/exec`

### 4. Update Your Website Code
1. Open `script.js` in your project
2. Find this line:
   ```javascript
   const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the Web App URL from step 3

### 5. Test Your Form
1. Make sure your local server is still running (`http://localhost:8000`)
2. Go to the contact page: `http://localhost:8000/contact.html`
3. Fill out and submit the test form
4. Check your Google Spreadsheet - you should see a new row with the submission data
5. Check your email for the notification (if you set it up)

## What Happens When Someone Submits the Form

1. **Form Data Collected:** All form fields plus timestamp
2. **Sent to Google Apps Script:** Via secure HTTPS POST request
3. **Saved to Spreadsheet:** New row added with formatted data
4. **Email Notification:** Optional email sent to you
5. **User Confirmation:** Success message shown to user

## Spreadsheet Columns
Your spreadsheet will automatically have these columns:
- Timestamp
- First Name
- Last Name  
- Email
- Phone
- Child Age
- Service Interest
- Message
- Consent

## Troubleshooting

### Form Not Submitting
- Check browser console for errors
- Verify the Google Apps Script URL is correct
- Make sure the script is deployed with "Anyone" access

### No Data in Spreadsheet
- Check if spreadsheet ID is correct in the Apps Script
- Verify permissions on the spreadsheet
- Run the test function in Apps Script to debug

### No Email Notifications
- Check if email address is correct in the script
- Verify Gmail permissions for the script
- Check spam folder

## Security Notes
- The script only accepts POST requests
- All data is validated before saving
- HTTPS encryption protects data in transit
- Only you have access to the spreadsheet data

## File Cleanup
Once everything is working, you can delete these temporary files:
- `google-apps-script.js`
- `SETUP-INSTRUCTIONS.md`

## Support
If you run into issues:
1. Check the Google Apps Script execution logs
2. Test the form with browser developer tools open
3. Verify all IDs and URLs are correctly copied

Good luck! Your professional contact form will now save directly to your spreadsheet without any CORS issues.