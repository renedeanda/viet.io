import { Company } from '../types/company.types';
import CompanyContainer from './companyContainer';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export default function CompanyModal({ company, open, onClose }: {
  company: Company,
  open: boolean,
  onClose: any
}) {

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 bg-transparent border-0 shadow-none">
        <CompanyContainer modal company={company} />
      </DialogContent>
    </Dialog>
  )
}