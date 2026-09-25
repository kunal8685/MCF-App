export interface FAQItem {
  id: string;
  question: string;
  hindiQuestion: string;
  answer: string;
  hindiAnswer: string;
  category: 'General' | 'Complaints' | 'Property Tax' | 'Water & Sanitation';
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I register a civic grievance on MCF Citizen App?',
    hindiQuestion: 'एमसीएफ सिटीजन ऐप पर नागरिक शिकायत कैसे दर्ज करें?',
    answer: 'Tap the "+" Floating Action Button or go to "Complaints Redressal" -> "Lodge New Complaint". Capture or upload a photo, choose the appropriate category (Garbage, Street Light, Sewerage, Roads, etc.), provide your address, and tap "Submit Complaint". You will receive an instant Complaint Tracking ID.',
    hindiAnswer: '"+" बटन दबाएं या "शिकायत निवारण" -> "नई शिकायत दर्ज करें" पर जाएं। फोटो अपलोड करें, श्रेणी चुनें (कचरा, स्ट्रीट लाइट, सीवरेज, सड़क आदि), पता दर्ज करें और "शिकायत जमा करें" पर टैप करें। आपको तुरंत शिकायत ट्रैकिंग आईडी मिल जाएगी।',
    category: 'Complaints',
  },
  {
    id: 'faq-2',
    question: 'What is the turnaround time for complaint resolution?',
    hindiQuestion: 'शिकायत निवारण का समय कितना है?',
    answer: 'Standard civic grievances like garbage collection and street lights are addressed within 24 to 48 hours. Engineering works like road patching, deep sewer desilting, or water pipeline replacement may take 3 to 7 working days depending on site conditions.',
    hindiAnswer: 'कचरा उठाने और स्ट्रीट लाइट जैसी सामान्य शिकायतों का निवारण 24 से 48 घंटे के भीतर किया जाता है। सड़क मरम्मत या सीवर लाइन जैसी तकनीकी शिकायतों में 3 से 7 कार्य दिवस लग सकते हैं।',
    category: 'Complaints',
  },
  {
    id: 'faq-3',
    question: 'How can I track the live status of my lodged complaint?',
    hindiQuestion: 'मैं अपनी दर्ज शिकायत की स्थिति कैसे ट्रैक कर सकता हूँ?',
    answer: 'Navigate to "Complaints Redressal" -> "My Complaints". You can filter by Pending, In Progress, and Resolved. Tapping any complaint shows officer inspection remarks, status updates, and resolution photos.',
    hindiAnswer: '"शिकायत निवारण" -> "मेरी शिकायतें" पर जाएं। आप लंबित, प्रगति पर और समाधान किए गए फ़िल्टर देख सकते हैं। किसी भी शिकायत पर टैप करके अधिकारी की टिप्पणी और फोटो देख सकते हैं।',
    category: 'Complaints',
  },
  {
    id: 'faq-4',
    question: 'What if I am not satisfied with the complaint resolution?',
    hindiQuestion: 'यदि मैं शिकायत समाधान से संतुष्ट नहीं हूँ तो क्या करूँ?',
    answer: 'If your complaint is marked resolved but the ground issue persists, you can tap "Reopen Complaint" within 72 hours with feedback and updated photos, which automatically escalates it to the Zonal Joint Commissioner.',
    hindiAnswer: 'यदि शिकायत बंद कर दी गई है लेकिन काम नहीं हुआ है, तो आप 72 घंटे के भीतर "शिकायत पुनः खोलें" बटन दबाकर इसे जोनल संयुक्त आयुक्त को अग्रेषित कर सकते हैं।',
    category: 'Complaints',
  },
  {
    id: 'faq-5',
    question: 'How can I pay my Property Tax online?',
    hindiQuestion: 'मैं अपने संपत्ति कर (प्रॉपर्टी टैक्स) का ऑनलाइन भुगतान कैसे करूँ?',
    answer: 'Go to "All Citizen Services" -> "Property Tax". Enter your Property ID or Owner Name and Ward number. You can view outstanding dues, calculate rebate (if applicable), and pay securely through Netbanking, UPI, or Credit/Debit Card.',
    hindiAnswer: '"नागरिक सेवाएं" -> "संपत्ति कर" पर जाएं। अपनी प्रॉपर्टी आईडी दर्ज करें, बकाया राशि देखें और यूपीआई/नेटबैंकिंग से ऑनलाइन भुगतान करें।',
    category: 'Property Tax',
  },
  {
    id: 'faq-6',
    question: 'How to apply for a new Water & Sewerage connection?',
    hindiQuestion: 'नए पानी और सीवर कनेक्शन के लिए आवेदन कैसे करें?',
    answer: 'Visit "All Citizen Services" -> "Water & Sewerage Charges" or visit your nearest MCF Zonal Engineering Division with your property ownership proof, ID proof, and approved building plan.',
    hindiAnswer: '"नागरिक सेवाएं" -> "पानी और सीवरेज" पर जाएं या आवश्यक स्वामित्व प्रमाण पत्र के साथ नजदीकी जोनल कार्यालय में संपर्क करें।',
    category: 'Water & Sanitation',
  },
  {
    id: 'faq-7',
    question: 'How to request emergency water tanker service?',
    hindiQuestion: 'आपातकालीन पानी के टैंकर का अनुरोध कैसे करें?',
    answer: 'Select "Water & Sewage Complaints" from the home screen, choose "Request Water Tanker", enter your delivery address, landmark, and mobile number. The MCF Water Works division dispatches the nearest municipal tanker.',
    hindiAnswer: 'होम स्क्रीन पर "पानी और सीवेज शिकायतें" चुनें, "वाटर टैंकर का अनुरोध" पर क्लिक करें और अपना पता दर्ज करें।',
    category: 'Water & Sanitation',
  },
  {
    id: 'faq-8',
    question: 'How do I download Birth or Death Certificates?',
    hindiQuestion: 'जन्म या मृत्यु प्रमाण पत्र कैसे डाउनलोड करें?',
    answer: 'Under "All Citizen Services" -> "Birth & Death Certificate", enter the Registration Number or Child/Deceased name and Date of Event to search and download digitally signed QR-coded certificates.',
    hindiAnswer: '"नागरिक सेवाएं" -> "जन्म और मृत्यु प्रमाण पत्र" पर जाकर पंजीकरण संख्या दर्ज कर डिजिटल प्रमाण पत्र डाउनलोड करें।',
    category: 'General',
  },
  {
    id: 'faq-9',
    question: 'What is the MCF Toll-Free Helpline number?',
    hindiQuestion: 'एमसीएफ टोल-फ्री हेल्पलाइन नंबर क्या है?',
    answer: 'The MCF 24*7 citizen toll-free helpline number is 1800-180-2013 and control room landline is 0129-2415549. You can tap directly on "Helpline 24*7" to dial immediately.',
    hindiAnswer: 'एमसीएफ 24*7 टोल-फ्री हेल्पलाइन नंबर 1800-180-2013 और कंट्रोल रूम 0129-2415549 है।',
    category: 'General',
  },
  {
    id: 'faq-10',
    question: 'How can I change the app language to Hindi?',
    hindiQuestion: 'ऐप की भाषा को हिंदी में कैसे बदलें?',
    answer: 'Open the side drawer menu by tapping the top-left menu icon, select "Change Language", pick "हिंदी (Hindi)" and tap "Save Preference". The interface will instantly update.',
    hindiAnswer: 'बाईं ओर का मेन्यू खोलें, "भाषा बदलें" चुनें, "हिंदी" का चयन करें और सहेजें।',
    category: 'General',
  },
  {
    id: 'faq-11',
    question: 'How do I find public toilets and civic amenities nearby?',
    hindiQuestion: 'पास के सार्वजनिक शौचालय और सुविधाएं कैसे खोजें?',
    answer: 'Tap "What Near Me" on the dashboard. You can select Public Toilet, ATM, Metro Station, Bus Stand, Hospital, Community Centre, or Police Station to view distances and turn-by-turn navigation.',
    hindiAnswer: 'डैशबोर्ड पर "मेरे पास क्या है" टैप करें और शौचालय, अस्पताल, मेट्रो, आदि की दूरी व दिशा देखें।',
    category: 'General',
  },
  {
    id: 'faq-12',
    question: 'Who is the Joint Commissioner for my area?',
    hindiQuestion: 'मेरे क्षेत्र के संयुक्त आयुक्त कौन हैं?',
    answer: 'Check the "E-Directory" section from the dashboard. Officials are listed zone-wise: Ballabgarh Zone (Sh. Jitender Joshi), Old Faridabad (Sh. Rajesh Kumar), NIT Zone (Sh. Karan Singh), and Headquarters (Sh. Gajender Singh). Direct official phone contacts are provided.',
    hindiAnswer: '"ई-डायरेक्टरी" में जाकर अपने क्षेत्र के अनुसार संयुक्त आयुक्त और अधिकारियों के संपर्क विवरण देख सकते हैं।',
    category: 'General',
  },
];
