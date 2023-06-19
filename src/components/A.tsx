import { useEffect } from "react"

const A: React.FC = () => {
    useEffect(() => {
        console.log('mountin of A');
        return () => console.log('unmountin of A');
        
    })
    return <p style={{ fontSize: "2em", fontWeight: 'bold'}}>Component A</p>
}

export default A