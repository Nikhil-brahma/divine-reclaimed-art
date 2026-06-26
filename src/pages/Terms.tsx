import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Terms & Conditions — Punarvsu purchase agreement"
        description="The terms that govern browsing punarvsu.com and ordering our handcrafted upcycled temple-textile potlis and accessories."
      />
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground text-sm mb-12">Last updated: April 8, 2026</p>

          <div className="prose-custom space-y-8 font-body text-foreground/80 leading-relaxed text-sm">
            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Overview</h2>
              <p>
                This website is operated by Punarvsu. Throughout the site, the terms "we," "us," and "our" refer to Punarvsu. We offer this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
              </p>
              <p className="mt-4">
                By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions. Please read these Terms & Conditions carefully before accessing or using our website.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Online Store Terms</h2>
              <p>
                By agreeing to these Terms & Conditions, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose, nor may you violate any laws in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Products & Services</h2>
              <p>
                All products are handcrafted from retired temple textiles and are therefore one-of-a-kind. Colours, textures, and patterns may vary slightly from what is shown on the website due to photography, screen settings, and the unique nature of upcycled fabrics. These variations are a hallmark of authenticity, not a defect.
              </p>
              <p className="mt-4">
                We reserve the right to limit quantities of any product or service. All descriptions of products and pricing are subject to change at any time without notice. We reserve the right to discontinue any product at any time.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">All Sales Are Final — No Returns or Exchanges</h2>
              <p>
                Because every Punarvsu product is a unique, one-of-a-kind creation made from retired sacred textiles, <strong className="text-foreground">all sales are final</strong>. We do not accept returns, exchanges, or refunds under any circumstances.
              </p>
              <p className="mt-4">
                We encourage you to review product descriptions, dimensions, and photographs carefully before purchasing. If you have any questions about a specific item, please{" "}
                <Link to="/contact" className="text-gold hover:underline">contact us</Link>{" "}
                before placing your order.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Pricing & Payment</h2>
              <p>
                All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices without prior notice. Payment is processed securely through Shopify's payment gateway.
              </p>
              <p className="mt-4">
                Orders above <strong className="text-foreground">₹2,999</strong> qualify for free shipping within India. For orders below this threshold, standard shipping charges will apply at checkout.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Accuracy of Information</h2>
              <p>
                We are not responsible if information made available on this site is not accurate, complete, or current. The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Intellectual Property</h2>
              <p>
                All content on this website — including text, graphics, logos, images, product designs, and software — is the property of Punarvsu and is protected by Indian and international copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">User Comments & Submissions</h2>
              <p>
                If you send us creative ideas, suggestions, or materials, you agree that we may use, edit, or publish them without restriction or compensation. We are under no obligation to maintain any comments in confidence or respond to them.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites that are not owned or controlled by Punarvsu. We are not responsible for the content, privacy policies, or practices of any third-party sites. We encourage you to review the terms and privacy policies of any third-party site you visit.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Limitation of Liability</h2>
              <p>
                In no case shall Punarvsu, our directors, officers, employees, or agents be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind arising out of your use of the Service or any product purchased using the Service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Governing Law</h2>
              <p>
                These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Delhi, India.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Changes to Terms</h2>
              <p>
                We reserve the right to update or modify these Terms & Conditions at any time. Changes will be posted on this page with an updated date. Your continued use of the website after any changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Contact</h2>
              <p className="mb-2">Questions about these Terms & Conditions can be directed to:</p>
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                <a href="mailto:nikhilrawat508@gmail.com" className="text-gold hover:underline">nikhilrawat508@gmail.com</a>
              </p>
              <p>
                <strong className="text-foreground">Address:</strong> Maharana Pratap Community Centre, Sector-9, Rohini, Delhi Kender Rajapur Sec-9, New Delhi, DL, 110085, IN
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
