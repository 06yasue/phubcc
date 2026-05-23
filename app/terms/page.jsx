import siteConfig from '@/config';

// ==========================================
// METADATA TERMS UNTUK SEO & GOOGLE CRAWLER
// ==========================================
export async function generateMetadata() {
  return {
    title: `Terms and Conditions - ${siteConfig.sitename}`,
    description: `Read the Terms and Conditions for using ${siteConfig.sitename}. These terms govern your use of our website, content, and services.`,
    openGraph: {
      title: `Terms and Conditions - ${siteConfig.sitename}`,
      description: `Terms of Service and usage guidelines for ${siteConfig.sitename}.`,
      url: `https://${siteConfig.domain}/terms`,
      siteName: siteConfig.sitename,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `Terms and Conditions - ${siteConfig.sitename}`,
      description: `Review our Terms of Service before using our platform.`,
    },
  };
}

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100%', paddingBottom: '60px' }}>
      
      {/* SUNTIK CSS PAKSA BIAR RAPI DAN TERANG */}
      <style dangerouslySetInnerHTML={{__html: `
        .legal-container {
          max-width: 850px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #e2e8f0 !important;
          line-height: 1.8 !important;
          font-size: 16px !important;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .legal-container h1 {
          font-size: 32px !important;
          font-weight: 900 !important;
          color: #ffffff !important;
          margin-bottom: 10px !important;
          text-align: center !important;
        }
        .legal-date {
          text-align: center !important;
          color: #94a3b8 !important;
          font-size: 14px !important;
          margin-bottom: 40px !important;
          padding-bottom: 20px !important;
          border-bottom: 1px solid #334155 !important;
        }
        .legal-container h2 {
          font-size: 22px !important;
          font-weight: 800 !important;
          color: #f8fafc !important;
          margin-top: 40px !important;
          margin-bottom: 15px !important;
        }
        .legal-container p {
          margin-bottom: 20px !important;
          text-align: justify !important;
        }
        .legal-container ul {
          margin-bottom: 25px !important;
          padding-left: 25px !important;
        }
        .legal-container li {
          margin-bottom: 12px !important;
          text-align: justify !important;
        }
        .legal-container a {
          color: #3b82f6 !important;
          text-decoration: none !important;
        }
      `}} />

      <div className="legal-container">
        
        <h1>Terms and Conditions</h1>
        <div className="legal-date">Last Updated: May 2026</div>

        <p>
          Welcome to {siteConfig.sitename}! These terms and conditions outline the rules and regulations for the use of 
          {siteConfig.sitename}'s Website, located at https://{siteConfig.domain}.
        </p>
        <p>
          By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use 
          {siteConfig.sitename} if you do not agree to take all of the terms and conditions stated on this page.
        </p>
        <p>
          The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and 
          all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the 
          Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. 
          "Party", "Parties", or "Us", refers to both the Client and ourselves.
        </p>

        <h2>1. Intellectual Property Rights</h2>
        <p>
          Other than the content you own, under these Terms, {siteConfig.sitename} and/or its licensors own all the 
          intellectual property rights and materials contained in this Website. We act as a search engine and indexing 
          service. We do not host or upload any media files. All embedded videos and links are strictly hosted on 
          third-party servers.
        </p>
        <p>
          You are granted limited license only for purposes of viewing the material contained on this Website for personal, 
          non-commercial use.
        </p>

        <h2>2. Restrictions</h2>
        <p>You are specifically restricted from all of the following:</p>
        <ul>
          <li>Publishing any Website material in any other media without prior written consent.</li>
          <li>Selling, sublicensing, and/or otherwise commercializing any Website material.</li>
          <li>Publicly performing and/or showing any Website material.</li>
          <li>Using this Website in any way that is or may be damaging to this Website.</li>
          <li>Using this Website in any way that impacts user access to this Website.</li>
          <li>Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity.</li>
          <li>Engaging in any data mining, data harvesting, data extracting, or any other similar activity in relation to this Website.</li>
          <li>Using this Website to engage in any advertising or marketing.</li>
        </ul>
        <p>
          Certain areas of this Website are restricted from being accessed by you and {siteConfig.sitename} may further restrict 
          access by you to any areas of this Website, at any time, in absolute discretion.
        </p>

        <h2>3. Your Content</h2>
        <p>
          In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, images or other 
          material you choose to display on this Website. By displaying Your Content, you grant {siteConfig.sitename} a 
          non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and 
          distribute it in any and all media.
        </p>
        <p>
          Your Content must be your own and must not be invading any third-party's rights. {siteConfig.sitename} reserves 
          the right to remove any of Your Content from this Website at any time without notice.
        </p>

        <h2>4. No Warranties</h2>
        <p>
          This Website is provided "as is," with all faults, and {siteConfig.sitename} express no representations or 
          warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained 
          on this Website shall be interpreted as advising you. We do not guarantee the accuracy, completeness, or usefulness 
          of any information on the site.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          In no event shall {siteConfig.sitename}, nor any of its officers, directors, and employees, be held liable for 
          anything arising out of or in any way connected with your use of this Website whether such liability is under contract. 
          {siteConfig.sitename}, including its officers, directors, and employees shall not be held liable for any indirect, 
          consequential, or special liability arising out of or in any way related to your use of this Website.
        </p>

        <h2>6. Third-Party Links and Advertisements</h2>
        <p>
          Our Website may contain links to third-party web sites or services that are not owned or controlled by {siteConfig.sitename}. 
          We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party 
          web sites or services. You further acknowledge and agree that {siteConfig.sitename} shall not be responsible or liable, 
          directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or 
          reliance on any such content, goods, or services available on or through any such web sites or services.
        </p>

        <h2>7. Indemnification</h2>
        <p>
          You hereby indemnify to the fullest extent {siteConfig.sitename} from and against any and/or all liabilities, 
          costs, demands, causes of action, damages, and expenses arising in any way related to your breach of any of the 
          provisions of these Terms.
        </p>

        <h2>8. Severability</h2>
        <p>
          If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted 
          without affecting the remaining provisions herein.
        </p>

        <h2>9. Variation of Terms</h2>
        <p>
          {siteConfig.sitename} is permitted to revise these Terms at any time as it sees fit, and by using this Website you 
          are expected to review these Terms on a regular basis. Your continued use of the Website following the posting of 
          revised Terms means that you accept and agree to the changes.
        </p>

        <h2>10. Assignment</h2>
        <p>
          {siteConfig.sitename} is allowed to assign, transfer, and subcontract its rights and/or obligations under these 
          Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights 
          and/or obligations under these Terms.
        </p>

        <h2>11. Entire Agreement</h2>
        <p>
          These Terms constitute the entire agreement between {siteConfig.sitename} and you in relation to your use of this 
          Website, and supersede all prior agreements and understandings.
        </p>

        <h2>12. Contact Information</h2>
        <p>
          If you have any inquiries regarding these Terms and Conditions, please contact us via email at: <br/>
          <a href={`mailto:contact@${siteConfig.domain}`}>contact@{siteConfig.domain}</a>
        </p>

      </div>
    </div>
  );
}
