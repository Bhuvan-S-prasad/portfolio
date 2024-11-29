import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Brain, Rocket } from 'lucide-react';

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "web development",
      description: "Experienced in frontend technologies"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI & ML Specialist",
      description: "Focused on developing intelligent solutions"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Innovation Driven",
      description: "leveraging AI tool to increase effciency and productivity"
    }
  ];

  return (
    <section id="about" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-yellow-500 mb-4">About Me</h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            I am Bhuvan, a Computer Science and Artificial Intelligence student currently in my fifth semester. With a strong foundation in programming languages like Python, Java, C++, and JavaScript, I specialize in developing machine learning models and full-stack web applications. My education has equipped me with analytical problem-solving skills and a passion for innovation. In the future, I aim to contribute to groundbreaking advancements in AI and its applications in fields like healthcare, environmental sustainability, and forensic science. I am continually enhancing my skills in deep learning, data analysis, and model explainability, with a vision to build impactful solutions that address real-world challenges.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-6 bg-black/50 rounded-xl border border-yellow-500/20 hover:border-yellow-500/50 
                transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="text-yellow-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-yellow-500 mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}