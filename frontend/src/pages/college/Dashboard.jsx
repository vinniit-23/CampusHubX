import { useState, useEffect } from 'react';
import { collegesApi } from '../../services/api/colleges';
import { achievementsApi } from '../../services/api/achievements';
import Card from '../../components/common/Card/Card';
import Spinner from '../../components/common/Spinner/Spinner';
import { HiUserGroup, HiCheckCircle, HiClock, HiAcademicCap } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import Badge from '../../components/common/Badge/Badge';
import { formatDate } from '../../utils/helpers';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    verifiedStudents: 0,
    pendingVerifications: 0,
    verifiedAchievements: 0,
  });
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [verificationsResponse] = await Promise.all([
        achievementsApi.getPending(),
      ]);

      if (verificationsResponse?.success) {
        setPendingVerifications(verificationsResponse.data || []);
        setStats({
          totalStudents: 0, // Will be updated when API is ready
          verifiedStudents: 0,
          pendingVerifications: verificationsResponse.data?.length || 0,
          verifiedAchievements: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: HiUserGroup,
      color: 'bg-blue-500',
    },
    {
      title: 'Verified Students',
      value: stats.verifiedStudents,
      icon: HiCheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications,
      icon: HiClock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Verified Achievements',
      value: stats.verifiedAchievements,
      icon: HiAcademicCap,
      color: 'bg-purple-500',
    },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">College Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage students and verifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pending Verifications</h2>
            <Link
              to={ROUTES.COLLEGE_VERIFICATIONS}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          {pendingVerifications.length > 0 ? (
            <div className="space-y-4">
              {pendingVerifications.slice(0, 5).map((verification) => (
                <div
                  key={verification._id}
                  className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {verification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Student: {verification.studentId?.firstName}{' '}
                        {verification.studentId?.lastName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted: {formatDate(verification.createdAt)}
                      </p>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No pending verifications</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
