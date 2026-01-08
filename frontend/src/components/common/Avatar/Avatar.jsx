import { getInitials } from '../../../utils/helpers';
import clsx from 'clsx';

const Avatar = ({ src, name, size = 'md', className, ...props }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const [firstName, lastName] = name ? name.split(' ') : ['', ''];

  return (
    <div
      className={clsx(
        'rounded-full bg-primary-600 text-white flex items-center justify-center font-medium overflow-hidden',
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(firstName, lastName)}</span>
      )}
    </div>
  );
};

export default Avatar;
