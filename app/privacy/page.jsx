import siteConfig from '@/config';

// ==========================================
// METADATA PRIVACY UNTUK SEO & GOOGLE CRAWLER
// ==========================================
export async function generateMetadata() {
  return {
    title: `Privacy Policy - ${siteConfig.sitename}`,
    description: `Privacy Policy for ${siteConfig.sitename}. Learn how we collect, use, and protect your personal data, cookies, and privacy rights.`,
    openGraph: {
      title: `Privacy Policy - ${siteConfig.sitename}`,
      description: `Read the Privacy Policy and data protection guidelines for ${siteConfig.sitename}.`,
      url: `https://${siteConfig.domain}/privacy`,
      siteName: siteConfig.sitename,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `Privacy Policy - ${siteConfig.sitename}`,
      description: `Understand our data collection and privacy practices.`,
    },
  };
}

export default function PrivacyPage() {
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
        
        <h1>Privacy Policy</h1>
        <div className="legal-date">Last Updated: May 2026</div>

        <p>
          At {siteConfig.sitename}, accessible from https://{siteConfig.domain}, one of our main priorities is the 
          privacy of our visitors. This Privacy Policy document contains types of information that is collected 
          and recorded by {siteConfig.sitename} and how we use it.
        </p>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards 
          to the information that they shared and/or collect in {siteConfig.sitename}. This policy is not applicable to any 
          information collected offline or via channels other than this website.
        </p>

        <h2>1. Consent</h2>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you do not agree with 
          the terms of this Privacy Policy, please do not access the site.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be 
          made clear to you at the point we ask you to provide your personal information.
        </p>
        <p>
          If you contact us directly, we may receive additional information about you such as your name, email address, 
          phone number, the contents of the message and/or attachments you may send us, and any other information you may 
          choose to provide. When you register for an Account, we may ask for your contact information, including items 
          such as name, company name, address, email address, and telephone number.
        </p>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect in various ways, including to:</p>
        <ul>
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
          <li>Send you emails and prevent fraud</li>
        </ul>

        <h2>4. Log Files</h2>
        <p>
          {siteConfig.sitename} follows a standard procedure of using log files. These files log visitors when they visit 
          websites. All hosting companies do this and a part of hosting services' analytics. The information collected by 
          log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time 
          stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is 
          personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking 
          users' movement on the website, and gathering demographic information.
        </p>

        <h2>5. Cookies and Web Beacons</h2>
        <p>
          Like any other website, {siteConfig.sitename} uses "cookies". These cookies are used to store information including 
          visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used 
          to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other 
          information.
        </p>

        <h2>6. Third-Party Advertising Partners</h2>
        <p>
          Some of advertisers on our site may use cookies and web beacons. Our advertising partners include various ad networks. 
          Each of our advertising partners has their own Privacy Policy for their policies on user data. 
        </p>
        <p>
          Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in 
          their respective advertisements and links that appear on {siteConfig.sitename}, which are sent directly to users' 
          browser. They automatically receive your IP address when this occurs. These technologies are used to measure the 
          effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites 
          that you visit.
        </p>
        <p>
          Note that {siteConfig.sitename} has no access to or control over these cookies that are used by third-party advertisers.
        </p>

        <h2>7. Third Party Privacy Policies</h2>
        <p>
          {siteConfig.sitename}'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to 
          consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include 
          their practices and instructions about how to opt-out of certain options.
        </p>
        <p>
          You can choose to disable cookies through your individual browser options. To know more detailed information about 
          cookie management with specific web browsers, it can be found at the browsers' respective websites.
        </p>

        <h2>8. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
        <p>Under the CCPA, among other rights, California consumers have the right to:</p>
        <ul>
          <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
          <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
          <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
        </ul>
        <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

        <h2>9. GDPR Data Protection Rights</h2>
        <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
        <ul>
          <li><strong>The right to access</strong> – You have the right to request copies of your personal data. We may charge you a small fee for this service.</li>
          <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</li>
          <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
          <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
          <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
          <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
        </ul>
        <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

        <h2>10. Children's Information</h2>
        <p>
          Another part of our priority is adding protection for children while using the internet. We encourage parents and 
          guardians to observe, participate in, and/or monitor and guide their online activity.
        </p>
        <p>
          {siteConfig.sitename} does not knowingly collect any Personal Identifiable Information from children under the age 
          of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to 
          contact us immediately and we will do our best efforts to promptly remove such information from our records.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at: <br/>
          <a href={`mailto:privacy@${siteConfig.domain}`}>privacy@{siteConfig.domain}</a>
        </p>

      </div>
    </div>
  );
}
