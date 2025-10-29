// --- IMPORT GAMBAR (pastikan nama file persis seperti di folder kamu) ---
import imgPortfolio from "../images/projectPhotos/AndySaputraPortofolio.png";
import imgExplore   from "../images/projectPhotos/ExploreId.png";
import imgDiabety   from "../images/projectPhotos/DiebetyAi.png";
import imgScolio    from "../images/projectPhotos/ScolioCheck.png";
import imgAsphalt   from "../images/projectPhotos/Asphalt9Rejend.png";

export type Project = {
  id: string;
  title: string;
  tag: string;
  stack: string;
  link: string;
  image?: string;
  description: string;
};

export const projects: Project[] = [
  {
    id: "portfolio",
    title: "AndySaputraPortofolio",
    tag: "Personal Project",
    stack: "React.js · TypeScript · OpenAI API",
    link: "https://andysaputraportofolio.vercel.app",
    image: imgPortfolio,
    description:
      "AndySaputraPortofolio is a React. js-based personal website deployed on Vercel. It showcases profile details, skills, experiences, contact info, and a downloadable CV. Integrated with an OpenAI-powered chatbot, the platform highlights technical proficiency, deployment skills, creativity, interactive design, adaptability, innovation, problem-solving, modern UI, and continuous learning."
  },
  {
    id: "exploreid",
    title: "Explore ID",
    tag: "University Project",
    stack: "React.js · SQL",
    link: "https://exploreid-one.vercel.app/",
    image: imgExplore,
    description:
      "I built a travel discovery web platform using React.js and SQL database integration, developed collaboratively under Scrum Agile methodology with clear task divisions across sprints and weekly stand-up reviews. This iterative workflow improved team efficiency, ensured continuous feature testing, and resulted in optimized search performance and responsive UI/UX design. The platform enables users to explore destinations easily while promoting local tourism engagement and showcasing practical teamwork and adaptability in real-world project execution."
  },
  {
    id: "diabetes",
    title: "Diebety AI Predict",
    tag: "University Project",
    stack: "Machine Learning",
    link: "https://kyhr-app.streamlit.app",
    image: imgDiabety,
    description:
      "The AI Diabetes Risk Predictor is a web-based application that utilises machine learning algorithms—logistic Regression, Random Forest, and XGBoost—integrated with preprocessing, SHAP-based feature selection, and Streamlit deployment to predict the risk of diabetes based on health indicators and enhance early disease detection."
  },
  {
    id: "scolio",
    title: "SkolioCheck",
    tag: "University Project",
    stack: "Deep Learning · Figma",
    link: "https://github.com/Andysaputra1/Scoliovis",
    image: imgScolio,
    description:
      "Our team utilises deep learning, specifically a CNN-based VGG16 model, to develop a model capable of detecting scoliosis using X-ray images."
  },
  {
    id: "asphalt",
    title: "ASPHALT 9: REJENDS",
    tag: "University Project",
    stack: "HTML · CSS · JavaScript",
    link: "https://andysaputra1.github.io/Asphalt",
    image: imgAsphalt,
    description:
      "My technical skills in web development are a testament to my ability to handle complex tasks. I have been assigned to develop a website, handling all back-end and front-end preparations using Figma, JavaScript, CSS, and HTML."
  }
];
