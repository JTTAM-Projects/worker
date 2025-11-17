import type { Task } from "../types";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <section className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      {/* Task Count */}
      <div className="mb-4 text-gray-600 max-w-4xl mx-auto">
        {tasks.length > 0 ? <span>Näytetään {tasks.length} tehtävää</span> : <span>Ei tehtäviä näytettävänä</span>}
      </div>

      {/* Task List */}
      <div className="space-y-4 mb-6 max-w-4xl mx-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
