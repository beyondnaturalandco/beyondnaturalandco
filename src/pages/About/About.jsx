import "./About.css";
import aboutImage from "../../assets/about-us.png";

const About = () => {
  return (
    <main className="about-page">
      <section className="about-banner">
        <img
          src={aboutImage}
          alt="About Beyond Natural and Co"
        />
      </section>

      <section className="about-information">
        <article className="founder-section">
          <h1>Meet Our Founder</h1>

          <p>
            Marianne is the founder of Beyond Natural & Co. Raised in
            Larchmont, New York, she earned a bachelor’s degree in Health
            Science with a minor in Nutrition from Northeastern University.
          </p>

          <p>
            Her experience as a competitive bodybuilder, personal trainer,
            and nutrition coach developed her passion for helping others
            improve their health through nutrition and sustainable habits.
          </p>
        </article>

        <div className="mission-vision">
          <article>
            <h2>Our Mission</h2>

            <p>
              Our mission is to provide fresh, nutritious, and flavorful food
              that makes healthy eating simple, convenient, and enjoyable.
            </p>
          </article>

          <article>
            <h2>Our Vision</h2>

            <p>
              Our vision is to become a trusted destination for wholesome food
              while inspiring our community to build healthier and more
              sustainable lifestyles.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default About;
