import Puzzle from "./component/Puzzle";
import bgImage from './assets/bg-image.svg'

const App = () => {
  return (
    <section
      className="bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className={`h-screen flex justify-center pt-20`}>
        <Puzzle />
      </div>
    </section>
  );
};

export default App;
