import { useEffect, useState } from 'react';
import ProjectApi from '../api/projectApi'
import { useNavigate } from 'react-router-dom';
import { Story } from '../api/projectApi';
import { Auth } from "../api/Auth";

function StoryAdd() {

    const navigate = useNavigate()

    const auth = new Auth()
    const user = auth.GetActiveUser()
    // const activeProject = ProjectApi.getActiveProject()

    const [activeProject, setActiveProject] = useState<{ id: number } | null>(null)  /////////////////////////
    const [name,setName]=useState('')
    const [desc,setDesc]=useState('')
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
    const [status, setStatus] = useState<'todo' | 'doing' | 'done'>('todo');

    useEffect(()=>{
        const fetchActiveProject = async () => {
            const activeProject = await ProjectApi.getActiveProject()
            setActiveProject(activeProject)
        }
        fetchActiveProject()
    },[])

    function addStory() {
        const validateForm = () => name.trim() !== '' && desc.trim() !== '' && priority.trim() !== '' && status.trim() !== '';

        if (!validateForm()) {
            alert('Please fill in all fields')
            return
        }

        const story: Story = {
            id: Date.now(),
            name: name,
            desc: desc,
            priority: priority as "low" | "medium" | "high",
            project_id: activeProject!.id,
            date: new Date().toISOString(),
            status: status as 'todo' | 'doing' | 'done',
            owner: user.id
        }

        ProjectApi.addStory(story)
        navigate('/stories')
    }

    if (!activeProject) {
        return <h1>You have no active project!</h1>;
    }

    return (
        <>
                <div>
                    <p className='mb-4 text-3xl'>Add story</p>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" className='block' required onChange={(e)=>setName(e.target.value)}/>
                    <label htmlFor="desc">Description:</label>
                    <textarea name="desc" id="desc" className='block' required onChange={(e)=>setDesc(e.target.value)}></textarea>
                    <label htmlFor="priority">Priority:</label>
                    <select name="priority" id="priority" className='block text-black bg-gray-200' required onChange={(e)=>setPriority(e.target.value as 'low' | 'medium' | 'high')}>
                        <option value="low">low</option>
                        <option value="medium">medium</option>
                        <option value="high">high</option>
                    </select>
                    <label htmlFor="status">Status:</label>
                    <select name="status" id="status" className='block text-black bg-gray-200' required onChange={(e)=>setStatus(e.target.value as 'todo' | 'doing' | 'done')}>
                        <option value="todo">todo</option>
                        <option value="doing">doing</option>
                        <option value="done">done</option>
                    </select>
                    <button type="button" className='mt-3' onClick={addStory}>Add story</button>
                </div>
        </>
    );
}

export default StoryAdd;