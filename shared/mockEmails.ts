// Mock email data for initial loading and testing
// Sanitized to use only ASCII-safe characters for OpenAI API compatibility
export const mockEmails = [
  {
    sender: "Sarah Johnson",
    senderEmail: "sarah.johnson@techcorp.com",
    subject: "Q4 Planning Meeting - Tuesday 2PM",
    body: "Hi team,\n\nI would like to schedule our Q4 planning meeting for next Tuesday at 2PM in Conference Room A. We will be discussing our strategic initiatives, budget allocations, and team objectives for the upcoming quarter.\n\nPlease review the attached documents before the meeting and come prepared with your team's proposals. We will have about 2 hours to cover everything.\n\nLooking forward to seeing everyone there!\n\nBest regards,\nSarah"
  },
  {
    sender: "Billing Department",
    senderEmail: "billing@cloudservices.io",
    subject: "Invoice #INV-2024-1247 - Cloud Services February",
    body: "Dear Customer,\n\nYour invoice for February cloud services is now available.\n\nInvoice Number: INV-2024-1247\nAmount Due: $2,847.50\nDue Date: March 15, 2024\n\nServices included:\n- Cloud Storage: 5TB - $450.00\n- Compute Instances: 12 units - $1,890.00\n- Database Services: Premium tier - $507.50\n\nPlease remit payment by the due date to avoid service interruption. You can pay online through our customer portal.\n\nThank you for your business!"
  },
  {
    sender: "Marcus Chen",
    senderEmail: "marcus.chen@startup.co",
    subject: "Urgent: Login Issues with Mobile App",
    body: "Hello Support Team,\n\nI am experiencing critical issues with the mobile app. When I try to log in, I get an error message saying 'Authentication failed' even though I am using the correct credentials. I have tried resetting my password twice but the problem persists.\n\nThis is blocking my entire team from accessing the platform. We have a client demo in 3 hours and really need this resolved ASAP.\n\nCan someone please look into this urgently?\n\nThanks,\nMarcus"
  },
  {
    sender: "TechNews Weekly",
    senderEmail: "newsletter@technews.com",
    subject: "This Week in Tech: AI Breakthroughs and Startup Funding",
    body: "Your Weekly Tech Digest\n\nTop Stories:\n\n1. Major AI company announces breakthrough in multimodal learning\n2. Series B funding round raises $45M for climate tech startup\n3. New privacy regulations coming to EU markets in 2024\n4. Developer tools market sees record growth\n5. Open source project gains enterprise adoption\n\nIn-depth analysis, interviews with founders, and expert commentary inside.\n\nRead the full newsletter at technews.com\n\nStay informed!"
  },
  {
    sender: "Jennifer Park",
    senderEmail: "j.park@designstudio.com",
    subject: "Brand Refresh Project - Initial Mockups Ready",
    body: "Hi everyone,\n\nExciting news! Our design team has completed the initial mockups for your brand refresh project. We have explored three different directions:\n\n1. Modern Minimalist - Clean lines, lots of white space\n2. Bold and Vibrant - Energetic colors, dynamic typography\n3. Classic Professional - Timeless elegance with modern touches\n\nI have uploaded all the files to our shared workspace. Please review them and let me know which direction resonates most with your vision. We can schedule a call this week to discuss your feedback.\n\nLooking forward to your thoughts!\n\nJennifer"
  },
  {
    sender: "HR Department",
    senderEmail: "hr@company.com",
    subject: "Important: Annual Benefits Enrollment Opens Monday",
    body: "Dear Team Members,\n\nThis is a reminder that our annual benefits enrollment period opens this Monday, March 1st and closes on March 15th.\n\nDuring this time, you can:\n- Review and update your health insurance plan\n- Adjust your 401(k) contributions\n- Enroll in dental and vision coverage\n- Update beneficiary information\n- Review life insurance options\n\nPlease log into the HR portal to complete your enrollment. If you take no action, your current benefits will remain unchanged.\n\nWe will be hosting information sessions on March 3rd and March 8th. Check the calendar for times.\n\nBest regards,\nHR Team"
  },
  {
    sender: "Alex Rivera",
    senderEmail: "alex.r@freelance.net",
    subject: "Project Deliverables and Final Invoice",
    body: "Hey there,\n\nI have completed all the work on the website redesign project. You can view the final deliverables in the shared Dropbox folder:\n\n- Desktop designs (all pages)\n- Mobile responsive layouts\n- Component library\n- Style guide\n- Interactive prototype\n\nI am also attaching the final invoice for the remaining balance of $4,200. Payment terms are net 15 as agreed.\n\nIt has been great working with you on this project. Let me know if you need any adjustments or have questions!\n\nBest,\nAlex"
  },
  {
    sender: "Customer Success",
    senderEmail: "success@saasplatform.io",
    subject: "How can we help you get more value?",
    body: "Hi there,\n\nWe noticed you have been using our platform for 3 months now - welcome to the community!\n\nI wanted to reach out personally to see how things are going and whether you are getting the most out of your subscription. Our team is here to help you:\n\n- Set up advanced features\n- Optimize your workflow\n- Integrate with other tools\n- Answer any questions\n\nWould you be interested in a quick 20-minute call to discuss your goals? I can share some best practices that other customers in your industry have found valuable.\n\nLet me know what works for your schedule!\n\nCheers,\nThe Customer Success Team"
  },
  {
    sender: "DevOps Team",
    senderEmail: "devops@engineering.com",
    subject: "Scheduled Maintenance: Database Upgrade This Saturday",
    body: "Team Notification:\n\nWe will be performing critical database maintenance this Saturday, March 12th from 2:00 AM to 6:00 AM EST.\n\nWhat is happening:\n- PostgreSQL upgrade to version 15\n- Index optimization\n- Backup verification\n- Performance tuning\n\nExpected impact:\n- Platform will be in read-only mode\n- API writes will be queued\n- Background jobs will pause\n\nWe have tested this extensively in staging and do not anticipate any issues. However, please be aware that the platform may be slower than usual during this window.\n\nIf you have any concerns, please reach out before Friday.\n\nThanks,\nDevOps Team"
  },
  {
    sender: "LinkedIn",
    senderEmail: "notifications@linkedin.com",
    subject: "Your weekly job matches are here",
    body: "Based on your profile and preferences, we found these opportunities:\n\nSenior Product Manager at TechCorp\nLocation: San Francisco, CA (Hybrid)\nSalary: $150K - $200K\n\nProduct Lead at Startup Inc\nLocation: New York, NY (Remote)\nSalary: $140K - $180K + equity\n\nVP of Product at Enterprise Co\nLocation: Austin, TX (On-site)\nSalary: $180K - $230K\n\nThese roles match your experience in product management, SaaS, and team leadership.\n\nView all 47 matching jobs on LinkedIn"
  }
];
