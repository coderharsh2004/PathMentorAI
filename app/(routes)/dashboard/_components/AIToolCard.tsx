import React from 'react'
import Image from 'next/image'
interface TOOL{
    name: string,
    desc: string,
    icon: string,
    button: string,
    path: string,

}
type AIToolProps={
    tool:TOOL
}
function AIToolCard({tool}: AIToolProps){
    return(
        <div>
            <Image src={tool.icon} width={50} height={50} alt={tool.name}/>
        </div>
    )
}
export default AIToolCard;