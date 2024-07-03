import { Outlet } from "react-router-dom";
import Header from "./Header";

function Dashboard() {
    return (
        <>
            <div className="sticky top-0 z-50">
                <Header />
            </div>
            <div className="bg-white-100">
                <Outlet />
            </div>
        </>
    )
}
export default Dashboard;