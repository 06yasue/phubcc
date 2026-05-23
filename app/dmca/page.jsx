import siteConfig from '@/config';

// ==========================================
// METADATA DMCA UNTUK SEO & GOOGLE CRAWLER
// ==========================================
export async function generateMetadata() {
  return {
    title: `DMCA Policy - ${siteConfig.sitename}`,
    description: `Read the Digital Millennium Copyright Act (DMCA) Notice and Policy for ${siteConfig.sitename}. We respect intellectual property rights and strictly adhere to copyright laws.`,
    openGraph: {
      title: `DMCA Policy - ${siteConfig.sitename}`,
      description: `Digital Millennium Copyright Act (DMCA) Policy for ${siteConfig.sitename}.`,
      url: `https://${siteConfig.domain}/dmca`,
      siteName: siteConfig.sitename,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `DMCA Policy - ${siteConfig.sitename}`,
      description: `Review our DMCA Policy and copyright infringement notification process.`,
    },
  };
}

export default function DmcaPage() {
  return (
    // Background dibikin gelap elegan (slate-900) biar warna teks CSS lo yang terang bisa kebaca jelas
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100%' }}>
      <div className="legal-container">
        
        <h1>DMCA Copyright Policy</h1>
        <div className="legal-date">Last Updated: May 2026</div>

        <p>
          Welcome to {siteConfig.sitename} (hereinafter referred to as the "Website", "We", "Us", or "Our"). 
          We deeply respect the intellectual property rights of others and expect our users to do the same. 
          In accordance with the Digital Millennium Copyright Act of 1998, the text of which may be found on the 
          U.S. Copyright Office website at http://www.copyright.gov/legislation/dmca.pdf, we will respond 
          expeditiously to claims of copyright infringement committed using our Website if such claims are 
          reported to our Designated Copyright Agent identified in the sample notice below.
        </p>

        <p>
          This Digital Millennium Copyright Act policy applies to the {siteConfig.domain} website and any of its 
          related products and services. It outlines how the Website operator addresses copyright infringement 
          notifications and how you, or your authorized representative, may submit a copyright infringement complaint.
        </p>

        <h2>1. Purpose and Scope</h2>
        <p>
          The primary objective of this DMCA Policy is to establish a seamless, legally compliant, and efficient 
          mechanism for intellectual property owners to report alleged infringements. We act as an Online Service Provider 
          (OSP) under the safe harbor provisions of the DMCA. Therefore, we do not monitor, curate, or pre-screen the 
          contents uploaded, linked, or embedded by third-party users or automated indexing scripts unless expressly 
          notified through the strict channels outlined within this document.
        </p>
        <p>
          Protection of intellectual property is of paramount importance to us, and we are heavily invested in keeping 
          {siteConfig.sitename} completely clear of unauthorized copyrighted material. Upon receipt of a properly 
          formatted and verified DMCA takedown notice, we will take immediate and appropriate action, which may include 
          the permanent removal of the infringing material or the disabling of access to it.
        </p>

        <h2>2. Notification of Copyright Infringement (Takedown Notice)</h2>
        <p>
          If you are a copyright owner, or are authorized to act on behalf of one, or authorized to act under any 
          exclusive right under copyright, please report alleged copyright infringements taking place on or through 
          the Website by completing the following DMCA Notice of Alleged Infringement and delivering it to our 
          Designated Copyright Agent. Upon receipt of the Notice as described below, we will take whatever action, 
          in our sole discretion, we deem appropriate, including removal of the challenged material from the Website.
        </p>
        <p>To file a legally binding copyright infringement notification with us, you must provide a written communication that explicitly includes all the following elements:</p>
        
        <ul>
          <li><strong>Physical or Electronic Signature:</strong> A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
          <li><strong>Identification of the Copyrighted Work:</strong> Detailed identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site.</li>
          <li><strong>Identification of the Infringing Material:</strong> Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit the service provider to locate the material (e.g., specific URLs leading directly to the allegedly infringing files or pages).</li>
          <li><strong>Contact Information:</strong> Information reasonably sufficient to permit the service provider to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address at which the complaining party may be contacted.</li>
          <li><strong>Statement of Good Faith:</strong> A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
          <li><strong>Statement of Accuracy and Perjury:</strong> A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
        </ul>

        <h2>3. Counter-Notification Procedure</h2>
        <p>
          If you believe that the material you posted or linked to was removed (or access to it was disabled) by mistake 
          or misidentification, you may file a counter-notification with us pursuant to the DMCA. A valid counter-notification 
          must be a written communication provided to our Designated Copyright Agent that includes substantially the following:
        </p>
        
        <ul>
          <li>Your physical or electronic signature.</li>
          <li>Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access to it was disabled.</li>
          <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material to be removed or disabled.</li>
          <li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located, or if your address is outside of the United States, for any judicial district in which the service provider may be found, and that you will accept service of process from the person who provided the original DMCA notification or an agent of such person.</li>
        </ul>

        <h2>4. Repeat Infringer Policy</h2>
        <p>
          In accordance with the Digital Millennium Copyright Act and other applicable laws, {siteConfig.sitename} has 
          adopted a policy of terminating, in appropriate circumstances and at our sole discretion, the access of users, 
          subscribers, or account holders who are deemed to be repeat infringers. We may also, at our sole discretion, 
          limit access to the Website and/or terminate the accounts of any users who infringe any intellectual property 
          rights of others, whether or not there is any repeat infringement.
        </p>
        <p>
          It is our strict policy to permanently ban any IP address, user account, or automated bot that is found to be 
          systematically uploading or scraping copyrighted materials without consent. Our automated systems and manual 
          moderators work concurrently to ensure that repeat offenders are isolated and their access blocked permanently.
        </p>

        <h2>5. Misrepresentations and False Claims</h2>
        <p>
          Please be fully aware that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents 
          that material or activity is infringing, or that material or activity was removed or disabled by mistake or 
          misidentification, may be subject to liability and severe civil penalties, including costs and attorney's fees.
        </p>
        <p>
          We strongly advise you to consult with an attorney or legal counsel before submitting a DMCA Notice or a 
          Counter-Notification to ensure that you are fully aware of your rights and obligations under the law. We actively 
          investigate all notices submitted to us and will not hesitate to pursue legal action against individuals who submit 
          fraudulent, malicious, or automated/bot-generated DMCA requests designed to damage our website's reputation or rankings.
        </p>

        <h2>6. Third-Party Links and Embedded Content</h2>
        <p>
          {siteConfig.sitename} may contain links to third-party websites, embedded video players, or resources that are 
          not owned or controlled by us. We assume no responsibility for the content, privacy policies, or practices of any 
          third-party websites or services. We do not host the video files on our own servers. The materials are indexed 
          from third-party sources. If you find your copyrighted material on a third-party server, you must contact the 
          third-party hosting provider directly to have the material removed at the source. Once the material is removed 
          from the primary hosting source, it will automatically cease to function on our Website.
        </p>

        <h2>7. Fair Use Exception</h2>
        <p>
          Please note that under United States copyright law, certain uses of copyrighted material may be protected under 
          the doctrine of "Fair Use" (17 U.S.C. § 107). Before sending a takedown notice, please carefully evaluate whether 
          the use of the material constitutes Fair Use. If the material is deemed to fall under Fair Use, your DMCA 
          notification will be rejected, and you may be liable for damages resulting from a false claim.
        </p>

        <h2>8. Contact Information and Designated Agent</h2>
        <p>
          If you wish to notify us of the infringing material or activity, you may do so by sending an email to our 
          Designated Copyright Agent. Please allow at least 2-5 business days for an email response. Note that emailing 
          your complaint to other parties such as our Internet Service Provider will not expedite your request and may 
          result in a delayed response due to the complaint not being filed properly.
        </p>
        <p>
          <strong>Email address for DMCA requests:</strong> <br />
          <a href={`mailto:dmca@${siteConfig.domain}`}>dmca@{siteConfig.domain}</a>
        </p>

        <h2>9. Modifications and Amendments</h2>
        <p>
          We reserve the right to modify this DMCA Policy or its terms relating to the Website and Services at any time, 
          effective upon posting of an updated version of this Policy on the Website. When we do, we will revise the 
          updated date at the top of this page. Continued use of the Website and Services after any such changes shall 
          constitute your consent to such changes.
        </p>

      </div>
    </div>
  );
}
