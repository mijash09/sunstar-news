import React from 'react';
import Header from '@/components/organisms/Header';
import Navigation from '@/components/organisms/Navigation';
import Footer from '@/components/organisms/Footer';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'गोपनीयता नीति (Privacy Policy) - सनस्टार न्युज | Sunstar News',
  description: 'सनस्टार न्युजको गोपनीयता नीति तथा प्रयोगकर्ताको व्यक्तिगत विवरण सुरक्षासम्बन्धी नीतिहरू।',
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      <Header />
      <Navigation />

      <main className="container" style={{ flex: 1, padding: '36px 16px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            <Link href="/" style={{ color: 'var(--brand-orange)', textDecoration: 'none' }}>गृहपृष्ठ</Link>
            <span>/</span>
            <span>गोपनीयता नीति</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '12px', borderBottom: '3px solid var(--brand-orange)', paddingBottom: '12px' }}>
            गोपनीयता नीति (Privacy Policy)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            अन्तिम अपडेट: २०८३ भदौ | सनस्टार न्युज मिडिया प्रा.लि.
          </p>
        </div>

        <div className="card" style={{ padding: '32px', lineHeight: 1.8, fontSize: '1rem', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            १. परिचय र प्रतिबद्धता
          </h2>
          <p style={{ marginBottom: '20px' }}>
            सनस्टार न्युज (Sunstar News) आफ्ना सम्पूर्ण पाठक तथा प्रयोगकर्ताहरूको गोपनीयताको उच्च सम्मान गर्दछ। हामी हाम्रो डिजिटल प्लेटफर्म (वेबसाइट, मोबाइल संस्करण र सामाजिक सञ्जाल) प्रयोग गर्दा संकलित सूचना तथा विवरणहरूको पूर्ण सुरक्षा सुनिश्चित गर्न प्रतिबद्ध छौँ।
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            २. हामीले संकलन गर्ने जानकारीहरू
          </h2>
          <p style={{ marginBottom: '14px' }}>
            हाम्रो वेबसाइट भ्रमण गर्दा सामान्यतया व्यक्तिगत विवरण दिनु आवश्यक पर्दैन। यद्यपि, केही निश्चित सेवाहरू (जस्तै: टिप्पणी/Comments, समाचार सदस्यता, वा प्रतिक्रिया) प्रयोग गर्दा हामी निम्न जानकारी संकलन गर्न सक्दछौँ:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '20px' }}>
            <li>प्रयोगकर्ताको नाम र इमेल ठेगाना (टिप्पणी वा सम्पर्क गर्दा)</li>
            <li>प्राविधिक विवरण: जस्तै ब्राउजर प्रकार, आइपी ठेगाना र पृष्ठ भ्रमण तथ्याङ्क (Google Analytics मार्फत)</li>
            <li>कुकीज (Cookies): वेबसाइटको अनुभव र लोड गति सुधार गर्न</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ३. संकलित विवरणको उपयोग
          </h2>
          <p style={{ marginBottom: '20px' }}>
            संकलित कुनै पनि जानकारी प्रयोगकर्ताको अनुमतिबिना कुनै तेस्रो पक्षलाई बिक्री वा वितरण गरिँदैन। यी विवरणहरू वेबसाइटको कार्यसम्पादन सुधार गर्न, समाचार गुणस्तर वृद्धि गर्न, र स्पाम वा अवाञ्छित गतिविधि नियन्त्रण गर्न मात्र प्रयोग गरिन्छ।
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ४. सुरक्षा र गोपनीयता संरक्षण
          </h2>
          <p style={{ marginBottom: '20px' }}>
            हामी अत्याधुनिक SSL इन्क्रिप्सन प्रविधि र सुरक्षित सर्भर संरचना प्रयोग गरी तपाईँको डेटा अनाधिकृत पहुँच, परिवर्तन वा क्षतिबाट सुरक्षित राख्दछौँ।
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ५. सम्पर्क तथा जिज्ञासा
          </h2>
          <p>
            गोपनीयता नीतिसम्बन्धी कुनै पनि जिज्ञासा, प्रश्न वा सुझाव भएमा हामीलाई सीधै सम्पर्क गर्न सक्नुहुन्छ:<br />
            <strong>इमेल:</strong> privacy@sunstarnews.com / info@sunstarnews.com<br />
            <strong>ठेगाना:</strong> पोखरा ५, कास्की (शाखा कार्यालय: अनामनगर, काठमाडौँ)
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
