
import {useSelector} from "react-redux"
import { Navigate, Outlet } from "react-router-dom";
function AdminProtectedRoute() {
    const { currentUser } = useSelector(state => state.user);
    return (
        <>
            {currentUser.isAdmin ? <Outlet/> : <Navigate to="/signin"/>}
        </>
    )
}
export default AdminProtectedRoute;