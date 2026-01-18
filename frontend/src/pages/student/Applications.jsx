import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import { studentsApi } from '../../services/api/students';
import Card from '../../components/common/Card/Card';
import Spinner from '../../components/common/Spinner/Spinner';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import Badge from '../../components/common/Badge/Badge';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants'; // 2. Import ROUTES

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await studentsApi.getApplications();
      if (response.success) {
        setApplications(response.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="mt-2 text-gray-600">Track your job applications</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : applications.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((application) => (
            // 3. Wrap Card in Link
            <Link 
              key={application._id} 
              to={`${ROUTES.STUDENT_APPLICATIONS}/${application._id}`}
              className="block transition-transform hover:-translate-y-1"
            >
              <Card hover className="h-full cursor-pointer">
                <Card.Body>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600">
                        {application.opportunityId?.title || 'Unknown Job'}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {application.opportunityId?.recruiterId?.companyName || 'Unknown Company'}
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                        {application.matchScore && (
                          <span className="text-sm text-gray-600">
                            Match Score: {Math.round(application.matchScore)}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Applied on {formatDate(application.appliedAt)}
                      </p>
                    </div>
                    
                    {/* Optional: Add a subtle arrow icon */}
                    <div className="text-gray-400">
                      →
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applications yet"
          message="Start applying to opportunities to see them here"
        />
      )}
    </div>
  );
};

export default Applications;