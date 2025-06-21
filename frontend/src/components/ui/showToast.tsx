import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  description?: string;
}

export const showToast = (type: ToastType, title: string, options: ToastOptions = {}) => {
  const { description, ...restOptions } = options;
  
  switch (type) {
    case 'success':
      toast.success(title, { description, ...restOptions });
      break;
    case 'error':
      toast.error(title, { description, ...restOptions });
      break;
    case 'info':
      toast.info(title, { description, ...restOptions });
      break;
    case 'warning':
      toast.warning(title, { description, ...restOptions });
      break;
    default:
      toast(title, { description, ...restOptions });
  }
};