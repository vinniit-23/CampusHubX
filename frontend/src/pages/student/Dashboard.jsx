import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth"; // 👈 1. IMPORT THIS
import { studentsApi } from "../../services/api/students";
import { matchingApi } from "../../services/api/matching";
import Card from "../../components/common/Card/Card";
import Spinner from "../../components/common/Spinner/Spinner";
import { HiBriefcase, HiClipboardCheck, HiStar, HiUser } from "react-icons/hi";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { getMatchScoreColor } from "../../utils/helpers";

const Dashboard = () => {
  const { user } = useAuth(); // 👈 2. GET USER HERE
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    matchedOpportunities: 0,
    profileCompletion: 0,
  });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 3. Safety Check: Don't fetch if profile isn't loaded yet
      if (!user?.profile?._id) return;

      try {
        const [dashboardResponse, matchesResponse] = await Promise.all([
          studentsApi.getDashboard(),
          matchingApi.getMatchedOpportunities({ limit: 5 }),
        ]);

        if (dashboardResponse?.success) {
          setStats({
            totalApplications: dashboardResponse.data?.totalApplications || 0,
            pendingApplications:
              dashboardResponse.data?.pendingApplications || 0,
            matchedOpportunities:
              dashboardResponse.data?.matchedOpportunities || 0,
            profileCompletion: dashboardResponse.data?.profileCompletion || 0,
          });
        }

        if (matchesResponse?.success) {
          setMatches(matchesResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.profile?._id]); // 👈 4. DEPENDENCY: Only runs when profile ID changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's your overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ... (Rest of your JSX remains the same) ... */}
        {/* I'll include the start of the mapping so you know where it fits */}
        {[
          {
            title: "Total Applications",
            value: stats.totalApplications,
            icon: HiBriefcase,
            color: "bg-blue-500",
          },
          {
            title: "Pending Applications",
            value: stats.pendingApplications,
            icon: HiClipboardCheck,
            color: "bg-yellow-500",
          },
          {
            title: "Matched Opportunities",
            value: stats.matchedOpportunities,
            icon: HiStar,
            color: "bg-green-500",
          },
          {
            title: "Profile Completion",
            value: `${stats.profileCompletion}%`,
            icon: HiUser,
            color: "bg-purple-500",
          },
        ].map((stat, index) => (
          <Card key={index} hover>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* ... Rest of your component (Matches & Quick Actions) ... */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Recent Matches</h2>
          </Card.Header>
          <Card.Body>
            {matches.length > 0 ? (
              <div className="space-y-4">
                {matches.slice(0, 5).map((match) => (
                  <div
                    key={match.opportunity?._id}
                    className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          to={`${ROUTES.STUDENT_OPPORTUNITIES}/${match.opportunity?._id}`}
                          className="text-lg font-medium text-primary-600 hover:text-primary-700"
                        >
                          {match.opportunity?.title}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          {match.opportunity?.recruiterId?.companyName}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`text-lg font-bold ${getMatchScoreColor(match.matchScore)}`}
                        >
                          {match.matchScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Link
                  to={ROUTES.STUDENT_MATCHES || "#"} // Ensure this route exists or fallback
                  className="block text-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all matches →
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No matches yet</p>
            )}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to={ROUTES.STUDENT_SKILLS}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
              >
                <p className="font-medium text-gray-900">Add Skill</p>
              </Link>
              <Link
                to={ROUTES.STUDENT_PROJECTS}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
              >
                <p className="font-medium text-gray-900">Add Project</p>
              </Link>
              <Link
                to={ROUTES.STUDENT_ACHIEVEMENTS}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
              >
                <p className="font-medium text-gray-900">Add Achievement</p>
              </Link>
              <Link
                to={ROUTES.STUDENT_OPPORTUNITIES}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
              >
                <p className="font-medium text-gray-900">Browse Jobs</p>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
