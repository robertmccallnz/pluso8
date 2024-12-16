import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface WorkflowNode {
  id: string;
  type: 'agent' | 'condition' | 'action';
  name: string;
  config: any;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
}

interface WorkflowBuilderProps {
  onSave: (workflow: { nodes: WorkflowNode[]; connections: WorkflowConnection[] }) => void;
}

const NODE_TYPES = {
  agent: {
    label: 'AI Agent',
    description: 'An AI agent that can perform tasks',
    icon: '🤖',
    templates: [
      { name: 'Chat Agent', capabilities: ['conversation'] },
      { name: 'Research Agent', capabilities: ['research', 'summarization'] },
      { name: 'Code Agent', capabilities: ['code_generation', 'code_review'] }
    ]
  },
  condition: {
    label: 'Condition',
    description: 'Add logic to your workflow',
    icon: '⚡',
    templates: [
      { name: 'Success Check', type: 'boolean' },
      { name: 'Quality Score', type: 'number' },
      { name: 'Content Filter', type: 'string' }
    ]
  },
  action: {
    label: 'Action',
    description: 'Perform a specific task',
    icon: '⚙️',
    templates: [
      { name: 'Send Email', type: 'notification' },
      { name: 'Save to Database', type: 'storage' },
      { name: 'Generate Report', type: 'document' }
    ]
  }
};

const DraggableNode: React.FC<{
  node: WorkflowNode;
  onMove: (id: string, position: { x: number; y: number }) => void;
}> = ({ node, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'node',
    item: { id: node.id, type: node.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        opacity: isDragging ? 0.5 : 1
      }}
      className="bg-white rounded-lg shadow-lg p-4 cursor-move"
    >
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{NODE_TYPES[node.type].icon}</span>
        <div>
          <h3 className="font-medium">{node.name}</h3>
          <p className="text-sm text-gray-500">{NODE_TYPES[node.type].label}</p>
        </div>
      </div>
    </div>
  );
};

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ onSave }) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  const handleDrop = (item: any, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type: item.type,
      name: `New ${NODE_TYPES[item.type].label}`,
      config: {},
      position
    };
    setNodes([...nodes, newNode]);
  };

  const handleNodeMove = (id: string, position: { x: number; y: number }) => {
    setNodes(nodes.map(node =>
      node.id === id ? { ...node, position } : node
    ));
  };

  const NodePalette: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64">
      <h2 className="text-lg font-medium mb-4">Components</h2>
      <div className="space-y-4">
        {Object.entries(NODE_TYPES).map(([type, info]) => (
          <div
            key={type}
            className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('node_type', type);
            }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{info.icon}</span>
              <div>
                <h3 className="font-medium">{info.label}</h3>
                <p className="text-sm text-gray-500">{info.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ConfigPanel: React.FC = () => {
    if (!selectedNode) return null;

    const templates = NODE_TYPES[selectedNode.type].templates;

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-64">
        <h2 className="text-lg font-medium mb-4">Configure {selectedNode.name}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={selectedNode.name}
              onChange={(e) => {
                setNodes(nodes.map(node =>
                  node.id === selectedNode.id
                    ? { ...node, name: e.target.value }
                    : node
                ));
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Template
            </label>
            <select
              value={selectedNode.config.template}
              onChange={(e) => {
                setNodes(nodes.map(node =>
                  node.id === selectedNode.id
                    ? {
                        ...node,
                        config: { ...node.config, template: e.target.value }
                      }
                    : node
                ));
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select a template</option>
              {templates.map((template, index) => (
                <option key={index} value={template.name}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        {/* Left Sidebar - Component Palette */}
        <div className="w-64 border-r p-4">
          <NodePalette />
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative p-4">
          {nodes.map(node => (
            <DraggableNode
              key={node.id}
              node={node}
              onMove={handleNodeMove}
            />
          ))}
        </div>

        {/* Right Sidebar - Configuration */}
        <div className="w-64 border-l p-4">
          <ConfigPanel />
        </div>

        {/* Save Button */}
        <button
          onClick={() => onSave({ nodes, connections })}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700"
        >
          Save Workflow
        </button>
      </div>
    </DndProvider>
  );
};
