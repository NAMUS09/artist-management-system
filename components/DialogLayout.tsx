import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

type DialogLayoutProps = {
  open: boolean;
  isEdit: boolean;
  title: string;
  handleOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

const DialogLayout: React.FC<DialogLayoutProps> = ({
  open,
  isEdit,
  title,
  handleOpenChange,
  children,
}) => {
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit" : "Add"} {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogLayout;
