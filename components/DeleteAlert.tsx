import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type DeleteAlertProps = {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: React.Dispatch<React.SetStateAction<any | null>>;
};

const DeleteAlert: React.FC<DeleteAlertProps> = ({
  isOpen,
  onOpenChange,
  onDelete,
  setState,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onOpenChange(false);
              setState(null);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onOpenChange(false);
              onDelete();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlert;
