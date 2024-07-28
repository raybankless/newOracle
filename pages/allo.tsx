// pages/allo.tsx
import Sidebar from "../components/Sidebar";
import AlloInteraction from "../components/AlloInteraction";

const AlloPage = () => {
  return (
    <div>
      <Sidebar />
      <main>
        <h1>Allo Interaction</h1>
        <AlloInteraction />
      </main>
    </div>
  );
};

export default AlloPage;
