import "./About.css";
import aboutImage from "../../assets/about-us.png";
import founderImage from "../../assets/marianne-founder.png";

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

          <div className="founder-content">
            <div className="founder-photo">
              <img
                src={founderImage}
                alt="Marianne, founder of Beyond Natural and Co"
              />
            </div>

            <div className="founder-text">
              <h2>Hi, I’m Marianne!</h2>

              <p>
                I’m Marianne, the founder of Beyond Natural & Co. I grew up in
                Larchmont, New York, before moving to Boston to attend
                Northeastern University, where I earned my bachelor’s degree
                in Health Science with a minor in Nutrition.
              </p>

              <p>
                Health and fitness have been a major part of my life for as
                long as I can remember. I began bodybuilding at 16 and went on
                to become a competitive bodybuilder, personal trainer, and
                nutrition coach. Through each of these experiences, I developed
                a genuine passion for understanding how the way we eat, move,
                and care for ourselves can support our overall health and
                well-being.
              </p>

              <p>
                Beyond Natural & Co. started with the help of my family and a
                simple idea: make nutritious, well-balanced food convenient,
                enjoyable, and accessible. I wanted to create the kinds of
                meals and snacks I personally love—fresh, satisfying foods made
                with ingredients that help you feel good, without making
                healthy eating feel restrictive or complicated.
              </p>

              <p>
                My passion for health has also led me to my next chapter:
                medical school. While that means you may not see me at Beyond
                Natural as often as I’d like, I will always be a part of what
                we do. Beyond Natural is a family business at its core, and it
                brings together so many things that are important to me—health,
                nutrition, fitness, family, and the community I grew up in.
              </p>

              <p>
                My hope is that Beyond Natural & Co. can make taking care of
                yourself just a little easier, one meal at a time. I’m so
                excited to share what my family and I have created with the
                community I’m proud to call home.
              </p>
            </div>
          </div>
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
