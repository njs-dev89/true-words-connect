import Footer from "../components/LandingPage/Footer";

function CookiePolicyPage() {
  return (
    <>
      <div className="bg-light-blue min-h-screen flex items-center">
        <div className="container mt-32">
          <div className="max-w-3xl mx-auto shadow-xl bg-white p-8 rounded-xl">
            <h1 className="font-bold text-3xl mb-8">Cookie Policy</h1>
            <p className="leading-7 mb-4">
              We use cookies to help improve your experience of our website at
              https://www.langways.io/. This cookie policy is part of Langways'
              privacy policy. It covers the use of cookies between your device
              and our site.
            </p>{" "}
            <p className="leading-7 mb-4">
              We also provide basic information on third-party services we may
              use, who may also use cookies as part of their service. This
              policy does not cover their cookies.
            </p>{" "}
            <p className="leading-7 mb-4">
              If you don&apos;t wish to accept cookies from us, you should
              instruct your browser to refuse cookies from
              https://www.langways.io/. In such a case, we may be unable to
              provide you with some of your desired content and services.
            </p>
            <h2 className="font-bold text-2xl mb-6">What is a cookie?</h2>
            <p className="leading-7 mb-4">
              A cookie is a small piece of data that a website stores on your
              device when you visit. It typically contains information about the
              website itself, a unique identifier that allows the site to
              recognize your web browser when you return, additional data that
              serves the cookie&apos;s purpose, and the lifespan of the cookie
              itself.
            </p>{" "}
            <p className="leading-7 mb-4">
              Cookies are used to enable certain features (e.g. logging in),
              track site usage (e.g. analytics), store your user settings (e.g.
              time zone, notification preferences), and to personalize your
              content (e.g. advertising, language).
            </p>{" "}
            <p className="leading-7 mb-4">
              Cookies set by the website you are visiting are usually referred
              to as first-party cookies. They typically only track your activity
              on that particular site.
            </p>{" "}
            <p className="leading-7 mb-4">
              Cookies set by other sites and companies (i.e. third parties) are
              called third-party cookies They can be used to track you on other
              websites that use the same third-party service.
            </p>
            <h2 className="font-bold text-2xl mb-6">
              Types of cookies and how we use them
            </h2>
            <h3 className="font-semibold text-xl mb-6">Essential cookies</h3>
            <p className="leading-7 mb-4">
              Essential cookies are crucial to your experience of a website,
              enabling core features like user logins, account management,
              shopping carts, and payment processing.
            </p>{" "}
            <p className="leading-7 mb-4">
              We use essential cookies to enable certain functions on our
              website.
            </p>
            <h3 className="font-semibold text-xl mb-6">Performance cookies</h3>
            <p className="leading-7 mb-4">
              Performance cookies track how you use a website during your visit.
              Typically, this information is anonymous and aggregated, with
              information tracked across all site users. They help companies
              understand visitor usage patterns, identify and diagnose problems
              or errors their users may encounter, and make better strategic
              decisions in improving their audience&apos;s overall website
              experience. These cookies may be set by the website you&apos;re
              visiting (first-party) or by third-party services. They do not
              collect personal information about you.
            </p>{" "}
            <p className="leading-7 mb-4">
              We use performance cookies on our site.
            </p>
            <h3 className="font-semibold text-xl mb-6">
              Functionality cookies
            </h3>{" "}
            <p className="leading-7 mb-4">
              Functionality cookies are used to collect information about your
              device and any settings you may configure on the website
              you&apos;re visiting (like language and time zone settings). With
              this information, websites can provide you with customized,
              enhanced, or optimized content and services. These cookies may be
              set by the website you&apos;re visiting (first-party) or by
              third-party services.
            </p>{" "}
            <p className="leading-7 mb-4">
              We use functionality cookies for selected features on our site.
            </p>
            <h3 className="font-semibold text-xl mb-6">
              Targeting/advertising cookies
            </h3>{" "}
            <p className="leading-7 mb-4">
              Targeting/advertising cookies help determine what promotional
              content is most relevant and appropriate to you and your
              interests. Websites may use them to deliver targeted advertising
              or limit the number of times you see an advertisement. This helps
              companies improve the effectiveness of their campaigns and the
              quality of content presented to you. These cookies may be set by
              the website you&apos;re visiting (first-party) or by third-party
              services. Targeting/advertising cookies set by third-parties may
              be used to track you on other websites that use the same
              third-party service.
            </p>
            <p className="leading-7 mb-4">
              {" "}
              We use targeting/advertising cookies on our site.
            </p>{" "}
            <h2 className="font-bold text-2xl mb-6">Contact Us</h2>{" "}
            <p className="leading-7 mb-4">
              For any questions or concerns regarding cookie policy, you may
              contact us using the following details: contact@langways.io
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CookiePolicyPage;