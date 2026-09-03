import "./AboutMe.css";
import aboutUs from "../../assets/about-us.png";

const AboutMe = () => {
  return (
    <section className="about-banner" id="about_me">
      <img src={aboutUs} alt="About Beyond Natural and Co" />
    </section>
  );
};

export default AboutMe;
