import { HiOutlineInbox } from 'react-icons/hi';

const EmptyState = ({ title = 'No data found', message, icon: Icon = HiOutlineInbox, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Icon className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {message && <p className="text-sm text-gray-500 text-center mb-4">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
