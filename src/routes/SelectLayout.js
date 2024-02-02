import { Outlet } from "react-router-dom";
import MenuNavigation from "../components/MenuNavigation";

const SelectLayout = () => {
    return (
        <>
            <MenuNavigation/>
            <Outlet/>
        </>
    )
};

export default SelectLayout;