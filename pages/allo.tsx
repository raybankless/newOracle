// pages/allo.tsx
import Sidebar from "../components/Sidebar";
import AlloContractInteraction from "../components/AlloInteraction";

const AlloPage = () => {
  return (
    <div>
      <Sidebar />
      <main>
        <h1>Allo Interaction</h1>
        <AlloContractInteraction />
      </main>
    </div>
  );
};

export default AlloPage;
