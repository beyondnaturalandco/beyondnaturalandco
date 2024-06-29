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
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam natus totam nemo laborum dolorum in est, illo nam, neque ipsam quidem corporis facere, quo doloribus! Commodi autem ex recusandae reprehenderit.</p>
            </motion.div>
            <motion.div className="about_our" initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5 }}>
                <div className="about_our_story">
                    <h2>Our Story</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil suscipit ab error, impedit eaque id? Sunt aliquid facere temporibus exercitationem ipsam dolore aliquam saepe magni perspiciatis. Excepturi, dolorem quam temporibus ex ipsa consequuntur quod aperiam, dolor error itaque autem voluptate nemo consectetur laborum officiis, molestias illum alias veniam. Perferendis, commodi.</p>
                </div>
                <div className="about_our_image">
                    <img src={assets.logo} alt="logos" />
                </div>
            </motion.div>

        </div>
    );
}
export default AboutMe;
