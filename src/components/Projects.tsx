import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'Advanced brain tumor detection using ensemble of deep learning models with explainable AI visualization',
    description: 'An ensemble deep learning approach for brain tumor detection and classification using multiple state-of-the-art convolutional neural networks with explainable AI techniques',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80',
    github: 'https://github.com/Bhuvan-S-prasad/',
    live: '#',
    tags: ['Python', 'CNN', 'XAI', 'Medical Imaging', 'PyTorch']
  },
  {
    title: 'Bird Image Classification',
    description: 'Developed a sophisticated bird species classification system using CNN ResNet50 architecture. The model can identify various bird species with high accuracy, leveraging transfer learning and fine-tuning techniques.',
    image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&q=80',
    github: 'https://github.com/Bhuvan-S-prasad/Mini_project',
    live: '#',
    tags: ['Python', 'pytorch', 'ResNet50', 'CNN', 'Deep Learning']
  },
  {
    title: 'Customer Churn Analysis',
    description: 'Comprehensive analysis of customer churn using multiple ML models including Logistic Regression, Random Forest, SVM, and Neural Networks. conducted detailed EDA.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
    github: 'https://github.com/Bhuvan-S-prasad/Customer-Churn-Analysis-and-Model-Comparison',
    live: '#',
    tags: ['Python', 'Scikit-Learn', 'EDA', 'Machine Learning', 'Neural Networks', 'Random Forest']
  },
  {
    title: 'Plant Disease Detection',
    description: 'Created an advanced plant disease detection system using Convolutional Neural Networks. This system helps farmers identify plant diseases early, enabling timely intervention and crop protection.',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80',
    github: 'https://github.com/Bhuvan-S-prasad/Plant-Disease-Detection-AI',
    live: '#',
    tags: ['Python', 'CNN', 'OpenCV', 'Deep Learning']
  },
  {
    title: 'Alzheimer\'s Disease Diagnosis prediction',
    description: 'random forest classifier for Alzheimer\'s Disease Diagnosis prediction using MLops and MLflow',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80',
    github: 'https://github.com/Bhuvan-S-prasad/-Alzheimer-Diagnosis', 
    live: '#',
    tags: ['Python', 'Random Forest', 'Scikit-Learn',"MLops","MLflow"]
  },
  {
    title: 'sentiment analysis of tweets',
    description: 'A real-time sentiment analysis platform leveraging deep learning and NLP techniques to classify text into multiple sentiment categories.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
    github: 'https://github.com/Bhuvan-S-prasad/sentiment-analysis', 
    live: '#',
    tags: ['Python', 'distilbert-base-uncased', 'Scikit-Learn',"NLP","pytorch","transformers"]
  }
];



export default function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="projects" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">Projects</h2>
          <p className="text-xl text-gray-300">Some of my recent work</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-black/50 rounded-xl shadow-lg overflow-hidden border border-primary/20 hover:border-primary/50 transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-primary mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4 text-justify">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-start mt-auto">
                  <a
                    href={project.github}
                    className="flex items-center text-gray-300 hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}