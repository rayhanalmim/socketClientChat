import { Sidebar } from "@antopolis/admin-component-library/src/Layouts/Layouts"
import Test from "./Test/Test"
import { links } from "./routes/sideLinks"

function App() {
  return (
    <div className='flex bg-[#262626] h-dvh'>
      <Sidebar links={links}/>
      <div className='flex-1 m-3 bg-[#171717] rounded-xl overflow-y-auto md:mt-3 mt-20'>
        <Test />
      </div>
    </div>
  )
}

export default App