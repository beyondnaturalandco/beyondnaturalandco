import "./AboutMe.css";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { assets } from '../../assets/assets'
const AboutMe = () => {
    const [ref, inView] = useInView({
        triggerOnce: true, // Para activar la animación una vez cuando entre en la vista
        threshold: 0.5, // Porcentaje de visibilidad para activar la detección
    });
    return (
        <div ref={ref} className={`about_me ${inView ? "visible" : ""}`} id="about_me">
            <motion.div className="about_me_all" initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5 }}>
                <h2>All About us</h2>
                <p>Beyond Natural and Co is a family-owned business dedicated to cultivating a genuine love for nourishing foods that power your body. Clean eating is about learning to love the food you eat and the way it fuels you. We believe this approach leads to sustainable lifestyle changes.</p>
            </motion.div>
            <motion.div className="about_our" initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5 }}>
                <div className="about_our_story">
                    <h2>Our Story</h2>
                    <p>The story of Beyond Natural and Co began with a simple idea: to create a family-owned business dedicated to cultivating a genuine love for nourishing foods that power your body. From the very beginning, clean eating has been about learning to love the food you eat and the way it fuels you. This belief has guided us towards promoting sustainable lifestyle changes. Our journey has led us to offer a diverse range of options, whether your goal is weight loss, overall health improvement, or enhancing fitness. We prioritize quality by focusing on organic produce and well-balanced macro-friendly meals. Our vibrant salads, hearty grain bowls, and customizable options are designed to make healthy eating enjoyable and stress-free. We’ve extended our offerings to include convenient, nutritious snacks and breakfast choices, as well as delightful sweet and savory crepes. Our mission remains unchanged: to bridge the gap between fast, convenient food and wholesome nourishment.</p>
                </div>
                <div className="about_our_image">
                    <img src={assets.logo} alt="logos" />
                </div>
            </motion.div>

        </div>
    );
}
export default AboutMe;
