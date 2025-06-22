import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  description?: string;
  duration?: number;
}

export const showToast = (
  type: ToastType,
  title: string = "Something happened",
  options: ToastOptions = {}
) => {
  const { description, ...rest } = options;

  switch (type) {
    case 'success':
      toast.success(title, { description, ...rest });
      break;
    case 'error':
      toast.error(title, { description, ...rest });
      break;
    case 'info':
      toast.info(title, { description, ...rest });
      break;
    case 'warning':
      toast.warning(title, { description, ...rest });
      break;
    default:
      toast(title, { description, ...rest });
  }
};