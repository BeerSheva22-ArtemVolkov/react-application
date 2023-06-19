import { ReactNode, useState } from "react";
import Clocks from "./components/Clocks";
import InputResult from "./model/InputResult";
import A from "./components/A";
import Input from "./components/common/Input";

const components: Map<string, ReactNode> = new Map(
  [
    ['clocks', <Clocks></Clocks>],
    ['a', <A></A>]
  ]
)

const App: React.FC = () => {

  const [componentName, setComponentName] = useState<string>('')

  function submitFn(component: string): InputResult {
    const res: InputResult = { status: "error", message: `${component} doesn't exist` }
    if (components.has(component)){
      res.status = "success"
      res.message = ''
      setComponentName(component)
    }
    return res
  }
  return (
    <div>
      <Input submitFn={submitFn} placeholder={"enter"}></Input>
      {componentName && components.get(componentName)}
      {/* <Clocks /> */}
    </div>
  )

}
export default App;