import React from 'react';
import Header from '@/components/organisms/Header';
import Navigation from '@/components/organisms/Navigation';
import Footer from '@/components/organisms/Footer';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'उपयोगका शर्तहरू (Terms of Use) - सनस्टार न्युज | Sunstar News',
  description: 'सनस्टार न्युजको अनलाइन प्लेटफर्म उपयोगका नियम तथा शर्तहरू।',
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      <Header />
      <Navigation />

      <main className="container" style={{ flex: 1, padding: '36px 16px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            <Link href="/" style={{ color: 'var(--brand-orange)', textDecoration: 'none' }}>गृहपृष्ठ</Link>
            <span>/</span>
            <span>उपयोगका शर्तहरू</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '12px', borderBottom: '3px solid var(--brand-orange)', paddingBottom: '12px' }}>
            उपयोगका शर्तहरू (Terms of Use)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            लागू भएको मिति: २०८३ भदौ | सनस्टार न्युज मिडिया प्रा.लि.
          </p>
        </div>

        <div className="card" style={{ padding: '32px', lineHeight: 1.8, fontSize: '1rem', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            १. सेवा स्वीकारोक्ति
          </h2>
          <p style={{ marginBottom: '20px' }}>
            सनस्टार न्युज (SunstarNews.com) को वेबसाइट, मोबाइल एप्लिकेसन वा अन्य कुनै पनि डिजिटल सेवाहरू प्रयोग गर्नुभएमा तपाईं यी नियम तथा शर्तहरूसँग सहमत हुनुभएको मानिनेछ।
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            २. बौद्धिक सम्पत्ति तथा प्रतिलिपि अधिकार (Copyright)
          </h2>
          <p style={{ marginBottom: '20px' }}>
            यस पोर्टलमा प्रकाशित सम्पूर्ण समाचार, लेख, तस्बिर, भिडियो, अडियो तथा ग्राफिक्स सनस्टार न्युजको बौद्धिक सम्पत्ति हुन्। सनस्टार न्युजको पूर्व लिखित अनुमतिबिना कुनै पनि सामग्री व्यावसायिक प्रयोजनका लागि पुनः उत्पादन, वितरण वा परिमार्जन गर्न निषेध गरिएको छ। व्यक्तिगत अध्ययन वा सन्दर्भका लागि स्रोत उल्लेख गरी अंशहरू साभार गर्न पाइनेछ।
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ३. पाठक टिप्पणी (Comment Policy)
          </h2>
          <p style={{ marginBottom: '14px' }}>
            हाम्रो प्लेटफर्ममा पाठकहरूलाई आफ्ना विचार व्यक्त गर्न स्वागत छ। तर, टिप्पणी गर्दा निम्न विषयहरूको कडाइका साथ पालना गर्नुपर्नेछ:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '20px' }}>
            <li>घृणास्पद अभिव्यक्ति (Hate Speech), अश्लील वा हिंसा भड्काउने शब्द प्रयोग गर्न पाइने छैन।</li>
            <li>कुनै पनि व्यक्ति, समुदाय, जाति वा धर्मप्रति आक्षेप वा मानहानि हुने कुरा लेख्न पाइने छैन।</li>
            <li>व्यावसायिक विज्ञापन वा स्पाम लिंक पोस्ट गर्न निषेध छ।</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ४. पत्रकारिता आचारसंहिता
          </h2>
          <p style={{ marginBottom: '20px' }}>
            सनस्टार न्युज नेपाल प्रेस काउन्सिलको पत्रकारिता आचारसंहिता २०७६ (संशोधित) र सूचना विभागका निर्देशिकाहरूको पूर्ण पालना गर्न प्रतिबद्ध छ। यदि कुनै समाचारमा तथ्यगत त्रुटि पाइएमा हामी तत्काल सच्याउने (Correction Policy) अभ्यास गर्दछौँ।
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ५. सम्पर्क
          </h2>
          <p>
            नियम र शर्तहरूसम्बन्धी थप जानकारीका लागि:<br />
            <strong>इमेल:</strong> legal@sunstarnews.com / info@sunstarnews.com
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
