
import { useState, useEffect } from 'preact/hooks';
import AgentCreationCard from "../islands/AgentCreationCard.tsx";


const Dashboard = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    // Fetch agents from API or database
    const fetchAgents = async () => {
      // TO DO: Implement API or database call to fetch agents
      const agents = []; // Replace with actual data
      setAgents(agents);
    };
    fetchAgents();
  }, []);

  const handleAgentSelection = (agent) => {
    setSelectedAgent(agent);
  };

  return (
    <div class="p-4 bg-white rounded-lg shadow">
      <h1 class="text-3xl font-bold mb-4">PluSO Dashboard</h1>
      <div class="grid grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-xl font-bold mb-2">{agent.name}</h2>
            <p class="text-sm font-medium mb-4">{agent.description}</p>
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => handleAgentSelection(agent)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
      {selectedAgent && (
        <AgentCreationCard agent={selectedAgent} />
      )}
    </div>
  );
};

export default Dashboard;
