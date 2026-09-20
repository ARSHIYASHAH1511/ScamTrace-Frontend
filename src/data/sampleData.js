// A sample scam message and a sample backend response.
// It shows the exact shape the real backend should return, and lets you
// preview the results dashboard before the backend is finished.

const BANK_MESSAGE =
  "URGENT: Your bank account will be blocked today due to incomplete KYC. " +
  "Update your details now at http://bank-kyc-verify.top/login to avoid suspension. " +
  "Reply with the OTP you receive to confirm. Do not ignore this message.";

const PARCEL_MESSAGE =
  "Your parcel could not be delivered because the address is incomplete. " +
  "Pay a small redelivery fee at http://parcel-redeliver.top/pay within 24 hours or it will be returned to the sender.";

const JOB_MESSAGE =
  "Hi! We found your resume online. Earn 5,000 per day working from home, just 1 hour a day. " +
  "No experience needed. Pay a refundable registration fee to get started. Message us on WhatsApp now.";

const PRIZE_MESSAGE =
  "Congratulations! You have been selected as the lucky winner of a brand new phone. " +
  "Claim your prize within 2 hours by paying the delivery charge at http://claim-prize-now.site. Do not tell anyone.";

const ACCOUNT_MESSAGE =
  "Security alert: Unusual sign-in detected. Your account will be locked today. " +
  "Verify immediately at http://account-secure-reset.top/login and enter the OTP we just sent. Do not ignore this message.";

const SOCIAL_MESSAGE =
  "Your profile was reported for unusual activity and will be disabled in 2 hours. " +
  "Confirm your identity now at http://profile-verify-help.top and share the code from your messages to keep your account.";

// Example messages. They fill the message box when the user clicks an example.
// All examples are synthetic. They are not sent until the user clicks Analyze.
export const SAMPLE_MESSAGES = [
  { id: "bank", label: "Bank KYC", text: BANK_MESSAGE },
  { id: "parcel", label: "Parcel fee", text: PARCEL_MESSAGE },
  { id: "job", label: "Fake job", text: JOB_MESSAGE },
  { id: "prize", label: "Prize win", text: PRIZE_MESSAGE },
  {
    id: "payment",
    label: "Wrong payment",
    text:
      "Hi, I sent you money by mistake. Please approve the request I just sent to get it back. " +
      "Enter your PIN to receive the refund. Please hurry, it is urgent.",
  },
  {
    id: "invest",
    label: "Investment",
    text:
      "Join our private crypto group. Members are doubling their money in 7 days with guaranteed returns. " +
      "Only 5 spots left. Send your first deposit today to lock in your place.",
  },
  { id: "account", label: "Account lock", text: ACCOUNT_MESSAGE },
  { id: "social", label: "Profile warning", text: SOCIAL_MESSAGE },
];

// Hero "Try an example" chips. Populate the textarea only — do not auto-submit.
export const DEMO_EXAMPLES = [
  { id: "bank", label: "Banking", text: BANK_MESSAGE },
  { id: "parcel", label: "Delivery", text: PARCEL_MESSAGE },
  { id: "prize", label: "Prize", text: PRIZE_MESSAGE },
  { id: "job", label: "Job", text: JOB_MESSAGE },
  { id: "account", label: "Account phishing", text: ACCOUNT_MESSAGE },
  { id: "social", label: "Social media", text: SOCIAL_MESSAGE },
];

export const SAMPLE_MESSAGE = BANK_MESSAGE;

export const SAMPLE_RAW_RESULT = {
  verdict: "scam",
  scam_type: "Bank KYC phishing",
  confidence: 96,
  reasons: [
    "Creates false urgency: the account will be blocked \"today\".",
    "The link goes to an unofficial domain (.top) that imitates a bank login page.",
    "Asks you to share a one-time password (OTP). A real bank never asks for this.",
    "Uses a threat of suspension to stop you from thinking or checking first.",
  ],
  mechanism:
    "1. Create fear by claiming the account will be blocked today. " +
    "2. Create urgency so the recipient does not pause to check. " +
    "3. Request sensitive information such as KYC details and an OTP. " +
    "4. Attempt to redirect the recipient through an unofficial login link. " +
    "5. Use captured details or the OTP to take over the account.",
  keywords: ["URGENT", "blocked", "KYC", "http://bank-kyc-verify.top/login", "OTP", "Do not ignore"],
  investigation: {
    keywords: ["URGENT", "blocked", "KYC", "OTP"],
    sourcesChecked: [],
    similarFound: false,
    previousScamFamily: "",
  },
  sources: [],
  memory: {
    matched: false,
    category: "KYC phishing",
    previousScamFamily: "",
  },
  complaint_draft:
    "To,\nThe Cyber Crime Cell / National Cybercrime Reporting Portal\n\n" +
    "Subject: Complaint about a phishing SMS impersonating a bank\n\n" +
    "I received a suspicious message on [date and time] from [sender number or ID] claiming that my bank account would be blocked unless I updated my KYC details.\n\n" +
    "The message contained this link: http://bank-kyc-verify.top/login and asked me to reply with an OTP.\n\n" +
    "I believe this is a phishing attempt. I have not shared any OTP or personal details. [Edit this line if you did.]\n\n" +
    "I request you to investigate the sender and the website and take action.\n\n" +
    "Name: [your name]\nPhone: [your phone number]\nDate: [today's date]",
  family_warning:
    "Scam alert: I got a text saying my bank account will be blocked unless I update KYC through a link. It is a scam. " +
    "Do not click the link and never share an OTP with anyone. If you get a message like this, call your bank using the number on your card.",
};
