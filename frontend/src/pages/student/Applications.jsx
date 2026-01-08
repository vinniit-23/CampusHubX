import { useState, useEffect } from 'react';
import { studentsApi } from '../../services/api/students';
import Card from '../../components/common/Card/Card';
import Spinner from '../../components/common/Spinner/Spinner';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import Badge from '../../components/common/Badge/Badge';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { APPLICATION_STATUS } from '../../utils/constants';

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
        setApplications(response.data || []);
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
            <Card key={application._id} hover>
              <Card.Body>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {application.opportunityId?.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {application.opportunityId?.recruiterId?.companyName}
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                      {application.matchScore && (
                        <span className="text-sm text-gray-600">
                          Match Score: {application.matchScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Applied on {formatDate(application.appliedAt)}
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
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
