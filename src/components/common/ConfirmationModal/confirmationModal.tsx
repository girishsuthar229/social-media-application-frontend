import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import BackButton from "../BackButton";

interface IButtonProps {
  onClick?: () => void;
  buttonText: string;
}

interface IConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
  confirmButton?: IButtonProps;
  denyButton?: IButtonProps;
  className?: string;
  title?: string;
}

const ConfirmationDialog = ({
  open,
  onClose,
  content,
  confirmButton,
  denyButton,
  className,
  title,
}: IConfirmationModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} className={className}>
      {title && (
        <DialogTitle className="common-modal-title">{title}</DialogTitle>
      )}
      <DialogContent className="common-dialog-content">{content}</DialogContent>
      <DialogActions className="common-dialog-action">
        {denyButton && (
          <BackButton
            onClick={denyButton.onClick}
            labelText={denyButton.buttonText}
            showIcon={false}
            underlineOnHover={false}
            className="deny-btn"
          />
        )}

        {confirmButton && (
          <BackButton
            onClick={confirmButton.onClick}
            labelText={confirmButton.buttonText}
            showIcon={false}
            underlineOnHover={false}
            className="confirm-btn"
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
