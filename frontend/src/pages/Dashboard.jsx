import { useAuth } from "../context/AuthContext.jsx";

import UserDashboard from "../Dashboard/UserDashboard.jsx";
import SellerDashboard from "../Dashboard/SellerDashboard.jsx";

const Dashboard = () => {

    const { user } = useAuth();

    if (!user) {
        return null;
    }

    if (user.role === "seller") {
        return <SellerDashboard />;
    }

    return <UserDashboard />;
};

export default Dashboard;