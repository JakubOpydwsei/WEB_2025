import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectListPage from './pages/ProjectListPage';
import ProjectAdd from './components/ProjectAdd';
import ProjectEdit from './components/ProjectEdit';

import StoryListPage from './pages/StoryListPage';
import StoryAdd from './components/StoryAdd';
import StoryEdit from './components/StoryEdit';

import TaskListPage from './pages/TaskListPage';
import TaskAdd from './components/TaskAdd';
import TaskEdit from './components/TaskEdit';

import Kanban from './components/Kanban';

function App() {
  return (
    <>
    <Router>
      <Routes>
        {/* Projects */}
        <Route path="/projects" element={<ProjectListPage />} />
        <Route path="/project/add" element={<ProjectAdd />} />
        <Route path="/project/edit/:projectId" element={<ProjectEdit />} />

        {/* Stories */}
        <Route path="/stories" element={<StoryListPage />} />
        <Route path="/story/add" element={<StoryAdd />} />
        <Route path="/story/edit/:storyId" element={<StoryEdit />} />

        {/* Tasks */}
        <Route path="/story/:storyId/tasks" element={<TaskListPage />} />
        <Route path="/story/:storyId/task/add" element={<TaskAdd />} />
        <Route path="/story/:storyId/task/edit/:taskId" element={<TaskEdit />} />

        {/* Kanban */}
        <Route path="/story/:storyId/kanban" element={<Kanban />} />
      </Routes>
    </Router>

    </>
  )
}

export default App
