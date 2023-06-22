import { useEffect } from "react";
import LifeGame from "./components/LifeGame";
import { useDispatch } from "react-redux";
import { sizeActions } from './components/redux/slices/cellSizeSlice'
import { directionActions } from "./components/redux/slices/flexDirectionSlice";
import Lifes from "./components/Lifes";

const App: React.FC = () => {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    window.addEventListener('resize', () => {
      dispatch(sizeActions.setSize()) // место где отслеживается изменение
      dispatch(directionActions.setDirection())
    })
  }, [])

  return (<div>
    <Lifes />
  </div>)

}
export default App;