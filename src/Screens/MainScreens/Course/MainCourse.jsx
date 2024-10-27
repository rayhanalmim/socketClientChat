// import { EntityProvider } from "@antopolis/admin-component-library/dist/hooks.cjs"
import { EntityProvider } from "@antopolis/admin-component-library/dist/hooks.cjs"
import Course from "./Course"

function MainCourse() {
    return (
        <EntityProvider>
            <Course />
        </EntityProvider>

    )
}

export default MainCourse