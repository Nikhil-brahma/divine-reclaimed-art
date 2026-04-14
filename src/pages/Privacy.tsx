import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Privacy Policy"
        description="Read Punarvsu's Privacy Policy to understand how we collect, use, and protect your personal information."
      />
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mb-12">Last updated: April 8, 2026</p>

          <div className="prose-custom space-y-8 font-body text-foreground/80 leading-relaxed text-sm">
            <p>
              Punarvsu operates this store and website, including all related information, content, features, tools, products and services, in order to provide you, the customer, with a curated shopping experience (the "Services"). Punarvsu is powered by Shopify, which enables us to provide the Services to you.
            </p>
            <p>
              This Privacy Policy describes how we collect, use, and disclose your personal information when you visit, use, or make a purchase or other transaction using the Services or otherwise communicate with us. If there is a conflict between our Terms of Service and this Privacy Policy, this Privacy Policy controls with respect to the collection, processing, and disclosure of your personal information.
            </p>
            <p>
              Please read this Privacy Policy carefully. By using and accessing any of the Services, you acknowledge that you have read this Privacy Policy and understand the collection, use, and disclosure of your information as described in this Privacy Policy.
            </p>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Personal Information We Collect or Process</h2>
              <p className="mb-4">
                When we use the term "personal information," we are referring to information that identifies or can reasonably be linked to you or another person. We may collect or process the following categories of personal information:
              </p>
              <ul className="list-disc list-inside space-y-3 pl-2">
                <li><strong className="text-ivory">Contact details:</strong> Name, billing address, shipping address, phone number, and email address.</li>
                <li><strong className="text-ivory">Financial information:</strong> Payment card information, transaction details, and payment confirmation.</li>
                <li><strong className="text-ivory">Account information:</strong> Username, password, security questions, and preferences.</li>
                <li><strong className="text-ivory">Transaction information:</strong> Items you view, put in your cart, or purchase. Note: Because our products are one-of-a-kind, unique creations, all sales are final and we do not accept returns or exchanges. We collect transaction data strictly to fulfill your order and manage business records.</li>
                <li><strong className="text-ivory">Communications:</strong> Information included in communications with us, such as customer support inquiries.</li>
                <li><strong className="text-ivory">Device & Usage information:</strong> IP address, browser type, and interaction data regarding how you navigate the Services.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">How We Use Your Personal Information</h2>
              <p className="mb-4">Depending on how you interact with us, we may use personal information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-3 pl-2">
                <li><strong className="text-ivory">Provide, Tailor, and Improve the Services:</strong> We use your information to perform our contract with you, process payments, fulfill orders, arrange shipping, and create a customized shopping experience.</li>
                <li><strong className="text-ivory">Marketing and Advertising:</strong> To send promotional communications and show online advertisements for products based on your activity.</li>
                <li><strong className="text-ivory">Security and Fraud Prevention:</strong> To authenticate your account, provide a secure payment experience, and detect illegal or fraudulent activity.</li>
                <li><strong className="text-ivory">Communicating with You:</strong> To provide customer support and maintain our business relationship with you.</li>
                <li><strong className="text-ivory">Legal Reasons:</strong> To comply with applicable laws or respond to valid legal processes.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Relationship with Shopify</h2>
              <p>
                The Services are hosted by Shopify. Shopify collects and processes personal information about your access to and use of the Services in order to provide and improve the Services. Information you submit will be shared with Shopify and may be stored in countries other than where you reside. To learn more, visit the{" "}
                <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  Shopify Consumer Privacy Policy
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Security and Retention</h2>
              <p>
                Please be aware that no security measures are perfect. We cannot guarantee "perfect security," and any information you send may not be secure while in transit. We retain your personal information based on business necessity, such as maintaining your account, providing Services, or complying with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Children's Data</h2>
              <p>The Services are not intended for children. We do not knowingly collect personal information from individuals under the age of majority.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Your Rights and Choices</h2>
              <p>
                Depending on your location, you may have rights to access, delete, or correct your personal information. You may also opt out of promotional emails at any time by using the "unsubscribe" link. We will not discriminate against you for exercising these rights.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">International Transfers</h2>
              <p>
                We may transfer, store, and process your personal information outside the country you live in. When transferring data from the EEA or UK, we rely on recognized transfer mechanisms like Standard Contractual Clauses.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes to our practices. We will post the revised version on this website and update the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Contact</h2>
              <p className="mb-2">
                Should you have any questions about our privacy practices or this Privacy Policy, or if you would like to exercise any of your rights, please contact us:
              </p>
              <p>
                <strong className="text-ivory">Email:</strong>{" "}
                <a href="mailto:nikhilrawat508@gmail.com" className="text-gold hover:underline">nikhilrawat508@gmail.com</a>
              </p>
              <p>
                <strong className="text-ivory">Address:</strong> Maharana Pratap Community Centre, Sector-9, Rohini, Delhi Kender Rajapur Sec-9, New Delhi, DL, 110085, IN
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
