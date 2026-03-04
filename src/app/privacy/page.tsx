import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Header />
      
      <main className="container mx-auto px-6 py-12 flex-1">
        <div className="max-w-4xl mx-auto bg-background rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-brand">Privacy Notice</h1>
          <p className="text-sm mb-8"><strong>Effective Date:</strong> 01/03/2026</p>
          
          <div className="mb-8 p-4 bg-brand-beige-light rounded-lg">
            <p className="mb-2"><strong>Business Name:</strong> Ellie's Oats</p>
            <p className="mb-2"><strong>Contact Email:</strong> <a href="mailto:elliesoats@hotmail.com" className="text-brand-green hover:underline">elliesoats@hotmail.com</a></p>
            <p><strong>Contact Phone:</strong> <a href="tel:07989785066" className="text-brand-green hover:underline">07989 785066</a></p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="mb-6">
              Ellie's Oats is committed to protecting your personal data. This Privacy Notice explains how we collect, use, and protect your information in accordance with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and the Privacy and Electronic Communications Regulations (PECR).
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. The Information We Collect</h2>
            <p className="mb-4">When you place an order through our website, we collect:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Your full name</li>
              <li>Your delivery address</li>
              <li>Your phone number</li>
            </ul>
            <p className="mb-6">This information is required so we can process and deliver your oat bowl order.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Lawful Basis for Processing</h2>
            <p className="mb-4">Under UK GDPR, our lawful basis for collecting and using your personal data is:</p>
            <p className="mb-6">
              <strong>Contractual necessity</strong> – we need your personal information to fulfil your order and deliver your products.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use your personal information to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Process and manage your order</li>
              <li>Deliver your products</li>
              <li>Contact you regarding your order if necessary</li>
            </ul>
            <p className="mb-6">We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Payments</h2>
            <p className="mb-4">We use SumUp to securely process card payments.</p>
            <p className="mb-4">
              When you make a payment, your payment details (such as your card information) are processed directly by SumUp. We do not store or have access to your full card details.
            </p>
            <p className="mb-4">
              SumUp acts as a separate data controller for payment processing and handles your data in accordance with its own privacy policy. We recommend reviewing SumUp's privacy policy on their website for more information about how they process your personal data.
            </p>
            <p className="mb-6">
              We only receive confirmation that your payment has been successful, along with limited transaction details necessary for our records.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. How We Store Your Information</h2>
            <p className="mb-4">
              Your personal information is stored securely on our business phone and is only accessed for order and delivery purposes.
            </p>
            <p className="mb-6">
              We take reasonable steps to protect your data from loss, misuse, or unauthorised access.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. How Long We Keep Your Data</h2>
            <p className="mb-4">We retain your personal data only for as long as necessary to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Fulfil your order</li>
              <li>Maintain basic business and financial records</li>
            </ul>
            <p className="mb-6">You may request deletion of your data at any time by contacting us (see Section 9).</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Your Data Protection Rights</h2>
            <p className="mb-4">Under UK data protection law, you have the right to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Request access to your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request erasure of your data</li>
              <li>Request restriction or object to processing in certain circumstances</li>
              <li>Lodge a complaint with the Information Commissioner's Office (ICO)</li>
            </ul>
            <p className="mb-4">If you are unhappy with how we handle your data, you may contact the ICO:</p>
            <div className="mb-6 p-4 bg-brand-beige-light rounded-lg">
              <p className="mb-2"><strong>Information Commissioner's Office</strong></p>
              <p className="mb-2">Website: <a href="https://www.ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">https://www.ico.org.uk</a></p>
              <p>Phone: <a href="tel:03031231113" className="text-brand-green hover:underline">0303 123 1113</a></p>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Contact Us</h2>
            <p className="mb-4">If you have any questions about this Privacy Notice or your personal data, please contact:</p>
            <div className="p-4 bg-brand-beige-light rounded-lg">
              <p className="mb-2"><strong>Ellie's Oats</strong></p>
              <p className="mb-2">Email: <a href="mailto:elliesoats@hotmail.com" className="text-brand-green hover:underline">elliesoats@hotmail.com</a></p>
              <p>Phone: <a href="tel:07989785066" className="text-brand-green hover:underline">07989 785066</a></p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
