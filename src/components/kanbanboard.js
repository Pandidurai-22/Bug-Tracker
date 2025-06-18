// src/components/KanbanBoard.js
import React from 'react';
import BugCard from './BugCard';

const sampleBugs = [
  { id: 1, title: "Login page error", description: "Fails on Safari", status: "To Do", priority: "High", assignee: "Alice" },
  { id: 2, title: "Navbar bug", description: "Overflows on small screens", status: "In Progress", priority: "Medium", assignee: "Bob" },
  { id: 3, title: "Signup form validation", description: "Regex check broken", status: "Code Review", priority: "Low", assignee: "Charlie" },
  { id: 4, title: "API crash on PUT", description: "Backend throws 500", status: "Done", priority: "Critical", assignee: "DevOps" },
];

const statuses = ["To Do", "In Progress", "Code Review", "Done"];

const KanbanBoard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statuses.map((status) => (
        <div key={status} className="bg-gray-100 p-3 rounded">
          <h2 className="font-semibold mb-3 text-center">{status}</h2>
          {sampleBugs
            .filter((bug) => bug.status === status)
            .map((bug) => (
              <BugCard key={bug.id} bug={bug} />
            ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
