import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, CheckCircle2, Clock, AlertCircle, MoveRight, MoveLeft, User } from 'lucide-react';
import { Button } from '../ui/Button';

export const KanbanBoard = ({ project }) => {
  const { updateTaskStatus, addKanbanTask } = useData();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(project.studentLead || 'Rohan Sharma');
  const [showAddForm, setShowAddForm] = useState(false);

  const columns = [
    { id: 'todo', label: 'To Do / Backlog', color: 'border-jh-earth-300 bg-jh-earth-100/50', badgeColor: 'bg-jh-earth-200 text-jh-earth-800' },
    { id: 'in_progress', label: 'In Lab / Prototyping', color: 'border-blue-300 bg-blue-50/40', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'review', label: 'Faculty & Lab Review', color: 'border-purple-300 bg-purple-50/40', badgeColor: 'bg-purple-100 text-purple-800' },
    { id: 'done', label: 'Verified & Deployed', color: 'border-emerald-300 bg-emerald-50/40', badgeColor: 'bg-emerald-100 text-emerald-800' }
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    addKanbanTask(project.id, {
      title: newTaskTitle,
      assignee: newTaskAssignee,
      priority: 'high'
    });
    setNewTaskTitle('');
    setShowAddForm(false);
  };

  const moveTask = (taskId, currentStatus, direction) => {
    const order = ['todo', 'in_progress', 'review', 'done'];
    const currentIndex = order.indexOf(currentStatus);
    const nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < order.length) {
      updateTaskStatus(project.id, taskId, order[nextIndex]);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-jh-green-950">R&D Sprint Kanban Board</h3>
          <p className="text-xs text-jh-earth-600">Drag or advance milestones to update sprint velocity</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Close' : 'Add Research Task'}
        </Button>
      </div>

      {/* Add Task Quick Form */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="p-4 bg-white rounded-xl border border-jh-green-300 shadow-xs flex flex-wrap gap-3 items-center animate-in fade-in">
          <input
            type="text"
            required
            placeholder="New sprint task title (e.g. Conduct heavy metal titration lab test)..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 min-w-[240px] px-3 py-1.5 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jh-green-700"
          />
          <input
            type="text"
            placeholder="Assignee Name"
            value={newTaskAssignee}
            onChange={(e) => setNewTaskAssignee(e.target.value)}
            className="w-48 px-3 py-1.5 text-xs bg-jh-earth-50 border border-jh-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jh-green-700"
          />
          <Button type="submit" variant="secondary" size="sm">
            Add to Sprint
          </Button>
        </form>
      )}

      {/* 4 Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const tasksInCol = (project.kanbanTasks || []).filter(t => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`rounded-2xl border ${col.color} p-3.5 flex flex-col justify-between min-h-[420px]`}
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-jh-earth-200/60 mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-jh-green-950">
                    {col.label}
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                    {tasksInCol.length}
                  </span>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {tasksInCol.length === 0 ? (
                    <div className="p-6 text-center text-xs text-jh-earth-500 border border-dashed border-jh-earth-300 rounded-xl">
                      No tasks in this lane
                    </div>
                  ) : (
                    tasksInCol.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded-xl border border-jh-earth-200 p-3.5 shadow-2xs hover:shadow-jh-soft transition-all"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <span className="text-[9.5px] font-mono font-bold text-jh-earth-500 bg-jh-earth-100 px-1.5 py-0.5 rounded">
                            {task.id}
                          </span>
                          {task.priority && (
                            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {task.priority}
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-bold text-jh-charcoal line-clamp-3 mb-3">
                          {task.title}
                        </p>

                        <div className="pt-2 border-t border-jh-earth-100 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1 text-jh-earth-700 font-medium truncate max-w-[110px]">
                            <User className="w-3 h-3 text-jh-green-800" />
                            <span className="truncate">{task.assignee || 'Unassigned'}</span>
                          </div>

                          {/* Move arrows */}
                          <div className="flex items-center gap-1">
                            {col.id !== 'todo' && (
                              <button
                                onClick={() => moveTask(task.id, task.status, 'backward')}
                                className="p-1 rounded bg-jh-earth-100 hover:bg-jh-earth-200 text-jh-charcoal"
                                title="Move left"
                              >
                                <MoveLeft className="w-3 h-3" />
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button
                                onClick={() => moveTask(task.id, task.status, 'forward')}
                                className="p-1 rounded bg-jh-green-900 text-white hover:bg-jh-green-800"
                                title="Advance task"
                              >
                                <MoveRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 text-[10px] text-jh-earth-500 text-center">
                {col.id === 'done' ? '✓ Completed' : '→ Drag or click arrows'}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
