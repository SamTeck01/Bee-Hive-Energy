import { useLoading } from './LoadingContext.jsx';
import loading from '../assets/loading.png';

export default function FullPageLoader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-40 h-40 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
        {/* Rolling dots or spinner */}
        <div className="relative w-20 h-20">
            <img src={loading} alt="loading" className='animate-spin' />
        </div>
      </div>
    </div>
  );
}
