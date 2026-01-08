import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { opportunitiesApi } from '../../services/api/opportunities';
import Card from '../../components/common/Card/Card';
import Spinner from '../../components/common/Spinner/Spinner';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import Badge from '../../components/common/Badge/Badge';
import { formatSalaryRange, formatDate } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';
import { OPPORTUNITY_TYPES, LOCATION_TYPES } from '../../utils/constants';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    search: '',
  });

  useEffect(() => {
    fetchOpportunities();
  }, [filters]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const response = await opportunitiesApi.getAll(filters);
      if (response.success) {
        setOpportunities(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
        <p className="mt-2 text-gray-600">Browse and apply to job opportunities</p>
      </div>

      <Card>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search opportunities..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select
              placeholder="Filter by type"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              options={[
                { value: '', label: 'All Types' },
                ...Object.values(OPPORTUNITY_TYPES).map((type) => ({
                  value: type,
                  label: type.charAt(0).toUpperCase() + type.slice(1),
                })),
              ]}
            />
            <Select
              placeholder="Filter by location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              options={[
                { value: '', label: 'All Locations' },
                ...Object.values(LOCATION_TYPES).map((loc) => ({
                  value: loc,
                  label: loc.charAt(0).toUpperCase() + loc.slice(1),
                })),
              ]}
            />
          </div>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {opportunities.map((opportunity) => (
            <Card key={opportunity._id} hover>
              <Card.Body>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link
                      to={`${ROUTES.STUDENT_OPPORTUNITIES}/${opportunity._id}`}
                      className="text-xl font-semibold text-primary-600 hover:text-primary-700"
                    >
                      {opportunity.title}
                    </Link>
                    <p className="text-gray-600 mt-1">{opportunity.recruiterId?.companyName}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <Badge variant="primary">{opportunity.type}</Badge>
                      <Badge variant="info">
                        {opportunity.location?.type || 'Not specified'}
                      </Badge>
                      {opportunity.salaryRange && (
                        <span className="text-sm text-gray-600">
                          {formatSalaryRange(
                            opportunity.salaryRange.min,
                            opportunity.salaryRange.max,
                            opportunity.salaryRange.currency
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2 line-clamp-2">{opportunity.description}</p>
                    {opportunity.applicationDeadline && (
                      <p className="text-sm text-gray-500 mt-2">
                        Deadline: {formatDate(opportunity.applicationDeadline)}
                      </p>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No opportunities found" message="Try adjusting your filters" />
      )}
    </div>
  );
};

export default Opportunities;
