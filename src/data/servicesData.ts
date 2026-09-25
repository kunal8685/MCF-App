export interface CitizenService {
  id: string;
  title: string;
  hindiTitle: string;
  icon: string;
  description: string;
  hindiDescription: string;
  category: 'Tax' | 'Certificates' | 'Licensing' | 'Planning';
  url?: string;
  actionText: string;
  requirements: string[];
}

export const CITIZEN_SERVICES: CitizenService[] = [
  {
    id: 'prop-tax',
    title: 'Property Tax',
    hindiTitle: 'संपत्ति कर',
    icon: 'home',
    category: 'Tax',
    description: 'Search property by ID, view outstanding bill, generate tax receipt, and pay online with instant rebate.',
    hindiDescription: 'संपत्ति आईडी खोजें, बकाया बिल देखें, रसीद प्राप्त करें और ऑनलाइन भुगतान करें।',
    actionText: 'Pay Property Tax',
    requirements: ['Unique Property ID', 'Owner Mobile Number', 'Address / Ward details'],
  },
  {
    id: 'water-sewer',
    title: 'Water & Sewerage Charges',
    hindiTitle: 'पानी और सीवरेज शुल्क',
    icon: 'droplets',
    category: 'Tax',
    description: 'Pay water supply and sewerage maintenance bills, check tariff calculator, or report faulty meter.',
    hindiDescription: 'पानी और सीवर बिल का भुगतान करें तथा मीटर संबंधी विवरण जांचें।',
    actionText: 'Pay Water Bill',
    requirements: ['Water Consumer No.', 'Zone Code', 'Last Bill Receipt'],
  },
  {
    id: 'trade-license',
    title: 'Trade & Commercial License',
    hindiTitle: 'व्यापार लाइसेंस',
    icon: 'briefcase',
    category: 'Licensing',
    description: 'Apply for fresh commercial trade license, renew existing license, and download verified certificate.',
    hindiDescription: 'नए व्यापार लाइसेंस के लिए आवेदन करें या नवीनीकरण करें।',
    actionText: 'Apply / Renew License',
    requirements: ['Business Proof', 'Rent Agreement / NOC', 'ID & Aadhaar Proof', 'Fire Clearance'],
  },
  {
    id: 'birth-death',
    title: 'Birth & Death Certificate',
    hindiTitle: 'जन्म और मृत्यु प्रमाण पत्र',
    icon: 'file-text',
    category: 'Certificates',
    description: 'Instant download of digitally signed QR-coded certificates for institutional births/deaths in MCF limits.',
    hindiDescription: 'डिजिटल रूप से हस्ताक्षरित जन्म और मृत्यु प्रमाण पत्र डाउनलोड करें।',
    actionText: 'Search & Download',
    requirements: ['Hospital Discharge slip', 'Registration Number', 'Applicant Aadhaar'],
  },
  {
    id: 'building-plan',
    title: 'Building Plan Approval (DCR)',
    hindiTitle: 'भवन निर्माण योजना स्वीकृति',
    icon: 'layers',
    category: 'Planning',
    description: 'Online DCR building plan scrutiny and sanction system under Haryana Building Code.',
    hindiDescription: 'हरियाणा बिल्डिंग कोड के तहत ऑनलाइन भवन योजना स्वीकृति पोर्टल।',
    actionText: 'Access DCR Portal',
    requirements: ['Architect Drawings (AutoCAD)', 'Registry / Title Deed', 'Site Plan', 'Structural Stability Certificate'],
  },
  {
    id: 'fire-noc',
    title: 'Fire Safety NOC',
    hindiTitle: 'अग्नि सुरक्षा एनओसी',
    icon: 'flame',
    category: 'Licensing',
    description: 'Apply for provisional and final Fire Safety Certificate for commercial and residential establishments.',
    hindiDescription: 'वाणिज्यिक एवं आवासीय भवनों के लिए फायर एनओसी हेतु आवेदन करें।',
    actionText: 'Apply Fire NOC',
    requirements: ['Building Elevation', 'Fire Fighting System Layout', 'Site Inspection Report'],
  },
  {
    id: 'pet-reg',
    title: 'Dog / Pet Registration',
    hindiTitle: 'कुत्ता / पालतू जानवर पंजीकरण',
    icon: 'smile',
    category: 'Licensing',
    description: 'Mandatory online registration of pet dogs under Haryana Municipal Act with anti-rabies vaccination proof.',
    hindiDescription: 'पालतू कुत्तों का ऑनलाइन पंजीकरण और टीकाकरण प्रमाणपत्र अपलोड करें।',
    actionText: 'Register Pet',
    requirements: ['Veterinary Vaccination Card', 'Pet Photo', 'Owner ID Proof'],
  },
];
