import ProjectApi, { Project } from "../api/projectApi";
import { useNavigate } from 'react-router-dom';
import ProjectTile from "../components/ProjectTile";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function ProjectListPage() {

    const navigate = useNavigate()

    const {user} = useAuth()
    const [activeProject,setActiveProject] = useState <Project | null> (null)
    const [projects, setProjects] = useState <Project[] | null> (null)

    useEffect(() => {
        const fetchActiveProj = async() =>{
            const activeProj = ProjectApi.getActiveProject()
            setActiveProject(await activeProj)
        }
        fetchActiveProj()

        const fetchProjs = async() =>{
            const projects = ProjectApi.getProjects()
            setProjects(await projects)
        }
        fetchProjs()
    },[])

    function unactiveProject(): void {
        ProjectApi.unactiveProject()
        setActiveProject(null)
        navigate('/projects')
    }

    if (!projects) {
        return
    }

    return (
        <>
        {user && <p className='mb-4 text-3xl'>Logged in as: {user?.name} {user?.surname}</p>}
        { !user && <p className='mb-4 text-3xl'>Youre not loggined in</p>}
        <hr />
        {activeProject !== null ? (
            <div>
                <h1>Active project: {activeProject.name}</h1>
                <button onClick={() => unactiveProject()}>Change active project !</button>
            </div>
        ) : (
            <div>
            <p className='mb-4 text-3xl'>List of projects</p>
            <ul>
                {projects.map(p => (
                <ProjectTile key={p.id} project={p} />
                ))}
            </ul>
            </div>
        )}
        </>
    );
}

export default ProjectListPage;