import React from 'react'
 
const aiToolsList=[
    {
        name:'Career ChatBot',
        desc:'Chat with AI Agent',
        icon:'/chatbot.png',
        button:'Lets Chat',
        path:'/ai-chat'
    },
    {
        name:'AI Resume Analyzer',
        desc:'Improve your resume',
        icon:'/resume.png',
        button:'Analyze',
        path:'/ai-resume-analyzer'
    },
    {
        name:'Career Roadmap Generator',
        desc:'Build your roadmap',
        icon:'/roadmap.png',
        button:'Generate Now',
        path:'/career-roadmap-generator'
    },
    {
        name:'Cover Letter Generator',
        desc:'Write a cover letter',
        icon:'/cover.png',
        button:'Create Now',
        path:'/cover-letter-generator'
    }
]
function AITools(){
    return(
        <div className='mt-7 p-5 bg-white border rounded-xl'>
            <h2 className='font-bold text-lg'>Available AI Tools</h2>
            <p>Start Building and Shape Your Career with this exclusive AI Tools</p>

            <div>
                {aiToolsList.map((tool:any,index) => (
                    <AIToolCard tool={tool} key={index}/>
                ))}
            </div>
        </div>
    )
}
export default AITools;